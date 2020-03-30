const app = require('express')();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config()

app.listen(3000,()=>{
    console.log('listening on 3000')
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect('mongodb://ikmv:ikmv@localhost:27017/UserManagement',{
    useNewUrlParser:true,
    useUnifiedTopology: true
})
.then(()=>console.log('db connected'))
.catch((err)=>console.log(err));

app.get('/',(req,res)=>{
    res.send('happy')
})

app.use('/user',require('./api/routes/user'))
app.use('/jwt',require('./api/routes/jwt'))

console.log(app._router.stack)

const encryption = require('./utils/encryption');

let enc = encryption.encryptPassword('happy')
console.log(enc)
console.log(encryption.checkPassword(enc,'sad'))
console.log(encryption.checkPassword(enc,'happy'))

// app.get('/',(req,res)=>{
//     const user = new User({
//         _id: new mongoose.Types.ObjectId(),
//         firstName: 'Nihal',
//         lastName: 'Konda'
//     });
//     user
//         .save()
//         .then((result)=>{
//             if(!result){
//                 res.status(404)
//                 return
//             }
//             res.status(200).json(result)
//         })
//         .catch((err)=>{
//             Object.keys(err.errors).forEach((key)=>{
//                 console.log(err.errors[key].message)
//             })
//             res.status(500).send('Sorry!')
//         })
// });

