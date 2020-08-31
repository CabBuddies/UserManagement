import * as mongoose from 'mongoose';

export default interface Repository{
    model : mongoose.Model<any,{}>;
    get : Function,
    getAll : Function,
    create : Function,
    update : Function,
    delete : Function,
    [propName: string]: any
}