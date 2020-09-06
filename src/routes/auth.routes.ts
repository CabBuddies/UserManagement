import { Router } from 'express';
import { Middlewares } from 'node-library';
import { AuthController } from '../controllers';

const router = Router()

const authController = new AuthController()

router.post('/sign_up',authController.signUp)
router.post('/sign_in',authController.signIn)
router.get('/access_token',Middlewares.authCheck(true,true),authController.getAccessToken)
router.delete('/sign_out',Middlewares.authCheck(true,true),authController.signOut)
router.delete('/sign_out_all',Middlewares.authCheck(true,true),authController.signOutAll)

router.delete('/delete_all',authController.deleteAll)

export { router };

/*
{
    userAuth:{
        email:1,
        password:1,
        account:{
            type:1
        }
    },
    userDetails:{
        firstName:1,
        lastName:1
    }
}
*/