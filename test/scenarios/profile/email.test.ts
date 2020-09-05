import * as auth from '../../processes/auth.process';
import * as profile from '../../processes/profile.process';
import * as common from '../../helper/common.helper';

describe('Profile',()=>{
    describe('Email',()=>{
        it('anonymous', async function () {
            let response = await profile.email({
                email:'nihal+test1@cabbuddies.com',
                responseStatus:200
            });

            console.debug(response);
        });
    })
})