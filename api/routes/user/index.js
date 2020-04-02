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
    let { email, password, firstName, lastName, phoneNumber } = req.body;
    console.log(req.body)
    password = encryption.encryptPassword(password)
    const user = await User.create({
        userAuth:{
            email,
            password
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

    res.send(user)
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
        let accessToken = jwt.sign({id:user._id},process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:'6000s'
        })
        let refreshToken = jwt.sign({id:user._id},process.env.REFRESH_TOKEN_SECRET)
        return res.send({accessToken,refreshToken})
    }    
    res.send({error:'Invalid Login'})
})

module.exports = router