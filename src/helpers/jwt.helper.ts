import * as config from "../config";
const jwt = require( 'jsonwebtoken' );

const generateAccessToken = function(user) {
    return jwt.sign(user, config.ACCESS_TOKEN_SECRET, {'expiresIn':'30s'});
};

const decodeAccessToken = function(token,callback) {
    jwt.verify(token, config.ACCESS_TOKEN_SECRET, callback);
};

export {
    generateAccessToken,
    decodeAccessToken
}