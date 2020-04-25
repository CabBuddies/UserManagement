const app = require('express')();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv').config()

const PORT = process.env.PORT || 5000

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(PORT,function(){
    console.log(PORT+' started')
})

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://ikmv:ikmv@cluster0-hnnbh.mongodb.net/UserManagement?retryWrites=true&w=majority',{
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
app.use('/media',require('./api/routes/media'))
app.use('/flush',require('./api/routes/flush'))
app.use('/test',require('./test'))

console.log(app._router.stack)
