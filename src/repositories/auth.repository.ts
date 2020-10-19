import {Repositories} from 'node-library';
import {Auth} from '../models';

class AuthRepository extends Repositories.BaseRepository {
    constructor(){
        super(Auth);
    }

    getUsersByEmail = async(email : string) => {
        return await this.getAll({ email },{},5,1,[])
    }

}

export default AuthRepository;