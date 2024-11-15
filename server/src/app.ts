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

// Since API is not compatible with v1, API version is increased to v2
app.use('', angelrouter);
app.use('', postrouter);
app.use('', registerrouter);
app.use('', seriesrouter);
app.use('', userrouter);

// '/angels' osv skal legges inn etter alt av routes er fikset

export default app;
