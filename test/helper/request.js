const axios = require('axios');
const config = require('./config');

async function apiRequest(packet){
    try {
        const response = await axios(packet)
        const {status,data} = response
        return {status,data}
    } catch (error) {
        return {
            status:error.response.data.status || 500,
            data:{
                error:error.response.data.message||'unknown server issue'
            }
        }
    }
}

async function formattedApiRequest({host,path,url,method,headers,token,params,data}){
    host = host || config.HOST
    path = path || ''
    url = host+path
    method = method || 'get' 
    if(token){
        if(headers == undefined || headers == null){
            headers = {}
        }
        headers["authorization"] = "Token "+token
    }
    return await apiRequest({
        url,method,headers,token,params,data
    })
}

module.exports = {
    apiRequest,
    formattedApiRequest
};