import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import {Users} from '../src/services/register-service';

// use of async/await and normalizeDate due to being more compatible witch react
axios.defaults.baseURL = 'http://localhost:3001';
const normalizeDate = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().split('.')[0];
};

const testUser : Users[]= [
    {user_id:40, username:'Adele', email:'Adele@san.com', password_hash:'Angel123!'/*, created_at: normalizeDate(new Date()),bio: null, profile_picture: null, role: 'user'*/},
    {user_id:41, username:'Julia', email:'Julia@kun.com', password_hash:'Angel123!'/*, created_at: normalizeDate(new Date()),bio: null, profile_picture: null, role: 'user'*/},
    {user_id:42, username:'Emii', email:'Emii@sonny.com', password_hash:'Angel123!'/*, created_at: normalizeDate(new Date()),bio: null, profile_picture: null, role: 'user'*/},
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
                        //user.created_at,
                    ]);

                    pool.query(
                        'INSERT INTO Users (user_id, username, email, password_hash) VALUES ?',
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


afterAll((done) => {
    if (!webServer) return done(new Error());
    webServer.close(() => pool.end(() => done()));
  });

// Test cases
describe('Register Router Tests', () => {
  test('Fetch all users (GET /users) - 200 OK', async () => {
    const response = await axios.get('/users');
    expect(response.status).toEqual(200);
    expect(response.data.length).toEqual(3);

    const expectedUsers = testUser.map((user: Users) => ({
      ...user,
      //created_at: normalizeDate(new Date(user.created_at)), // Normalize test data
    }));

    const receivedUsers = response.data.map((user: Users) => ({
      ...user,
      //created_at: normalizeDate(new Date(user.created_at)), // Normalize API data
    }));

    expect(receivedUsers).toEqual(expect.arrayContaining(expectedUsers));
  });

  test('Fetch user by ID (GET /users/:user_id) - 200 OK', async () => {
    const response = await axios.get('/users/41');
    expect(response.status).toEqual(200);

    const normalizedUser = {
      ...response.data,
     // created_at: normalizeDate(response.data.created_at), // Normalize date from API
    };

    const expectedUser = {
      ...testUser[1],
      //created_at: normalizeDate(testUser[1].created_at),
    };

    expect(normalizedUser).toEqual(expectedUser);
  });

  test('Fetch user by ID (GET /users/:user_id) - 404 Not Found', async () => {
    try {
      await axios.get('/users/99');
    } catch (error: any) {
      expect(error.response.status).toEqual(404);
      expect(error.response.data).toEqual('User not found');
    }
  });

  test('Register a new user (POST /register) - 201 Created', async () => {
    const newUser = { user_id: 3, username: 'testerbruker1', email: 'testereks1@gmail.com', password_hash: '123456' };

    const response = await axios.post('/register', newUser);
    expect(response.status).toEqual(201);

    expect(response.data).toEqual(
      expect.objectContaining({
        username: newUser.username,
        /*email: newUser.email,
        password_hash: newUser.password_hash,
        user_id: newUser.user_id,*/
        /*created_at: expect.any(String),
        bio: null,
        profile_picture: null,
        role: 'user',
        user_id: expect.any(Number),*/
      })
    );    
  });

  test('Register a user with missing fields (POST /register) - 400 Bad Request', async () => {
    try {
      await axios.post('/register', { username: 'incomplete' });
    } catch (error: any) {
      expect(error.response.status).toEqual(400);
      expect(error.response.data).toEqual('Missing fields');
    }
  });

  test('Check if User exists (GET /check/users) - User exists', async () => {
    const response = await axios.get('/check/users', { params: { username: 'Adele', email: 'Adele@san.com' } });
    expect(response.status).toEqual(200);
    expect(response.data).toEqual('User exists');
  });

  test('Check if User exists (GET /check/users) - User does not exist', async () => {
    const response = await axios.get('/check/users', { params: { username: 'nonexistent', email: 'nonexistent@gmail.com' } });
    expect(response.status).toEqual(200);
    expect(response.data).toEqual('User does not exist');
  });

  test('Check user with missing params (GET /check/users) - 400 Bad Request', async () => {
    try {
      await axios.get('/check/users');
    } catch (error: any) {
      expect(error.response.status).toEqual(400);
      expect(error.response.data).toEqual('Missing username or email');
    }
  });
});

