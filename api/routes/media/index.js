let router = require('express').Router();
const authToken = require('../../utils/auth-token');
const MediaManager = require('../../manager/media-manager')
const UserManager = require('../../manager/user-manager')

router.post('/create',authToken.authenticateToken, async (req,res)=>{
    
    let { url } = req.body;
    
    let user = await UserManager.getUserById(req.val.id)
    
    console.log(req.body)

    const media = await MediaManager.createMedia({
        url,
        user,
        usedIn:[]
    });

    res.send({success:'OK'})

})

router.get('/list',authToken.authenticateToken, async (req,res)=>{
    
    let user = await UserManager.getUserById(req.val.id)
    
    console.log(req.body)

    const mediaList = await MediaManager.listMedia(user);
    
    if(mediaList.error !== undefined)
        res.send(mediaList)
    else    
        res.send({mediaList})

})

module.exports = router