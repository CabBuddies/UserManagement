import BaseService from './base.service';
import {AuthRepository,UserRepository,RefreshTokenRepository} from '../repositories';
import Repository from '../repositories/repository';
import * as jwtHelper from '../helpers/jwt.helper';
import Request from '../helpers/request.helper';
import { encryptPassword, checkPassword } from '../helpers/encryption.helper';

class AuthService extends BaseService {

    userRepository : Repository;
    refreshTokenRepository : Repository;

    constructor(){
        super(new AuthRepository());
        this.userRepository = new UserRepository();
        this.refreshTokenRepository = new RefreshTokenRepository();
    }

    signUp = async(request:Request,user) => {
        console.log(user)
        let { 
            email,
            password,
            firstName,
            lastName,
            registrationType
        } = user

        console.log('querying for users on :',email);

        const users = await this.repository.getUsersByEmail(email);
        
        console.log('users',users);

        if(users.resultSize !== 0){
            throw this.buildError(400,"A User has already registered with the email address.");
        }

        password = encryptPassword(password)

        let entity :any = {
            email,
            password,
            account:{
                type:registrationType
            }
        }

        entity = await this.create(undefined,entity)
        console.log(entity)

        this.userRepository.create({
            _id:entity._id,
            email,
            firstName,
            lastName
        });

        const auth : jwtHelper.Auth = {
            id:entity._id,
            email,
            expiryTime:0
        };

        const accessToken = jwtHelper.encodeToken(
            auth,
            jwtHelper.SECRET_TYPE.access,
            jwtHelper.TIME.s30
        );

        const refreshToken = jwtHelper.encodeToken(
            auth,
            jwtHelper.SECRET_TYPE.refresh,
            jwtHelper.TIME.m30
        );
        
        this.refreshTokenRepository.create({
            refreshToken,
            userId:entity._id,
            ip:request.getIP()
        });

        return {accessToken,refreshToken}
        
    }

    signIn = async(request:Request,user) => {

        let { 
            email,
            password
        } = user

        const users = await this.repository.getUsersByEmail(email);

        if(users.resultSize === 0){
            throw this.buildError(404,"A User with this email is not available.")
        }

        if(users.resultSize !== 1){
            throw this.buildError(500,"Duplicate email error.")
        }

        user = users.result[0]

        if(checkPassword(user.password,password) == false){
            throw this.buildError(401,"Incorrect email/password.")
        }

        const auth : jwtHelper.Auth = {
            id:user._id,
            email,
            expiryTime:0
        };

        const accessToken = jwtHelper.encodeToken(
            auth,
            jwtHelper.SECRET_TYPE.access,
            jwtHelper.TIME.s30
        );
        
        const refreshToken = jwtHelper.encodeToken(
            auth,
            jwtHelper.SECRET_TYPE.refresh,
            jwtHelper.TIME.m30
        );
        
        this.refreshTokenRepository.create({
            refreshToken,
            userId:user._id,
            ip:request.getIP()
        });

        return {accessToken,refreshToken}

    }

    getAccessToken = async(request:Request) => {

        const auth : jwtHelper.Auth = {
            id:request.getUserId(),
            email:request.getEmail(),
            expiryTime:0
        };

        const accessToken = jwtHelper.encodeToken(
            auth,
            jwtHelper.SECRET_TYPE.access,
            jwtHelper.TIME.s30
        );

        return {accessToken}
    }

    signOut = async(request:Request) => {
        await this.refreshTokenRepository.removeByRefreshToken(request.getTokenValue());
    }

    signOutAll = async(request:Request) => {
        await this.refreshTokenRepository.removeAllByUserId(request.getUserId());
    }

}

export default AuthService;