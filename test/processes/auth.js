const expect = require('chai').expect;

const formattedApiRequest = require('../helper/request').formattedApiRequest;
const common = require('../helper/common');

async function signUp({
    email,
    password,
    firstName,
    lastName,
    registrationType,
    responseStatus
}){
    registrationType = registrationType||'InApp';
    responseStatus = responseStatus||201;
    let response = await formattedApiRequest({
        method:'post',
        path:'/api/v1/auth/sign_up',
        data:{
            email,
            password,
            firstName,
            lastName,
            registrationType
        }
    });
    
    console.log(response)
    
    expect(response.status).to.equal(responseStatus)

    if(response.status === 201){
        common.nonEmptyString(response.data.accessToken.value)
        common.nonEmptyString(response.data.refreshToken.value)
    }

    return response.data || {}
}

async function signIn({
    email,
    password,
    responseStatus
}){
    responseStatus = responseStatus||201;
    
    let response = await formattedApiRequest({
        method:'post',
        path:'/api/v1/auth/sign_in',
        data:{
            email,
            password
        }
    });
    
    console.log(response)
    
    expect(response.status).to.equal(responseStatus)

    if(response.status === 201){
        common.nonEmptyString(response.data.accessToken.value)
        common.nonEmptyString(response.data.refreshToken.value)
    }

    return response.data || {}
}

function signOut({
    refreshToken,
    responseStatus
}){
    responseStatus = responseStatus||201;

    let response = await formattedApiRequest({
        method:'post',
        path:'/api/v1/auth/sign_out',
        data:{
            email,
            password
        }
    });
    
    console.log(response)
    
    expect(response.status).to.equal(responseStatus)

    if(response.status === 201){
        common.nonEmptyString(response.data.accessToken.value)
        common.nonEmptyString(response.data.refreshToken.value)
    }

    return response.data || {}
}

module.exports = {
    signIn,
    signUp
}