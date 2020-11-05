import * as express from 'express';
import { Router } from 'express';
import { Middlewares, Services } from 'node-library';
import { UserRelationController } from '../controllers'

const router = Router()

const userRelationController = new UserRelationController()

const authorService : Services.AuthorService = <Services.AuthorService> (userRelationController.service);

const validatorMiddleware = new Middlewares.ValidatorMiddleware();

router.param('id',Middlewares.addParamToRequest());

router.post('/',Middlewares.authCheck(true),validatorMiddleware.validateRequestBody({
    "type": "object",
    "additionalProperties": false,
    "required": ["status"],
    "properties": {
        "status":{
            "type":"string",
            "enum":["requested","blocked"]
        }
    }
}),userRelationController.create);

router.get('/',Middlewares.authCheck(true),userRelationController.getAll);

router.get('/:id',Middlewares.authCheck(true),userRelationController.get);

router.put('/:id',Middlewares.authCheck(true),validatorMiddleware.validateRequestBody({
    "type": "object",
    "additionalProperties": false,
    "required": ["status"],
    "properties": {
        "status":{
            "type":"string",
            "enum":["accepted","rejected"]
        }
    }
}),Middlewares.isAuthor(authorService),userRelationController.update);

router.delete('/:id',Middlewares.authCheck(true),userRelationController.delete);

export default router 