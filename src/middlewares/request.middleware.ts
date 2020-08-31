import * as express from 'express';

function requestCheck(requiredFields : JSON){
        return ( req : express.Request , res : express.Response , next : express.NextFunction ) => {
        const {body} = req;
        for(const field of Object.keys(requiredFields)){
            if(field in body == false){
                return res.sendStatus(400).send({'message':'missing '+field+' field in request'});
            }
        }
        next()
    }
}

export {requestCheck};