const Media = require('../models/media');

async function createMedia(media){
    let errMsg = '';
    media = await Media.create(media)
    .catch(err=>{
        console.log(err.message)
        errMsg = err.message
    })
    return errMsg === '' ? media : {error:errMsg}
}

async function listMedia(user){
    return await Media.find({user}).lean()
}

async function flushDatabase(){
    if(require('../utils/debug').canFlushDatabases())
        await Media.deleteMany({})
}

module.exports={createMedia,listMedia,flushDatabase}