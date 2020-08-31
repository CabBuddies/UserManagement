import * as express from 'express';

import BaseController from './base.controller';

class TestController extends BaseController{
    constructor(){
        super(null)
    }

    get = async(req : express.Request , res : express.Response) => {
        console.log(res.locals)
        return res.send(res.locals);
    }

}

export default TestController;