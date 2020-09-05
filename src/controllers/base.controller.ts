import * as express from 'express';

import Controler from './controller';
import Service from '../services/service';
import Request from '../helpers/request.helper';


class BaseController implements Controler{

    service: Service;

    constructor(service: Service){
        this.service = service;
    }

    create  = async(req : express.Request , res : express.Response) => {
        const request : Request = res.locals.request;
        const body = req.body; 

        const createdEntity = await this.service.create(request, body);

        return res.send(createdEntity);
    } 

    get = async(req : express.Request , res : express.Response) => {
        const request : Request = res.locals.request;
        const entityId = req.params.id; 
        const entity = await this.service.get(request, entityId);
        return res.send(entity);
    }

    getAll = async(req : express.Request , res : express.Response) => {
        const request : Request = res.locals.request;

        const pageSize :number = parseInt(req.query.pageSize+'') || 5
        const pageNum :number = parseInt(req.query.pageNum+'') || 1
        
        const query = req.body.query

        const attributes = undefined

        const result = await this.service.getAll(request, query, pageSize, pageNum, attributes);
        return res.send(result);
    }

    update = async(req : express.Request , res : express.Response) => {
        const request : Request = res.locals.request;
        const entityId = req.params.id; 
        const body = req.body; 

        const updatedEntity = await this.service.update(request, entityId, body);

        return res.send(updatedEntity);
    }

    delete = async(req : express.Request , res : express.Response) => {
        const request : Request = res.locals.request;
        const entityId = req.params.id; 
        const deletedEntity = await this.service.delete(request, entityId);
        return res.send(deletedEntity);
    }

    deleteAll = async(req : express.Request , res : express.Response) => {
        const request : Request = res.locals.request;
        const deletedEntities = await this.service.deleteAll(request);
        return res.send(deletedEntities);
    }

}
export default BaseController;