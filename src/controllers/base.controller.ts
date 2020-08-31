import * as express from 'express';

import Controler from './controller';
import Service from '../services/service';

class BaseController implements Controler{

    service: Service;

    constructor(service: Service){
        this.service = service;
    }

    get = async(req : express.Request , res : express.Response) => {
        const entityId = req.params.id; 
        const userId = res.locals.jwt.user._id;
        const entity = await this.service.get(userId, entityId);
        return res.send(entity);
    }

    getAll = async(req : express.Request , res : express.Response) => {
        let userId ;
        try {
            userId = res.locals.jwt.user._id;
        } catch (error) {
            
        }

        const pageSize :number = parseInt(req.query.pageSize+'') || 5
        const pageNum :number = parseInt(req.query.pageNum+'') || 1
        
        const query = req.body.query

        const attributes = undefined

        const result = await this.service.getAll(userId, query, pageSize, pageNum, attributes);
        return res.send(result);
    }

    update = async(req : express.Request , res : express.Response) => {
        const entityId = req.params.id; 
        const body = req.body; 
        const userId = res.locals.jwt.user._id;

        const updatedEntity = await this.service.update(userId, entityId, body);

        return res.send(updatedEntity);
    }

    delete = async(req : express.Request , res : express.Response) => {
        const entityId = req.params.id; 
        const userId = res.locals.jwt.user._id;
        const deletedEntity = await this.service.delete(userId, entityId);
        return res.send(deletedEntity);
    }

}
export default BaseController;