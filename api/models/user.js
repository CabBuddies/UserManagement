const mongoose = require('mongoose');

const userAuthSchema = mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    email:{
        type:String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    password:{
        type:String,
        trim: true,
        required: 'Password is required',
        match: [/(?=.{8,})/, 'Please provide a valid password']
    }
});

const userDetailsSchema = mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    firstName:{
        type:String,
        trim: true,
        required:'First Name is required!'
    },
    lastName:{
        type:String,
        trim: true,
        required:'Last Name is required!'
    },
    phoneNumber:{
        type:String,
        trim: true,
        default:''
    }
});

const userVerifiedDetailsSchema = mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    email:{
        type:String,
        trim: true,
        default:''
    },
    phoneNumber:{
        type:String,
        trim: true,
        default:''
    }
});

const userSchema = mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    userAuth:userAuthSchema,
    userDetails:userDetailsSchema,
    userVerifiedDetails:userVerifiedDetailsSchema
});

userSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('Email already exists.'));
    } else {
        next(error);
    }
});

module.exports = mongoose.model('User',userSchema);