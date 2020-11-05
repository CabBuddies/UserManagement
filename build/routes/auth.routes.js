"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const node_library_1 = require("node-library");
const controllers_1 = require("../controllers");
const router = express_1.Router();
exports.router = router;
const authController = new controllers_1.AuthController();
const validatorMiddleware = new node_library_1.Middlewares.ValidatorMiddleware();
const schema = {
    "type": "object",
    "additionalProperties": false,
    "required": ["firstName", "lastName", "email", "password", "registrationType"],
    "properties": {
        "firstName": {
            "type": "string"
        },
        "lastName": {
            "type": "string"
        },
        "email": {
            "type": "string"
        },
        "password": {
            "type": "string"
        },
        "registrationType": {
            "type": "string",
            "enum": ['inapp', 'google', 'facebook', 'twitter', 'linkedin']
        }
    }
};
router.post('/sign_up', validatorMiddleware.validateRequestBody({
    "type": "object",
    "additionalProperties": false,
    "required": ["firstName", "lastName", "email", "password", "registrationType"],
    "properties": {
        "firstName": {
            "type": "string"
        },
        "lastName": {
            "type": "string"
        },
        "email": {
            "type": "string"
        },
        "password": {
            "type": "string"
        },
        "registrationType": {
            "type": "string",
            "enum": ['inapp', 'google', 'facebook', 'twitter', 'linkedin']
        }
    }
}), authController.signUp);
router.post('/sign_in', validatorMiddleware.validateRequestBody({
    "type": "object",
    "additionalProperties": false,
    "required": ["email", "password"],
    "properties": {
        "email": {
            "type": "string"
        },
        "password": {
            "type": "string"
        }
    }
}), authController.signIn);
router.get('/access_token', node_library_1.Middlewares.authCheck(true, true), authController.getAccessToken);
router.delete('/sign_out', node_library_1.Middlewares.authCheck(true, true), authController.signOut);
router.delete('/sign_out_all', node_library_1.Middlewares.authCheck(true, true), authController.signOutAll);
router.delete('/delete_all', authController.deleteAll);
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
