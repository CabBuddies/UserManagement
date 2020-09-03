import BaseService from './base.service';
import {UserRepository} from '../repositories';
import Request from '../helpers/request.helper';

class UserService extends BaseService {
    constructor(){
        super(new UserRepository());
    }

    getUsersByEmail = async(request:Request,email) => {
        return await this.repository.getUsersByEmail(email);
    }
}

export default UserService;