import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import registerService from '../src/services/register-service';
import {Users} from '../src/services/register-service';
import { response } from 'express';

axios.defaults.baseURL = 'http://localhost:3001';
const normalizeDate = (date: string | Date) => {
    if (typeof date === 'string') {
        return date.split('.')[0]; // Antar allerede normalisert
    }
    return new Date(date).toISOString().split('.')[0];
};



const testUser : Users[]= [
    {user_id:40, username:'Adele', email:'Adele@san.com', password_hash:'Angel123!', created_at: normalizeDate(new Date()),bio: null, profile_picture: null, role: 'user'},
    {user_id:41, username:'Julia', email:'Julia@kun.com', password_hash:'Angel123!', created_at: normalizeDate(new Date()),bio: null, profile_picture: null, role: 'user'},
    {user_id:42, username:'Emii', email:'Emii@sonny.com', password_hash:'Angel123!', created_at: normalizeDate(new Date()),bio: null, profile_picture: null, role: 'user'},
];

let webServer: any;

beforeAll((done) => {
    webServer = app.listen(3001, () => done());
  });

  beforeEach((done) => {
    pool.query('SET FOREIGN_KEY_CHECKS = 0', (error) => {
        if (error) return done(error);

        // Fjern eksisterende data
        pool.query('DELETE FROM Collections', (error) => {
            if (error) return done(error);
            pool.query('DELETE FROM Wishlists', (error) => {
                if (error) return done(error);
                pool.query('DELETE FROM Users', (error) => {
                    if (error) return done(error);

                    // Sett inn brukere
                    const userValues = testUser.map((user) => [
                        user.user_id,
                        user.username,
                        user.email,
                        user.password_hash,
                        user.created_at,
                    ]);

                    pool.query(
                        'INSERT INTO Users (user_id, username, email, password_hash, created_at) VALUES ?',
                        [userValues],
                        (error) => {
                            if (error) return done(error);

                            // Sett inn relaterte data
                            pool.query(
                                'INSERT INTO Collections (user_id, angel_id) VALUES (40, 123)',
                                (error) => {
                                    if (error) return done(error);
                                    pool.query(
                                        'INSERT INTO Wishlists (user_id, angel_id) VALUES (40, 456)',
                                        (error) => {
                                            if (error) return done(error);
                                            pool.query(
                                                'SET FOREIGN_KEY_CHECKS = 1',
                                                done
                                            );
                                        }
                                    );
                                }
                            );
                        }
                    );
                });
            });
        });
    });
});

/*
beforeEach((done) => {
    pool.query('SET FOREIGN_KEY_CHECKS = 0', (error) => {
        if (error) return done(error);
        pool.query('DELETE FROM Posts', (error) => { // Slett poster som refererer til Users
            if (error) return done(error);
            pool.query('DELETE FROM Users', (error) => {
                if (error) return done(error);
                pool.query('SET FOREIGN_KEY_CHECKS = 1', (error) => {
                    if (error) return done(error);
        
                // Legg inn testdata i Users
                registerService
                    .register(testUser[0].username, testUser[0].email, testUser[0].password_hash)
                    .then(() => registerService.register(testUser[40].username, testUser[40].email, testUser[40].password_hash))
                    .then(() => registerService.register(testUser[41].username, testUser[41].email, testUser[41].password_hash))
                    .then(() => {

                        pool.query(
                        'INSERT INTO Posts (post_id, user_id, title, content) VALUES (40,41,"Test title", "Test Post")',
                        done
                    );
                })
                .catch(done);    
            });
        });
    });
    })
})*/
    

afterAll((done) => {
    if (!webServer) return done(new Error());
    webServer.close(() => pool.end(() => done()));
  });

//tester tilfeller
describe('Register Router Tests', () => {

//henter ut alle brukerne
test('Fetch all users (GET /users) - 200 OK', (done) => {
    axios.get('/users').then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data.length).toEqual(3);

        const expectedUsers = testUser.map(user => ({
            ...user,
            created_at: normalizeDate(new Date(user.created_at)), // Normaliser testdata
        }));

        const receivedUsers = response.data.map(user => ({
            ...user,
            created_at: normalizeDate(new Date(user.created_at)), // Normaliser API-data
        }));

        expect(receivedUsers).toEqual(expect.arrayContaining(expectedUsers));
        done();
    }).catch(done);
});

   
      
   /* test('Fetch all users (GET /users ) - 200 OK', (done) =>{
        axios.get('/users').then((response) => {
            expect(response.status).toEqual(200);
            expect(response.data.length).toEqual(3);
            expect(response.data).toEqual(expect.arrayContaining(testUser));
            done();
        }).catch(done);
    });*/

    //henter ut en enkelt bruker
    test('Fetch user by ID (GET /users/:user_id) - 200 OK', (done) => {
        axios.get('/users/41').then((response) => {
            expect(response.status).toEqual(200);
    
            const normalizedUser = {
                ...response.data,
                created_at: normalizeDate(response.data.created_at), // Normaliser dato fra API-et
            };
    
            const expectedUser = {
                ...testUser[1], // Bruk riktig indeks
            created_at: normalizeDate(testUser[1].created_at),
            };
    
            expect(normalizedUser).toEqual(expectedUser);
            done();
        }).catch(done);
    });
    
   /* test('Fetch user by ID (GET /users/:user_id) - 200 OK', (done) =>{
        axios.get('/users/41').then((response) => {
            expect(response.status).toEqual(200);
            expect(response.data).toEqual(testUser[0]);
            done();
        }).catch(done);
    }); */

    /*test('Fetch user by ID (GET /users/:user_id) -404 Not Found', (done) => {
        axios.get('/users/99').then(() =>{ //spørs om vi skal sette det til høyre enn 99 siden nettsiden burde kunne ha mer enn 99 brukere
            done(new Error('Should not find non existens user'));
        }).catch((error) => {
            expect(error.response.status).toEqual(404),
            expect(error.response.data).toEqual('User not found');
            done();
        });
    });*/

    test('Fetch user by ID (GET /users/:user_id) -404 Not Found', (done) => {
        axios.get('/users/99').then(() => {
          done(new Error('Should not find non existens user'));
        }).catch((error) => {
          expect(error.response.status).toEqual(404); // Sørg for at 404 returneres fra API-et
          expect(error.response.data).toEqual('User not found'); // Sørg for at riktig melding returneres
          done();
        });
      });
      
    //test for registrering av ny bruker
    test('Register a new user (POST /register) - 201', (done) => {
        const newUser = { username: 'testerbruker1', email: 'testereks1@gmail.com', password_hash: '123456' };
    
        axios.post('/register', newUser)
            .then((response) => {
                expect(response.status).toEqual(201);
    
                const expectedUser = {
                    username: {
                        ...newUser,
                        created_at: expect.any(String), // Tillat hvilken som helst streng
                        bio: null,
                        profile_picture: null,
                        role: 'user',
                        user_id: expect.any(Number), // Tillat hvilken som helst ID
                    },
                };
    
                expect(response.data).toMatchObject(expectedUser);
                done();
            })
            .catch(done);
    });
    
    
    /*test('Register a new user (POST /register) -201', (done) => {
        axios.post('/register', { username: 'testerbruker1', email: 'testereks1@gmail.com', password_hash: '123456' })
            .then((response) => {
                expect(response.status).toEqual(201);
    
                const expectedUser = {
                    username: 'testerbruker1',
                    email: 'testereks1@gmail.com',
                    password_hash: '123456',
                };
    
                const actualUser = {
                    username: response.data.username,
                    email: response.data.email,
                    password_hash: response.data.password_hash,
                };
    
                expect(actualUser).toEqual(expectedUser);
                done();
            })
            .catch(done);
    });*/
    
    /*test('Register a new user (POST /register) -201', (done) => {
        axios.post('/register', { username: 'testerbruker1', email: 'testereks1@gmail.com', password_hash: '123456' })
          .then((response) => {
            expect(response.status).toEqual(201);
            expect(response.data).toHaveProperty('username', 'testerbruker1'); // Sjekker direkte
            done();
          })
          .catch(done);
      });*/
      
      
    /*test('Register a new user (POST /register) -201', (done) => {
        axios.post('/register', {username:'testerbruker1', email:'testereks1@gmail.com', password_hash:'123456'}).then((response) =>{
            expect(response.status).toEqual(201);
            expect(response.data).toHaveProperty('username','testerbruker1');
            done();
        }).catch(done);
    });*/

    test('Register a user with missing fields (POST /register) 400 Bad Request', (done) => {
        axios.post('/register', {username: 'incomplete'}).then(() => {
            done(new Error('Should have failed due to missing fields'));
        }).catch((error) => {
            expect(error.response.status).toEqual(400);
            expect(error.response.data).toEqual('Missing username, email, or password hash');
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
            expect(error.response.data).toEqual('username or email are required');
            done();
        });
    });
});