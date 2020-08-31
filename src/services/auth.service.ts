import BaseService from './base.service';
import {AuthRepository,UserRepository} from '../repositories';
import Repository from '../repositories/repository';
import { generateAccessToken } from '../helpers/jwt.helper';
import { encryptPassword, checkPassword } from '../helpers/encryption.helper';

class AuthService extends BaseService {

    userRepository : Repository;

    constructor(){
        super(new AuthRepository());
        this.userRepository = new UserRepository();
    }

    signUp = async(user) => {
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

        try {
            entity = await this.create(undefined,entity)
            console.log(entity)

            this.userRepository.create({
                _id:entity._id,
                email,
                firstName,
                lastName
            });

            const accessToken = generateAccessToken({
                _id:entity._id
            })
            console.log(accessToken)
            return {accessToken}
        } catch (error) {
            throw error
        }
        
    }

    signIn = async(user) => {

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

        try {
            user = generateAccessToken({
                _id:user._id
            })
            user = {
                accessToken : user
            }
            console.log(user)
            return user
        } catch (error) {
            throw error
        }

    }

    signOut = async(userId="random") => {

    }

}

export default AuthService;