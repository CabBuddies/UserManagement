import * as express from 'express';

import BaseController from './base.controller';

import {UserService} from '../services';

class UserController extends BaseController{
    constructor(){
        super(new UserService())
    }

    getMe = async(req : express.Request , res : express.Response) => {
        try {
            const userId = res.locals.jwt.user._id;
            console.log('authToken id :',userId)
            const result = await this.service.get(userId, userId);
            return res.send(result);
        } catch (error) {
            console.log(error);
            res.sendStatus(error.status)
        }
    }

    getId = async(req : express.Request , res : express.Response) => {
        try {
            const userId = res.locals.jwt.user._id;
            console.log('authToken id :',userId)
            const result = await this.service.get(userId, userId);
            return res.send(result);
        } catch (error) {
            console.log(error);
            res.sendStatus(error.status)
        }
    }
}
export default UserController;