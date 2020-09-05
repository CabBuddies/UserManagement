import * as mongoose from 'mongoose';
import Respository from './repository';

class BaseRepository implements Respository{
    model : mongoose.Model<any,{}>;
    
    constructor(model: mongoose.Model<any,{}>){
        this.model = model;
    }

    get = async(id,attributes = {password:0}) => {
        console.log('base.repository ',id,new mongoose.Types.ObjectId(id))
        return await this.model.findById(
            new mongoose.Types.ObjectId(id)
        ).select(attributes);
    }

    getAll = async(query = {}, pageSize : number = 5, pageNum : number = 1, attributes:any={'password':0}) => {
        //skip - limit
        const skips = pageSize * (pageNum - 1)
        console.log(query,pageSize,pageNum)
        const resultTotalSize = await this.model.count(query);
        let result = [];
        if(resultTotalSize > 0){
            console.log('base.repository',query);
            result = await this.model.find(query).skip(skips).limit(pageSize).select(attributes);
        }
        const resultSize = result.length
        console.log(result)
        return {
            query,
            pageSize,
            pageNum,
            resultSize,
            resultTotalSize,
            result
        }
    }

    create = async(entity) => {
        return await this.model.create(entity);
    }

    update = async(id, entity) => {
        return await this.model.findByIdAndUpdate(id, entity, {new: true});
    }

    delete = async(id) => {
        return await this.model.findByIdAndDelete(id);
    }

    deleteAll = async() => {
        return await this.model.deleteMany({});
    }
}

export default BaseRepository;