const expect = require('chai').expect;
const assert = require('chai').assert;

const apiRequest = require('../../helper/request');

const auth = require('../../processes/auth');
const common = require('../../helper/common');
const config = require('../../helper/config');

describe('Profile', function () {
    describe('Me', function () {
        it('with good refreshToken', async function () {
            const data = await auth.signIn({
                email:"nihal+test1@cabbuddies.com",
                password:"strong",
                responseStatus:201
            });

            console.log(data);

            response = await apiRequest({
                method:'get',
                url:config.HOST+'/api/v1/auth/access_token',
                headers:{
                    "authorization":"Token "+data.refreshToken
                }
            });

            const accessToken = common.jsonStructure(response,['data','accessToken'])
        });
    });
});