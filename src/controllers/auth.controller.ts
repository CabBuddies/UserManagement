//const BaseController = require('./base.controller')
import * as express from 'express';
import {AuthService} from '../services';
import {Helpers} from 'node-library';
import {Controllers} from 'node-library';

class AuthController extends Controllers.BaseController{
    
    constructor(){
        super(new AuthService());
    }

    signUp = async(req : express.Request , res : express.Response) => {
        const { body } = req;
        const request : Helpers.Request = res.locals.request;
        try {
            const creds = await this.service.signUp(request,body);
            return res.status(201).send(creds);
        } catch (error) {
            console.log(error)
            return res.status(error.status).send(error.message);
        }
    }

    signIn = async(req : express.Request , res : express.Response) => {
        const { body } = req;
        const request : Helpers.Request = res.locals.request;
        try {
            console.log(request,body);
            const creds = await this.service.signIn(request,body);
            console.log(creds);
            return res.status(201).send(creds);
        } catch (error) {
            console.log('blah')
            console.log('signIn auth controller',error)
            return res.status(error.status).send(error.message);
        }
    }

    getAccessToken = async(req : express.Request , res : express.Response) => {
        const request : Helpers.Request = res.locals.request;
        res.status(201).send(await this.service.getAccessToken(request));
    }

    signOut = async(req : express.Request , res : express.Response) => {
        const request : Helpers.Request = res.locals.request;
        await this.service.signOut(request);
        res.sendStatus(204)
    }

    signOutAll = async(req : express.Request , res : express.Response) => {
        const request : Helpers.Request = res.locals.request;
        await this.service.signOutAll(request);
        res.sendStatus(204)
    }

}
export default AuthController;