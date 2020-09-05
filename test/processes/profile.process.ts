import {expect} from '../helper/chai.helper';

import * as request from '../helper/request.helper'
import * as common from '../helper/common.helper';
import config from '../helper/config.helper';

interface AccessPacket{
    accessToken:string,
    responseStatus?:number
}

async function me(data : AccessPacket){
    data.responseStatus = data.responseStatus||200;

    let response = await request.formattedApiRequest({
        method:'get',
        path:config.PATH.PROFILE.ME,
        token:{
            type:'access',
            value:data.accessToken
        }
    });
    
    console.log(response)
    
    expect(response.status).to.equal(data.responseStatus)

    return response.data || {}
}


interface OptionalAccessPacket{
    [key : string]:any,
    accessToken?:string,
    responseStatus?:number
}

async function email(data : OptionalAccessPacket){
    data.responseStatus = data.responseStatus||200;

    const req : any = {
        method:'get',
        path:config.PATH.PROFILE.EMAIL,
        params:{
            email:data.email
        }
    };

    if(data.accessToken){
        req.token = {
            type:'access',
            value:data.accessToken
        };
    }

    let response = await request.formattedApiRequest(req);
    
    console.log(response)
    
    expect(response.status).to.equal(data.responseStatus)

    return response.data || {}
}

export {
    email,
    me
}