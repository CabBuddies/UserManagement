const crypt = require('simple-encryptor');

//REQUIRES CHANGES
function getKey(val){
    return val + ";[9,Tx.YHt+kTxr,"
}

module.exports={
    encryptPassword:function(password){
        console.log(password)
        return crypt(getKey(password)).encrypt(password)
    },
    checkPassword:function(encrypted,plain){
        return crypt(getKey(plain)).decrypt(encrypted) === plain
    }
}