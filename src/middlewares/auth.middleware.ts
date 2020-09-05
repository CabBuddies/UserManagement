import * as express from 'express';
import Request from '../helpers/request.helper';

export default function authCheck(required: boolean = true,isRefresh: boolean = false){
    console.log('AMJ',required,isRefresh)
    return function ( req : express.Request , res : express.Response , next : express.NextFunction ) {
        try {
            const request :Request = res.locals.request;
            console.log('AMJ',request);
            if(required){
                console.log('AMJ',required)
                if(request.hasToken == false){
                    console.log('AMJ',401)
                    return res.sendStatus(401);
                }
                if(
                    (request.isTokenExpired())
                    ||
                    (request.isUserAuthenticated() == false)
                    ||
                    (isRefresh !== (request.getToken().type === 'refresh'))
                ){
                    console.log('AMJ',403)
                    return res.sendStatus(403);
                }
            }
            console.log('AMJ','done')
            next()
        } catch (error) {
            console.log(error)
        }
    }
}