import BaseService from './base.service';
import {UserRepository} from '../repositories';
import Request from '../helpers/request.helper';

import * as PubSub from './pubsub';

class UserService extends BaseService {
    constructor(){
        super(new UserRepository());
        PubSub.Organizer.addSubscriber(PubSub.EventTypes.AUTH.USER_CREATED,this)
    }

    eventListened(event: PubSub.Event) {
        console.log('UserService',event);
        switch (event.type) {
            case PubSub.EventTypes.AUTH.USER_CREATED:
                this.userCreated(event);
                break;
        
            default:
                break;
        }
    }

    userCreated(event: PubSub.Event) {

        const {
            email,
            firstName,
            lastName
        } = event.data;
        
        this.create(event.request,{
            email,
            firstName,
            lastName
        });

    }

    getUserByEmail = async(request:Request,email) => {
        return await this.repository.getUserByEmail(email);
    }
}

export default UserService;