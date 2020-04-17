let router = require('express').Router();
const jwt = require('jsonwebtoken');
const UserManager = require('../../manager/user-manager')

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
    const user = await UserManager.createUser({
        userAuth:{
            email,
            password,
            registrationType
        },
        userDetails:{
            firstName,
            lastName,
            phoneNumber
        }
    });

    if(user.error !== undefined)
        res.send(user)
    else    
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
    const user = await UserManager.getUser({
        email:req.body.email,
        password:req.body.password
    })    
    if(user.error !== undefined)
        res.send(user)
    else    
        res.send(createJwt(user))
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