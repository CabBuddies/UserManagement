import BaseService from './base.service';
import {AuthRepository,RefreshTokenRepository} from '../repositories';
import Repository from '../repositories/repository';
import * as jwtHelper from '../helpers/jwt.helper';
import Request from '../helpers/request.helper';
import { encryptPassword, checkPassword } from '../helpers/encryption.helper';

import * as PubSub from './pubsub';

class AuthService extends BaseService {

    refreshTokenRepository : Repository;

    constructor(){
        super(new AuthRepository());
        this.refreshTokenRepository = new RefreshTokenRepository();
    }

    createJwt = (request : Request, auth : jwtHelper.Auth, buildRefresh : boolean) => {
        
        const accessToken = jwtHelper.encodeToken(
            auth,
            jwtHelper.SECRET_TYPE.access,
            jwtHelper.TIME.s30
        );

        if(buildRefresh){
            const refreshToken = jwtHelper.encodeToken(
                auth,
                jwtHelper.SECRET_TYPE.refresh,
                jwtHelper.TIME.m30
            );
            
            this.refreshTokenRepository.create({
                refreshToken,
                userId:auth.id,
                ip:request.getIP()
            });
    
            return {accessToken,refreshToken}
        }

        return {accessToken}
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

        entity = await this.create(request,entity)

        console.log(entity)

        PubSub.Organizer.publishEvent({
            request,
            type:PubSub.EventTypes.AUTH.USER_CREATED,
            data:{
                id:entity._id,
                email,
                firstName,
                lastName
            }
        });

        return this.createJwt(request,{
            id:entity._id,
            email,
            expiryTime:0
        },true);
        
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

        const entity = users.result[0]

        if(checkPassword(entity.password,password) == false){
            throw this.buildError(401,"Incorrect email/password.")
        }


        PubSub.Organizer.publishEvent({
            request,
            type:PubSub.EventTypes.AUTH.USER_SIGNED_IN,
            data:{
                id:entity._id,
                email
            }
        });

        return this.createJwt(request,{
            id:entity._id,
            email,
            expiryTime:0
        },true);

    }

    getAccessToken = async(request:Request) => {
        return this.createJwt(request,{
            id:request.getUserId(),
            email:request.getEmail(),
            expiryTime:0
        },false);
    }

    signOut = async(request:Request) => {
        await this.refreshTokenRepository.removeByRefreshToken(request.getTokenValue());
    }

    signOutAll = async(request:Request) => {
        await this.refreshTokenRepository.removeAllByUserId(request.getUserId());
    }

}

export default AuthService;