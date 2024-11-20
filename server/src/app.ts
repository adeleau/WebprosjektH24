import express from 'express';
import angelrouter from './routers/angel-router';
import postrouter from './routers/post-router';
import registerrouter from './routers/register-router';
import seriesrouter from './routers/series-router';
import userrouter from './routers/user-router';


/**
 * Express application.
 */
const app = express();

app.use(express.json());

app.use('', angelrouter);
app.use('', postrouter);
app.use('', registerrouter);
app.use('', seriesrouter);
app.use('', userrouter);

export default app;
