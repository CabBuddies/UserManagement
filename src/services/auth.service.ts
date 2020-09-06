import {AuthRepository,RefreshTokenRepository} from '../repositories';
import {Helpers,Repositories,Services} from 'node-library';
import {PubSubEventTypes} from '../helpers/pubsub.helper';

class AuthService extends Services.BaseService {

    refreshTokenRepository : Repositories.Repository;

    constructor(){
        super(new AuthRepository());
        this.refreshTokenRepository = new RefreshTokenRepository();
    }

    createJwt = (request : Helpers.Request, auth : Helpers.JWT.Auth, buildRefresh : boolean) => {
        
        const accessToken = Helpers.JWT.encodeToken(
            auth,
            Helpers.JWT.SECRET_TYPE.access,
            Helpers.JWT.TIME.s30
        );

        if(buildRefresh){
            const refreshToken = Helpers.JWT.encodeToken(
                auth,
                Helpers.JWT.SECRET_TYPE.refresh,
                Helpers.JWT.TIME.m30
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

    signUp = async(request:Helpers.Request,user) => {
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

        password = Helpers.Encryption.encryptPassword(password)

        let entity :any = {
            email,
            password,
            account:{
                type:registrationType
            }
        }

        entity = await this.create(request,entity)

        console.log(entity)

        Services.PubSub.Organizer.publishEvent({
            request,
            type:PubSubEventTypes.AUTH.USER_CREATED,
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

    signIn = async(request:Helpers.Request,user) => {

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

        if(Helpers.Encryption.checkPassword(entity.password,password) == false){
            throw this.buildError(401,"Incorrect email/password.")
        }


        Services.PubSub.Organizer.publishEvent({
            request,
            type:PubSubEventTypes.AUTH.USER_SIGNED_IN,
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

    getAccessToken = async(request:Helpers.Request) => {
        return this.createJwt(request,{
            id:request.getUserId(),
            email:request.getEmail(),
            expiryTime:0
        },false);
    }

    signOut = async(request:Helpers.Request) => {
        await this.refreshTokenRepository.removeByRefreshToken(request.getTokenValue());
    }

    signOutAll = async(request:Helpers.Request) => {
        await this.refreshTokenRepository.removeAllByUserId(request.getUserId());
    }

}

export default AuthService;