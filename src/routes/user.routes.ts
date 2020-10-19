import * as express from 'express';
import { Router } from 'express';
import { Middlewares } from 'node-library';
import { UserController } from '../controllers'

const router = Router()

const userController = new UserController()

const validatorMiddleware = new Middlewares.ValidatorMiddleware();

const schema = {
    "type": "object",
    "additionalProperties": false,
    "required": ["firstName","lastName","displayPicture"],
    "properties": {
        "firstName":{
            "type":"string"
        },
        "lastName":{
            "type":"string"
        },
        "displayPicture":{
            "type":"string"
        }
    }
};

router.get('/',Middlewares.authCheck(false),userController.getAll)

router.put('/',Middlewares.authCheck(true),validatorMiddleware.validateRequestBody(schema),userController.update)

router.get('/me',Middlewares.authCheck(true),userController.getMe)

router.get('/:id',Middlewares.authCheck(false),userController.getId)

router.delete('/delete_all',userController.deleteAll)

export{ router }