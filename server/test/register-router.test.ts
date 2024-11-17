import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import registerService from '../src/services/register-service';
import { response } from 'express';

axios.defaults.baseURL = 'http://localhost:3001';

const testUser = [
    {user_id:2, username:'Adele', email:'Adele@SonniSan.com', password_hash:'123'},
    {user_id:3, username:'Julia', email:'Julia@sonnykun.com', password_hash:'123'},
    {user_id:4, username:'Emii', email:'Emii@sonny.com', password_hash:'Angel123?'},
];

let webServer: any;


beforeAll((done) => {
    webServer = app.listen(3001, () => done());
});

beforeEach((done) => {
    pool.query('DELETE FROM Posts', (error) => { // Slett poster som refererer til Users
        if (error) return done(error);
        pool.query('DELETE FROM Comments', (error) => { // Slett kommentarer som refererer til Posts
            if (error) return done(error);
            pool.query('DELETE FROM Users', (error) => { // Til slutt, slett brukere
                if (error) return done(error);
                // Legg inn testdata i Users
                registerService
                    .register(testUser[0].username, testUser[0].email, testUser[0].password_hash)
                    .then(() => registerService.register(testUser[1].username, testUser[1].email, testUser[1].password_hash))
                    .then(() => registerService.register(testUser[2].username, testUser[2].email, testUser[2].password_hash))
                    .then(() => done())
                    .catch(done);
            });
        });
    });
});


afterAll((done) => {
    if(webServer) {
        webServer.close(() => pool.end(()=> done()));
    }else {
        done();
    }
});

//tester tilfeller
describe('Register Router Tests', () => {

    //henter ut alle brukerne
    test('Fetch all users (GET /users ) - 200 OK', (done) =>{
        axios.get('/users').then((response) => {
            expect(response.status).toEqual(200);
            expect(response.data.length).toEqual(3);
            expect(response.data).toEqual(expect.arrayContaining(testUser));
            done();
        }).catch(done);
    });

    //henter ut en enkelt bruker
    test('Fetch user by ID (GET /users/:user_id) - 200 OK', (done) =>{
        axios.get('/users/2').then((response) => {
            expect(response.status).toEqual(200);
            expect(response.data).toEqual(testUser[0]);
            done();
        }).catch(done);
    });

    test('Fetch user by ID (GET /users/:user_id) -404 Not Found', (done) => {
        axios.get('/users/99').then(() =>{ //spørs om vi skal sette det til høyre enn 99 siden nettsiden burde kunne ha mer enn 99 brukere
            done(new Error('Should not find non existens user'));
        }).catch((error) => {
            expect(error.response.status).toEqual(404),
            expect(error.response.data).toEqual('User not found');
            done();
        });
    });

    //test for registrering av ny bruker
    test('Register a new user (POST /register) -201', (done) => {
        axios.post('/register', {username:'testerbruker1', email:'testereks1@gmail.com', password_hash:'123456'}).then((response) =>{
            expect(response.status).toEqual(201);
            expect(response.data).toHaveProperty('username','testerbruker1');
            done();
        }).catch(done);
    });
    test('Register a user with missing fields (POST /register) 400 Bad Request', (done) => {
        axios.post('/register', {username: 'incomplete'}).then(() => {
            done(new Error('Should have failed due to missing fields'));
        }).catch((error) => {
            expect(error.response.status).toEqual(400);
            expect(error.response.data).toEqual('Missing username, email or password');
            done();
        });
    });
    //sjekker så om en bruker eksisterer
    test('Check if User exists (GET /check/users) -user exists', (done) => {
        axios.get('/check/users', { params: { username: 'adele', email:'Adele@SonniSan.com' }}).then((response) => {
            expect(response.status).toEqual(200);
            expect(response.data).toEqual('User exists');
            done();
        }).catch(done);
    });
    //sjekker om bruker ikke eksisterer
    test('Check if User exists (GET /check/users) -user does not exist', (done) => {
        axios.get('/check/users',  {params: {username: 'eksiterer ikke', email:'eksistererikke@gmail.com'}}).then((response) => {
            expect(response.status).toEqual(200);
            expect(response.data).toEqual('User does not exist');
            done();
        }).catch(done);
    });
    test('Check user with missing params (GET /check/users) - 400 bad request', (done) => {
        axios.get('/check/users').then(() =>{
            done(new Error('should have failed due to missing params'));
        }).catch((error) => {
            expect(error.response.status).toEqual(400);
            expect(error.response.data).toEqual('Username or email are required');
            done();
        });
    });
});