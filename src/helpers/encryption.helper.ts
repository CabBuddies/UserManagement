// import crypt from 'simple-encryptor';

const crypt = require('simple-encryptor');

//REQUIRES CHANGES
const getKey = (val) => {
    return val + ";[9,Tx.YHt+kTxr,"
}

const encryptPassword = function(password){
    return crypt(getKey(password)).encrypt(password)
}

const checkPassword = function(encrypted,plain){
    return crypt(getKey(plain)).decrypt(encrypted) === plain
}

export {
    encryptPassword,
    checkPassword
}