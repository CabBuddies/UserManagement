let router = require('express').Router();
const MediaManager = require('../../manager/media-manager')
const UserManager = require('../../manager/user-manager')

router.get('/', async (req,res)=>{
    
    await UserManager.flushDatabase();
    await MediaManager.flushDatabase();

    res.send({success:'OK'})

})

module.exports = router