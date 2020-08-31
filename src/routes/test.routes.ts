import { Router } from 'express';
import * as middlewares from '../middlewares';
import {TestController} from '../controllers'

const router = Router()

const testController = new TestController()

router.get('/a',middlewares.testMiddleware('angular'),testController.get)
router.get('/b',middlewares.testMiddleware('bootstrap'),testController.get)
router.get('/c',middlewares.testMiddleware('chrome'),testController.get)
router.get('/d',middlewares.testMiddleware('django'),testController.get)

export{ router }