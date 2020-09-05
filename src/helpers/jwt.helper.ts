import * as config from "../config";
import * as jwt from 'jsonwebtoken';

interface Auth{
    id : string,
    email : string,
    expiryTime : number,
    [propName: string]: any
}

const TIME = {
    s30 : 30,
    m30 : 30*60,
    d30 : 30*24*60*60
};

const SECRET_TYPE = {
    access:'access',
    refresh:'refresh'
}

const getSecret = (type:string) => {
    switch (type.toLowerCase()) {
        case SECRET_TYPE.access:
            return config.ACCESS_TOKEN_SECRET;
        case SECRET_TYPE.refresh:
            return config.REFRESH_TOKEN_SECRET;
        default:
            return 'none';
    }
}

const encodeToken = function(
    decoded:Auth,
    type:string,
    seconds:number
) {
    decoded.expiryTime = Date.now()+(seconds*1000);
    return {
        value: jwt.sign(decoded, getSecret(type), {'expiresIn':seconds+'s'}),
        expiryTime : decoded.expiryTime
    };
};

const decodeToken = function(
    token:{
        type:string,
        value:string
    }
    ) : Promise<Auth> {
    return new Promise(function(resolve, reject) {
        jwt.verify(token.value,getSecret(token.type),function(err,decoded:Auth){
            if(err)
                resolve(undefined);
            else
                resolve(decoded);
        });
    });
}

export {
    Auth,
    TIME,
    SECRET_TYPE,
    encodeToken,
    decodeToken
}