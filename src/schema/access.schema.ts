import mongoose from "mongoose";

const accessSchema = new mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required: 'user id is required'
    },
    accessType:{
        type: String, 
        enum : ['C', 'R', 'U', 'D'], 
        default: 'R'
    }
});

export {accessSchema};