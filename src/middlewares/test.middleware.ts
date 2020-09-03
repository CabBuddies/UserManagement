import * as express from 'express';

export default function testMiddleware(custom:string='none'){
    return function( req : express.Request , res : express.Response , next : express.NextFunction ){
        res.locals.custom=custom;
        console.log(res.locals);
        next();
    }
}