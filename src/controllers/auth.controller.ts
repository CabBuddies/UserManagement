//const BaseController = require('./base.controller')
import * as express from 'express';
import Service from '../services/service';
import {AuthService} from '../services';
class AuthController{
    service : Service;
    
    constructor(){
        this.service = new AuthService()
        console.log(this.service)
    }

    signUp = async(req : express.Request , res : express.Response) => {
        const { body } = req;
        try {
            const creds = await this.service.signUp(body);
            return res.status(201).send(creds);
        } catch (error) {
            console.log(error)
            return res.status(error.status).send(error);
        }
    }

    signIn = async(req : express.Request , res : express.Response) => {
        const { body } = req;
        try {
            const creds = await this.service.signIn(body);
            return res.status(201).send(creds);
        } catch (error) {
            console.log('blah')
            console.log(error)
            return res.status(error.status).send(error);
        }
    }

    signOut = async(req : express.Request , res : express.Response) => {
        
    }

}
export default AuthController;