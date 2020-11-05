import {Repositories} from 'node-library';
import {UserRelation} from '../models';

class UserRelationRepository extends Repositories.AuthorRepository {
    constructor(){
        super(UserRelation);
    }

    getRequestedFollowers = async(userId:string) => {
        return this.model.find({
            followeeId:userId,
            status:'requested'
        });
    }

    getAcceptedFollowers = async(userId:string) => {
        return this.model.find({
            followeeId:userId,
            status:'accepted'
        });
    }

    getRejectedFollowers = async(userId:string) => {
        return this.model.find({
            followeeId:userId,
            status:'rejected'
        });
    }

    getRequestedFollowees = async(userId:string) => {
        return this.model.find({
            followerId:userId,
            status:'requested'
        });
    }

    getAcceptedFollowees = async(userId:string) => {
        return this.model.find({
            followerId:userId,
            status:'accepted'
        });
    }

    getRejectedFollowees = async(userId:string) => {
        return this.model.find({
            followerId:userId,
            status:'rejected'
        });
    }

    deleteRelation = async(_id:string,userId:string) => {
        // WHERE _ID = _ID AND ( (FOLLOWEE_ID=USER_ID) OR (FOLLOWER_ID=USER_ID AND STATUS IN ['accepted','requested']) )
        return this.model.deleteOne({
            _id,
            $or:[
                {
                    followeeId:userId,
                },{
                    followerId:userId,
                    status:{$in:['accepted','requested']}
                }
            ]
        })
    }

}

export default UserRelationRepository;