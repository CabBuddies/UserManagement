import * as express from 'express';
import { Router } from 'express';
import { Middlewares } from 'node-library';
import { UserController } from '../controllers';
import UserRelationRoutes from './user.relation.routes';

const router = Router()

const userController = new UserController()

const validatorMiddleware = new Middlewares.ValidatorMiddleware();

router.param('id',Middlewares.addParamToRequest());
router.param('userId',Middlewares.addParamToRequest());

router.get('/',Middlewares.authCheck(false),userController.getAll)

router.put('/',Middlewares.authCheck(true),validatorMiddleware.validateRequestBody({
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
        },
        "preferences":{
            "type":"object",
            "additionalProperties": false,
            "required": ["automaticFollow"],
            "properties":{
                "automaticFollow":{
                    "type":"boolean"
                }
            }
        }
    }
}),userController.update)

router.get('/me',Middlewares.authCheck(true),userController.getMe)

router.get('/:id',Middlewares.authCheck(false),userController.getId)

router.use('/:userId/relation',UserRelationRoutes);

export{ router }