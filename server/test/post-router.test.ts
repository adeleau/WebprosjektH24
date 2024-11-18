import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import postService, {Post} from '../src/services/post-service';
import { response } from 'express';

axios.defaults.baseURL = 'http://localhost:3003';

let webServer: any;
beforeAll((done) => {
    webServer = app.listen(3004, () => done());
});
