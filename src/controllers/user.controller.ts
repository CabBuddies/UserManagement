import * as express from 'express';

import BaseController from './base.controller';

import {UserService} from '../services';
import Request from '../helpers/request.helper';

class UserController extends BaseController{
    constructor(){
        super(new UserService())
    }

    getMe = async(req : express.Request , res : express.Response) => {
        try {
            const request : Request = res.locals.request;
            console.log('request :',request)
            const result = await this.service.get(request, request.getUserId());
            return res.send(result);
        } catch (error) {
            console.log(error);
            res.sendStatus(error.status)
        }
    }

    getId = async(req : express.Request , res : express.Response) => {
        try {
            const request : Request = res.locals.request;
            console.log('request :',request)
            const result = await this.service.get(request, req.params.id);
            return res.send(result);
        } catch (error) {
            console.log(error);
            res.sendStatus(error.status)
        }
    }
}
export default UserController;