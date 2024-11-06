import express from 'express';
import angelRouter from './angel-router';

/**
 * Express application.
 */
const app = express();

app.use(express.json());

// Since API is not compatible with v1, API version is increased to v2
app.use('', angelRouter);

export default app;
