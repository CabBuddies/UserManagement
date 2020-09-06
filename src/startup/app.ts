import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import {Middlewares} from 'node-library';

import {RefreshTokenRepository} from '../repositories';

const app: express.Application = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(Middlewares.logger('v1'));
app.use(Middlewares.requestProcessor(new RefreshTokenRepository()));

export default app;