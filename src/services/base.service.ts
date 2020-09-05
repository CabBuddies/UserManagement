import Service from './service';
import Repository from '../repositories/repository';
import Request from '../helpers/request.helper';

import * as PubSub from './pubsub';

class BaseService implements Service,PubSub.Subscriber{
    repository : Repository;

    constructor(repository : Repository){
        this.repository = repository;
    }
    
    eventListened(event: PubSub.Event) {
        console.log(event);
    }

    buildError(errorCode = 500,errorMessage = "Unknown Server Error."){
        const error = {};
        error['status'] = errorCode;
        error['message'] = errorMessage;
        return error;
    }

    get = async(request:Request, entityId, attributes={}) => {
        if(!entityId){
            throw this.buildError(400,"entityId is required.");
        }
        if(attributes){
            attributes['password']=0;
        }
        const currentEntity = await this.repository.get(entityId,attributes);

        if(!currentEntity) {
            throw this.buildError(404,"Requested entity not found.");
        }
        return currentEntity;
    }

    getAll = async(request:Request, query = {}, pageSize = 5, pageNum = 1,attributes={}) => {
        if(attributes){
            attributes['password']=0;
        }
        return await this.repository.getAll(query, pageSize, pageNum,attributes);
    }

    create = async(request:Request, entity) => {
        return await this.repository.create(entity);
    }

    update = async(request:Request, entityId, entity) => {
        if(!entityId){
            throw this.buildError(400,"entityId is required.");
        }

        return await this.repository.update(entityId, entity);
    }

    delete = async(request:Request, entityId) => {
        if(!entityId){
            throw this.buildError(400,"entityId is required.");
        }

        return await this.repository.delete(entityId);
    }

    deleteAll = async(request:Request) => {
        return await this.repository.deleteAll();
    }
}
export default BaseService;