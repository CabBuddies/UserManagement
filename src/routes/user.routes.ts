import * as express from 'express';
import { Router } from 'express';
import * as middlewares from '../middlewares';
import {UserController} from '../controllers'

const router = Router()

const userController = new UserController()

//router.post('/',LoggerMiddleware('v1'),userController.create)

router.get('/',middlewares.authCheck(false),userController.getAll)

router.get('/me',middlewares.authCheck(true),userController.getMe)

router.get('/:email',middlewares.authCheck(false),userController.getEmail)

router.delete('/delete_all',userController.deleteAll)

export{ router }