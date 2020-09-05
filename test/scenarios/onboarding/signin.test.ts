import * as auth from '../../processes/auth.process';
import * as common from '../../helper/common.helper';

describe('Auth',()=>{
    describe('Sign In',()=>{
        it('with good credentials', async function () {
            const data = await auth.signIn({
                email:"nihal+test1@cabbuddies.com",
                password:"strong",
                responseStatus:201
            });

            console.debug(data);
        });
    })
})