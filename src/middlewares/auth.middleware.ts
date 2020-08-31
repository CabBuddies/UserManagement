import * as express from 'express';
import * as jwtHelper from '../helpers/jwt.helper';

export default function authCheck(required: boolean = true){
    console.log('\n\nAMJ\n\n',required)
    return ( req : express.Request , res : express.Response , next : express.NextFunction ) => {
        console.log(req.headers)
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        res.locals.jwt = {}
        res.locals.jwt.user = {}
        res.locals.jwt.token = token
        console.log('reqtoken : ',res.locals.jwt.token)
        if (token == null) {
            if(required )
                return res.sendStatus(401)
            return next()
        }
    
        jwtHelper.decodeAccessToken(token,function(err,user){
            console.log(required,err)
            
            if (err) {
                if (required) {
                    return res.sendStatus(403)
                }
            }else{
                res.locals.jwt.user = user
            }
            next()
        });
    }
}