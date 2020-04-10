const User = require('../../models/user');
const encryption = require('../../utils/encryption');
let router = require('express').Router();
const jwt = require('jsonwebtoken');

/*
POST with JSON body
{
    email:'email@domain.com',
    password:'strongpassword',
    firstName:'John',
    lastName:'Doe',
    phoneNumber:'9876543210'
}
*/
router.post('/registration', async (req,res)=>{
    let { email, password, firstName, lastName, phoneNumber, registrationType } = req.body;
    console.log(req.body)
    password = encryption.encryptPassword(password)
    const user = await User.create({
        userAuth:{
            email,
            password,
            registrationType
        },
        userDetails:{
            firstName,
            lastName,
            phoneNumber
        },
        userVerifiedDetails:{
            email:'',
            phoneNumber:''
        }
    })
    .catch(err=>{
        console.log(err.message)
        res.send({error:err.message})
    })

    res.send(createJwt(user))
})


/*
POST with JSON body
{
    email:'email@domain.com',
    password:'strongpassword'
}

returns
{
    accessToken:'ACCESS_TOKEN',
    refreshToken:'REFRESH_TOKEN'
}
*/
router.post('/login', async (req,res)=>{
    const user = await User.findOne({'userAuth.email':req.body.email}).catch(err=>{
        console.log(err)
        return res.send({error:err.message})
    })
    console.log(user)
    if(encryption.checkPassword(user.userAuth.password,req.body.password)){
        return res.send(createJwt(user))
    }    
    res.send({error:'Invalid Login'})
})

function createJwt(user){
    const expirationTime = new Date(new Date().getTime() + 6000*1000);
    let accessToken = jwt.sign({id:user._id,expirationTime},process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:'6000s'
    })
    let refreshToken = jwt.sign({id:user._id},process.env.REFRESH_TOKEN_SECRET)
    return {accessToken,refreshToken,expirationTime}
}

module.exports = router