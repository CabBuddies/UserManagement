const User = require('../models/user');
const encryption = require('../utils/encryption');

async function createUser(user){
    console.log(user)
    user.password = encryption.encryptPassword(user.userAuth.password)
    user.userVerifiedDetails={
        email:'',
        phoneNumber:''
    }
    let errMsg = '';
    console.log(user)
    user = await User.create(user)
    .catch(err=>{
        console.log(err.message)
        errMsg = err.message
    })
    console.log(user)
    return errMsg === '' ? user : {error:errMsg}
}

async function getUser(user){
    let errMsg = '';
    const duser = await User.findOne({'userAuth.email':user.email}).catch(err=>{
        console.log(err.message)
        errMsg = err.message
    })
    if(errMsg !== '')
        return {error:errMsg}

    if(encryption.checkPassword(duser.userAuth.password,user.password)){
        return createJwt(duser)
    }

    return {error:'Invalid Login'}
}

async function getUserById(id){
    return await User.findById(id)
}

async function flushDatabase(){
    if(require('../utils/debug').canFlushDatabases())
        await User.deleteMany({})
}

module.exports = {createUser,getUser,getUserById,flushDatabase}