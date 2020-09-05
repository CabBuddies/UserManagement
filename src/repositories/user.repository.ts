import BaseRepository from './base.repository';
import {User} from '../models';

class UserRepository extends BaseRepository {
    constructor(){
        super(User);
    }

    getUserByEmail = async(email : string) => {
        return await this.model.findOne({email})
    }

    updateUserByEmail = async(email : string,entity) => {
        delete entity.email;
        return await this.model.updateOne({email},entity);
    }

}

export default UserRepository;