import Request from '../../helpers/request.helper';

interface Event{
    request:Request,
    type:string,
    metadata?:any,
    data:any
}

interface Subscriber{
    eventListened(event:Event) : any
}

interface Subscription{
    [key: string]:Subscriber[]
}

const EventTypes = {
    AUTH:{
        USER_CREATED:"AUTH_USER_CREATED",
        USER_SIGNED_IN:"AUTH_USER_SIGNED_IN",
        SIGN_OUT:"AUTH_SIGN_OUT",
        SIGN_OUT_ALL:"AUTH_SIGN_OUT_ALL",
        ACCESS_TOKEN:"AUTH_ACCESS_TOKEN"
    }
}

class Main{
    
    subscription : Subscription = {};

    addSubscriber = (eventType:string, subscriber:Subscriber) => {
        if(eventType in this.subscription === false){
            this.subscription[eventType] = []
        }
        this.subscription[eventType].push(subscriber);
    }

    removeSubscriber = (eventType:string, subscriber:Subscriber) => {
        this.subscription[eventType] = this.subscription[eventType].filter(
            function(value:Subscriber, index, arr){
                return value!=subscriber;
            }
        );
    }

    publishEvent = async(event:Event) => {
        console.log('PubSub',event,this.subscription);
        var sub = this.subscription;
        return await new Promise<string>(function(resolve,reject){
            for(const subscriber of sub[event.type]){
                try {
                    subscriber.eventListened(event)
                } catch (error) {
                    console.log(error)
                }
            }
            resolve('done')
        });
    }

}

const Organizer = new Main();

export {
    Event,
    Subscriber,
    EventTypes,
    Organizer
}