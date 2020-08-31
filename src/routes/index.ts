import * as express from 'express';
import {router as AuthRoutes} from './auth.routes';
import {router as UserRoutes} from './user.routes';
import {router as TestRoutes} from './test.routes';

export {
    AuthRoutes,
    UserRoutes,
    TestRoutes
};