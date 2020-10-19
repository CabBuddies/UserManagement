import { Router } from 'express';
import { Middlewares } from 'node-library';
import { AuthController } from '../controllers';

const router = Router()

const authController = new AuthController()

const validatorMiddleware = new Middlewares.ValidatorMiddleware();

const schema = {
    "type": "object",
    "additionalProperties": false,
    "required": ["firstName","lastName","email","password","registrationType"],
    "properties": {
        "firstName":{
            "type":"string"
        },
        "lastName":{
            "type":"string"
        },
        "email":{
            "type":"string"
        },
        "password":{
            "type":"string"
        },
        "registrationType":{
            "type":"string",
            "enum":['inapp', 'google', 'facebook', 'twitter', 'linkedin']
        }
    }
};

router.post('/sign_up',validatorMiddleware.validateRequestBody({
    "type": "object",
    "additionalProperties": false,
    "required": ["firstName","lastName","email","password","registrationType"],
    "properties": {
        "firstName":{
            "type":"string"
        },
        "lastName":{
            "type":"string"
        },
        "email":{
            "type":"string"
        },
        "password":{
            "type":"string"
        },
        "registrationType":{
            "type":"string",
            "enum":['inapp', 'google', 'facebook', 'twitter', 'linkedin']
        }
    }
}),authController.signUp)
router.post('/sign_in',validatorMiddleware.validateRequestBody({
    "type": "object",
    "additionalProperties": false,
    "required": ["email","password"],
    "properties": {
        "email":{
            "type":"string"
        },
        "password":{
            "type":"string"
        }
    }
}),authController.signIn)
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