import BaseRepository from './base.repository';
import {User} from '../models';

class UserRepository extends BaseRepository {
    constructor(){
        super(User);
    }

    getUsersByEmail = async(email : string) => {
        return await this.getAll({ email },5,1)
    }

    updateUserByEmail = async(email : string,entity) => {
        delete entity.email;
        return await this.model.updateOne({email},entity);
    }

}

export default UserRepository;