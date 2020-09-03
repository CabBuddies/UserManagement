import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import * as middleware from '../middlewares';

const app: express.Application = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(middleware.logger('v1'));
app.use(middleware.requestProcessor);

export default app;