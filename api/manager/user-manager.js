const User = require('../models/user');
const encryption = require('../utils/encryption');

async function createUser(user){
    user.password = encryption.encryptPassword(user.password)
    user.userVerifiedDetails={
        email:'',
        phoneNumber:''
    }
    let errMsg = '';
    user = await User.create(user)
    .catch(err=>{
        console.log(err.message)
        errMsg = err.message
    })
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