import {Helpers,Services} from 'node-library';
import { UserRelationRepository } from '../repositories';
import {PubSubMessageTypes} from '../helpers/pubsub.helper';
import { BinderNames } from '../helpers/binder.helper';

class UserRelationService extends Services.AuthorService {

    private static instance: UserRelationService;
    
    private constructor() { 
        super(new UserRelationRepository());
    }

    public static getInstance(): UserRelationService {
        if (!UserRelationService.instance) {
            UserRelationService.instance = new UserRelationService();
        }

        return UserRelationService.instance;
    }

    // canUserAccessQuery = async(request:Helpers.Request, userId:string, queryId:string) => {
        
    //     //extract query from database

    //     const query = await Services.Binder.boundFunction(BinderNames.QUERY.CHECK.ID_EXISTS)(request,queryId);
        
    //     console.log('access.service','canUserAccessQuery','query',query);
        
    //     if(!query)
    //         throw this.buildError(404,'query not available');

    //     //check if the query of queryId is public

    //     if(query.access === "public"){
    //         console.log('query is public, so you can access it');
    //         return true;
    //     }
    //     //if not
    //     //check if the userId exists

    //     if(!userId){
    //         console.log('query is not public, so you cant access it without auth');
    //         return false;
    //     }
    //     //if not
    //     //if requestor is the query author

    //     if(query.author === userId){
    //         console.log('query is not public, but you are its author so you can access it');
    //         return true;
    //     }
    //     //if not
    //     //search for access rules that are in this format : {"queryId":queryId,userId:request.getUserId(),"status":"granted"}

    //     const _query = {};

    //     _query['author'] = query.author;
    //     _query['queryId'] = query._id;
    //     _query['userId'] = userId;
    //     _query['status'] = "granted";

    //     const data = await this.repository.getAll(_query);

    //     console.log('query access rules that allow you to read are',data.result);

    //     return data.resultTotalSize > 0;
    // }

    create = async(request:Helpers.Request,data) => {

        //followeeId,followerId,status are the information received here

        /*
            {
                "followee":"Nihal",
                "follower":"Sahana",
                "author":"Nihal",
                "status":"accepted"
            }
        */

        if(data.status === 'requested'){
            data.followeeId = request.raw.params['userId'];
            data.followerId = request.getUserId();
        }else if(data.status === 'blocked'){
            data.followerId = request.raw.params['userId'];
            data.followeeId = request.getUserId();

            /*
                Nihal wants to block Sahana
                {
                    "followee":"Nihal",
                    "follower":"Sahana",
                    "author":"Nihal",
                    "status":"blocked"
                }
                Nihal wants to unblock Sahana
                {
                    
                }
            */
        }

        data.author = data.followeeId;

        console.log('user.relation.service',request,data);

        const followee = await Services.Binder.boundFunction(BinderNames.USER.CHECK.ID_EXISTS)(request,data.followeeId);
        
        console.log('user.relation.service','create','followee',followee);

        if(!followee)
            throw this.buildError(404,'followee not available');

        const follower = await Services.Binder.boundFunction(BinderNames.USER.CHECK.ID_EXISTS)(request,data.followerId);
        
        console.log('user.relation.service','create','follower',follower);

        if(!follower)
            throw this.buildError(404,'follower not available');

        if(followee.preferences.automaticFollow){
            data.status = 'accepted';
        }

        console.log('user.relation.service','db insert',data);

        data = await this.repository.create(data);

        Services.PubSub.Organizer.publishMessage({
            request,
            type:PubSubMessageTypes.USER_RELATION.CREATED,
            data
        });

        console.log('user.relation.service','published message');

        return (await this.embedAuthorInformation(request,[data],['author','followeeId','followerId'],
            Services.Binder.boundFunction(BinderNames.USER.EXTRACT.USER_PROFILES)
        ))[0];
    }

    getAll = async(request:Helpers.Request, query = {}, sort = {}, pageSize:number = 5, pageNum:number = 1, attributes:string[] = []) => {
        const exposableAttributes = ['author','followeeId','followerId','lastModifiedAt','createdAt','status'];
        if(attributes.length === 0)
            attributes = exposableAttributes;
        else
            attributes = attributes.filter( function( el:string ) {
                return exposableAttributes.includes( el );
            });
        
        // query['author'] = request.getUserId();
        // query['queryId'] = request.raw.params['queryId'];

        query = {
            "$and":[
                query,
                {
                    "$or":[
                        {
                            "followeeId":request.getUserId()
                        },
                        {
                            "followerId":request.getUserId()
                        }
                    ]
                }
            ]
        };

        const data = await this.repository.getAll(query,sort,pageSize,pageNum,attributes);

        data.result = await this.embedAuthorInformation(request,data.result,['author','followeeId','followerId'],
        Services.Binder.boundFunction(BinderNames.USER.EXTRACT.USER_PROFILES));

        return data;
    }

    get = async(request:Helpers.Request, documentId: string, attributes?: any[]) => {

        const data = await this.repository.get(documentId);

        if(!data)
            this.buildError(404);

        Services.PubSub.Organizer.publishMessage({
            request,
            type:PubSubMessageTypes.USER_RELATION.READ,
            data
        });

        return (await this.embedAuthorInformation(request,[data],['author','followeeId','followerId'],
        Services.Binder.boundFunction(BinderNames.USER.EXTRACT.USER_PROFILES)))[0];
    }

    update = async(request:Helpers.Request,documentId:string,data) => {
        console.log('user.relation.service',request,data);

        data = Helpers.JSON.normalizeJson(data);

        console.log('user.relation.service','db update',data);

        data = await this.repository.updatePartial(documentId,data);

        Services.PubSub.Organizer.publishMessage({
            request,
            type:PubSubMessageTypes.USER_RELATION.UPDATED,
            data
        });

        return (await this.embedAuthorInformation(request,[data],['author','followeeId','followerId'],
        Services.Binder.boundFunction(BinderNames.USER.EXTRACT.USER_PROFILES)))[0];
    }

    delete = async(request:Helpers.Request,documentId:string) => {
        let data = await this.repository.deleteRelation(documentId,request.getUserId())

        Services.PubSub.Organizer.publishMessage({
            request,
            type:PubSubMessageTypes.USER_RELATION.DELETED,
            data
        });

        return (await this.embedAuthorInformation(request,[data],['author','followeeId','followerId'],
        Services.Binder.boundFunction(BinderNames.USER.EXTRACT.USER_PROFILES)))[0];
    }

}

export default UserRelationService.getInstance();