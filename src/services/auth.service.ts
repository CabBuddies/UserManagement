import {AuthRepository} from '../repositories';
import {Helpers,Repositories,Services} from 'node-library';
import {PubSubMessageTypes} from '../helpers/pubsub.helper';

class AuthService extends Services.BaseService {

    private static instance: AuthService;
    
    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }

        return AuthService.instance;
    }

    private constructor(){
        super(new AuthRepository());
    }

    createJwt = (request : Helpers.Request, auth : Helpers.JWT.Auth, buildRefresh : boolean) => {
        
        const accessToken = Helpers.JWT.encodeToken(
            auth,
            Helpers.JWT.SECRET_TYPE.access,
            Helpers.JWT.TIME.m30
        );

        if(buildRefresh){
            const refreshToken = Helpers.JWT.encodeToken(
                auth,
                Helpers.JWT.SECRET_TYPE.refresh,
                Helpers.JWT.TIME.d30
            );
    
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
            throw this.buildError(403,"A User has already registered with the email address.");
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

        console.log(entity);

        const auth : Helpers.JWT.Auth = {
            id:entity._id,
            email,
            expiryTime:0
        };

        const {accessToken,refreshToken} = this.createJwt(request,auth,true);
        

        Services.PubSub.Organizer.publishMessage({
            request,
            type:PubSubMessageTypes.AUTH.USER_SIGNED_UP,
            data:{
                accessToken,
                refreshToken,
                userId:entity._id,
                email,
                firstName,
                lastName,
                ip:request.getIP()
            }
        });

        return {accessToken,refreshToken}
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
            throw this.buildError(403,"Incorrect email/password.")
        }

        const auth : Helpers.JWT.Auth = {
            id:entity._id,
            email,
            expiryTime:0
        };

        const {accessToken,refreshToken} = this.createJwt(request,auth,true);

        Services.PubSub.Organizer.publishMessage({
            request,
            type:PubSubMessageTypes.AUTH.USER_SIGNED_IN,
            data:{
                accessToken,
                refreshToken,
                userId:entity._id,
                email,
                ip:request.getIP()
            }
        });

        return {accessToken,refreshToken}
    }

    getAccessToken = async(request:Helpers.Request) => {
        return this.createJwt(request,{
            id:request.getUserId(),
            email:request.getEmail(),
            expiryTime:0
        },false);
    }

    signOut = async(request:Helpers.Request) => {
        Services.PubSub.Organizer.publishMessage({
            request,
            type:PubSubMessageTypes.AUTH.USER_SIGN_OUT,
            data:{
                refreshToken:request.getTokenValue()
            }
        });
    }

    signOutAll = async(request:Helpers.Request) => {
        Services.PubSub.Organizer.publishMessage({
            request,
            type:PubSubMessageTypes.AUTH.USER_SIGN_OUT_ALL,
            data:{
                userId:request.getUserId()
            }
        });
    }

}

export default AuthService.getInstance();