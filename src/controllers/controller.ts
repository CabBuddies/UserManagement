import Service from '../services/service';

export default interface Controller{
    service? : Service;
    get? : Function,
    getAll? : Function,
    create? : Function,
    update? : Function,
    delete? : Function
}