import * as mongoose from 'mongoose';
var immutablePlugin = require('mongoose-immutable');

const userRelationSchema = new mongoose.Schema({
    author:{
        type: String,
        required:'author is required'
    },
    followeeId:{
        type: String,
        required:'followeeId is required',
        immutable: true
    },
    followerId:{
        type: String,
        required:'followerId is required',
        immutable: true
    },
    status:{
        type: String,
        enum:['requested','accepted','rejected','blocked'],
        default:'requested'
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    lastModifiedAt:{
        type:Date,
        default:Date.now
    }
});

userRelationSchema.plugin(immutablePlugin);

userRelationSchema.index({'followeeId':1,'followerId':1},{unique:true});

const UserRelation = mongoose.model('UserRelation',userRelationSchema);

export default UserRelation;