import * as express from 'express';
import * as jwtHelper from '../helpers/jwt.helper';

export default function authCheck(required: boolean = true){
    console.log('\n\nAMJ\n\n',required)
    return function ( req : express.Request , res : express.Response , next : express.NextFunction ) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        res.locals.jwt = {user:{},token}

        console.log('1required',required,req.url,'reqtoken : ',res.locals.jwt.token)

        if (token == null || token == undefined) {
            if(required)
                return res.sendStatus(401)
            return next()
        }
    
        jwtHelper.decodeAccessToken(token,function(err,user){
            console.log('2required',required,err)
            
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