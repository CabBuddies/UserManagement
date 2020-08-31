require('module-alias/register')
import * as express from 'express';
import * as mongoose from 'mongoose';
import app from './startup/app';
import * as config from './config';
import * as routes from './routes';
import routesList from './config/routes.list';

mongoose.connect(config.MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology: true
})
.then(()=>console.log('db connected'))
.catch((err : mongoose.Error)=>console.log(err));

const router :express.Router = express.Router()

router.use('/auth',routes.AuthRoutes);
router.use('/user',routes.UserRoutes);
router.use('/test',routes.TestRoutes);

app.use('/api/v1',router);

app.listen(config.PORT,()=>{
    console.log('app listening',config.PORT);
})

routesList(app);

//////////////////////

import tests from './tests';

tests(); 