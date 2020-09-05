import {expect} from '../helper/chai.helper';

import * as request from '../helper/request.helper'
import * as common from '../helper/common.helper';
import config from '../helper/config.helper';

interface SignUpPacket{
    email:string,
    password:string,
    firstName:string,
    lastName:string,
    registrationType?:string,
    responseStatus?:number
}

async function signUp(data:SignUpPacket){
    data.registrationType = data.registrationType||'InApp';
    data.responseStatus = data.responseStatus||201;
    let response = await request.formattedApiRequest({
        method:'post',
        path:config.PATH.AUTH.SIGN_UP,
        data
    });
    
    console.log(response)
    
    expect(response.status).to.equal(data.responseStatus)

    if(response.status === 201){
        common.nonEmptyString(response.data.accessToken.value)
        common.nonEmptyString(response.data.refreshToken.value)
    }

    return response.data || {}
}

interface SignInPacket{
    email:string,
    password:string,
    responseStatus?:number
}

async function signIn(data:SignInPacket){
    data.responseStatus = data.responseStatus||201;
    
    let response = await request.formattedApiRequest({
        method:'post',
        path:config.PATH.AUTH.SIGN_IN,
        data
    });
    
    console.log(response)
    
    expect(response.status).to.equal(data.responseStatus)

    if(response.status === 201){
        common.nonEmptyString(response.data.accessToken.value)
        common.nonEmptyString(response.data.refreshToken.value)
    }

    return response.data || {}
}


interface RefreshPacket{
    refreshToken:string,
    responseStatus?:number
}

async function signOut(data : RefreshPacket){
    data.responseStatus = data.responseStatus||204;

    let response = await request.formattedApiRequest({
        method:'delete',
        path:config.PATH.AUTH.SIGN_OUT,
        token:{
            type:'refresh',
            value:data.refreshToken
        }
    });
    
    console.log(response)
    
    expect(response.status).to.equal(data.responseStatus)

    return response.data || {}
}

async function signOutAll(data : RefreshPacket){
    data.responseStatus = data.responseStatus||204;

    let response = await request.formattedApiRequest({
        method:'delete',
        path:config.PATH.AUTH.SIGN_OUT_ALL,
        token:{
            type:'refresh',
            value:data.refreshToken
        }
    });
    
    console.log(response)
    
    expect(response.status).to.equal(data.responseStatus)

    return response.data || {}
}

async function getAccessToken(data : RefreshPacket){
    data.responseStatus = data.responseStatus||201;

    let response = await request.formattedApiRequest({
        method:'get',
        path:config.PATH.AUTH.GET_ACCESS_TOKEN,
        token:{
            type:'refresh',
            value:data.refreshToken
        }
    });
    
    console.log(response)
    
    expect(response.status).to.equal(data.responseStatus)

    if(response.status === 201){
        common.isNumber(response.data.accessToken.expiryTime)
        common.nonEmptyString(response.data.accessToken.value)
    }

    return response.data || {}
}

export {
    getAccessToken,
    signIn,
    signOut,
    signOutAll,
    signUp
}