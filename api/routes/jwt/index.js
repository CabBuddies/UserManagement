const User = require('../../models/user');
let router = require('express').Router();
const jwt = require('jsonwebtoken');

router.get('/decode', authenticateToken, async (req,res)=>{
    try {
        let user = await User.findById(req.val.id)
        console.log(user)
        res.send(packageUserDetailsForMicroService(user))
    } catch (error) {
        res.send(error)
    }
})

function packageUserDetailsForMicroService(user){
    let details = JSON.parse(JSON.stringify(user.userDetails))
    details['email'] = user.userAuth.email
    //details['userId'] = user._id.toString()
    //delete details['_id']
    return details
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, val) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        req.val = val
        next()
    })
}

module.exports = router