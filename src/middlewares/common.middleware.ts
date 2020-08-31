import * as express from 'express';

export default function(version : string){
    return ( req : express.Request , res : express.Response , next : express.NextFunction ) => {
        res.locals._ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        next()
    }
}