import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import angelService, {Angel} from '../src/services/angel-service';
import { response } from 'express';

axios.defaults.baseURL = 'http://localhost:3005';

let webServer: any;
beforeAll((done) => {
    webServer = app.listen(3005, () => done());
});
