import BaseService from './base.service';
import {UserRepository} from '../repositories';

class UserService extends BaseService {
    constructor(){
        super(new UserRepository());
    }

    getUsersByEmail = async(userId,email) => {
        return await this.repository.getUsersByEmail(userId,email);
    }
}

export default UserService;