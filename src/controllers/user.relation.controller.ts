import * as express from 'express';

import {Controllers} from 'node-library';

import {UserRelationService} from '../services';

class UserRelationController extends Controllers.BaseController{
    constructor(){
        super(UserRelationService);
    }
}
export default UserRelationController;