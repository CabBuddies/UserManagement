import {Repositories} from 'node-library';
import {User} from '../models';

class UserRepository extends Repositories.BaseRepository {
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