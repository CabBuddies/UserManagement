"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const node_library_1 = require("node-library");
const controllers_1 = require("../controllers");
const router = express_1.Router();
exports.router = router;
const userController = new controllers_1.UserController();
const validatorMiddleware = new node_library_1.Middlewares.ValidatorMiddleware();
const schema = {
    "type": "object",
    "additionalProperties": false,
    "required": ["firstName", "lastName", "displayPicture"],
    "properties": {
        "firstName": {
            "type": "string"
        },
        "lastName": {
            "type": "string"
        },
        "displayPicture": {
            "type": "string"
        }
    }
};
router.get('/', node_library_1.Middlewares.authCheck(false), userController.getAll);
router.put('/', node_library_1.Middlewares.authCheck(true), validatorMiddleware.validateRequestBody(schema), userController.update);
router.get('/me', node_library_1.Middlewares.authCheck(true), userController.getMe);
router.get('/:id', node_library_1.Middlewares.authCheck(false), userController.getId);
router.delete('/delete_all', userController.deleteAll);
