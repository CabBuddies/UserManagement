import BaseRepository from './base.repository';
import {Auth} from '../models';

class AuthRepository extends BaseRepository {
    constructor(){
        super(Auth);
    }

    getUsersByEmail = async(email : string) => {
        return await this.getAll({ email },5,1,{})
    }

}

export default AuthRepository;