const mongoose = require('mongoose');

const usageSchema = mongoose.Schema({
    id:{
        type:mongoose.Schema.Types.ObjectId,
        required:'id is required'
    },
    type:{
        type:String,
        required:'type is required'
    }
});

const mediaSchema = mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    url:{
        type:String,
        required:'URL is required for media'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    postedOn:{
        type:Date,
        default:Date.now
    },
    usedIn:[
        usageSchema
    ]
});

userSchema.index({user:1,url:1},{unique:true})

module.exports = mongoose.model('Media',mediaSchema);