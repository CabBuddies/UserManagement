import * as express from 'express';
import Request from '../helpers/request.helper';
import * as jwtHelper from '../helpers/jwt.helper';
import {RefreshTokenRepository} from '../repositories';

const refreshTokenRepository = new RefreshTokenRepository();

function extractToken(req:express.Request){
    try {
        console.log(req.headers['authorization'])
        const p = req.headers['authorization'].split(' ');
        if(p.length==2)
            return {
                type:p[0],//refresh or access
                value:p[1],//actual token(jwt) string
                expiryTime:0//expiration time is extracted from decoded payload
            }
    } catch (error) {
        console.log(error.message)
    }
}

function extractIP(req:express.Request){
    try {
        const xForwardedFor = ((req.headers['x-forwarded-for']+'') || '').replace(/:\d+$/, '');
        const ip = xForwardedFor || req.connection.remoteAddress;
        return req.ip||ip;
    } catch (error) {
        
    }
}

const requestProcessor = async ( req : express.Request , res : express.Response , next : express.NextFunction ) => {
    try {
        const request : Request = new Request();

        request.setIP(extractIP(req));
        const token = extractToken(req);
        request.setToken(token);
    
        if(request.hasToken){
            const decoded :jwtHelper.Auth = await jwtHelper.decodeToken(request.getToken());
    
            if(decoded){

                let activeTokenCount = 1;

                if(request.getTokenType()==='refresh'){
                    activeTokenCount = await refreshTokenRepository.getActiveRefreshTokenCount(request.getTokenValue());
                }

                if(activeTokenCount === 1){
                    request.setUserId(decoded.id);
                    request.setEmail(decoded.email);
                    token.expiryTime = decoded.expiryTime;
                    request.setToken(token);
                }

            }
        }
    
        res.locals={request}
        next()
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}

export {requestProcessor};