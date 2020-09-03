import * as express from 'express';

function ipInfoCapture(version : string){
    return ( req : express.Request , res : express.Response , next : express.NextFunction ) => {
        console.log('logger version',version)

        var xForwardedFor = ((req.headers['x-forwarded-for']+'') || '').replace(/:\d+$/, '');
        var ip = xForwardedFor || req.connection.remoteAddress;
        res.locals.ip = ip;
        next();
    }
}

export {ipInfoCapture};