const expect = require('chai').expect;
const assert = require('chai').assert;

const apiRequest = require('../../helper/request');

const auth = require('../../processes/auth');
const common = require('../../helper/common');
const config = require('../../helper/config');

describe('Auth', function () {
    describe('Request Access Token', function () {
        it('with good refreshToken', async function () {
            const data = await auth.signIn("nihal+test1@cabbuddies.com","strong");

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