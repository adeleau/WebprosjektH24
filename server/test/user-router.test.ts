import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import userService, {User} from '../src/services/user-service';
import { response } from 'express';

axios.defaults.baseURL = 'http://localhost:3004';

let webServer: any;
beforeAll((done) => {
    webServer = app.listen(3004, () => done());
});
