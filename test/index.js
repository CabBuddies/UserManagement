let router = require('express').Router();
var path = require('path')

router.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname + '/index.html'));
})
router.get('/jwt/decode',(req,res)=>{
    res.sendFile(path.join(__dirname + '/decode.html'));
})
router.get('/user/login',(req,res)=>{
    res.sendFile(path.join(__dirname + '/login.html'));
})
router.get('/user/profile',(req,res)=>{
    res.sendFile(path.join(__dirname + '/profile.html'));
})
router.get('/user/registration',(req,res)=>{
    res.sendFile(path.join(__dirname + '/registration.html'));
})

module.exports = router