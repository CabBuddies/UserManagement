let router = require('express').Router();
const authToken = require('../../utils/auth-token')
const UserManager = require('../../manager/user-manager')

router.get('/decode', authToken.authenticateToken, async (req,res)=>{
    try {
        let user = await UserManager.getUserById(req.val.id)
        console.log('==========>JwtDecodeDbUser')
        console.log(user)
        const result = {
            user:packageUserDetailsForMicroService(user),
            expirationTime:req.val.expirationTime
        }
        console.log('==========>JwtDecodePackagedResult')
        console.log(result)
        res.send(result)
    } catch (error) {
        res.send(error)
    }
})

function packageUserDetailsForMicroService(user){
    let details = JSON.parse(JSON.stringify(user.userDetails))
    details['email'] = user.userAuth.email
    details['registrationType'] = user.userAuth.registrationType
    //details['userId'] = user._id.toString()
    //delete details['_id']
    return details
}

module.exports = router