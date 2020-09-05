//const BaseController = require('./base.controller')
import * as express from 'express';
import Service from '../services/service';
import {AuthService} from '../services';
import Request from '../helpers/request.helper';
import BaseController from './base.controller';

class AuthController extends BaseController{
    
    constructor(){
        super(new AuthService());
    }

    signUp = async(req : express.Request , res : express.Response) => {
        const { body } = req;
        const request : Request = res.locals.request;
        try {
            const creds = await this.service.signUp(request,body);
            return res.status(201).send(creds);
        } catch (error) {
            console.log(error)
            return res.status(error.status).send(error);
        }
    }

    signIn = async(req : express.Request , res : express.Response) => {
        const { body } = req;
        const request : Request = res.locals.request;
        try {
            console.log(request,body);
            const creds = await this.service.signIn(request,body);
            console.log(creds);
            return res.status(201).send(creds);
        } catch (error) {
            console.log('blah')
            console.log(error)
            return res.status(error.status).send(error);
        }
    }

    getAccessToken = async(req : express.Request , res : express.Response) => {
        const request : Request = res.locals.request;
        res.status(201).send(await this.service.getAccessToken(request));
    }

    signOut = async(req : express.Request , res : express.Response) => {
        const request : Request = res.locals.request;
        await this.service.signOut(request);
        res.sendStatus(204)
    }

    signOutAll = async(req : express.Request , res : express.Response) => {
        const request : Request = res.locals.request;
        await this.service.signOutAll(request);
        res.sendStatus(204)
    }

}
export default AuthController;