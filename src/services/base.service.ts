import Service from './service';
import Repository from '../repositories/repository';

class BaseService implements Service{
    repository : Repository;

    constructor(repository : Repository){
        this.repository = repository;
    }

    buildError(errorCode = 500,errorMessage = "Unknown Server Error."){
        const error = {};
        error['status'] = errorCode;
        error['message'] = errorMessage;
        return error;
    }

    get = async(userId, entityId, attributes={}) => {
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

    getAll = async(userId, query = {}, pageSize = 5, pageNum = 1,attributes={}) => {
        if(attributes){
            attributes['password']=0;
        }
        return await this.repository.getAll(query, pageSize, pageNum,attributes);
    }

    create = async(userId, entity) => {
        return await this.repository.create(entity);
    }

    update = async(userId, entityId, entity) => {
        if(!entityId){
            throw this.buildError(400,"entityId is required.");
        }

        return await this.repository.update(entityId, entity);
    }

    delete = async(userId, entityId) => {
        if(!entityId){
            throw this.buildError(400,"entityId is required.");
        }

        return await this.repository.delete(entityId);
    }
}
export default BaseService;