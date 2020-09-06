import {UserRepository} from '../repositories';
import {Services,Helpers} from 'node-library';
import {PubSubEventTypes} from '../helpers/pubsub.helper';

class UserService extends Services.BaseService {
    constructor(){
        super(new UserRepository());
        Services.PubSub.Organizer.addSubscriber(PubSubEventTypes.AUTH.USER_CREATED,this)
    }

    eventListened(event: Services.PubSub.Event) {
        console.log('UserService',event);
        switch (event.type) {
            case PubSubEventTypes.AUTH.USER_CREATED:
                this.userCreated(event);
                break;
        
            default:
                break;
        }
    }

    userCreated(event: Services.PubSub.Event) {

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

    getUserByEmail = async(request:Helpers.Request,email) => {
        return await this.repository.getUserByEmail(email);
    }
}

export default UserService;