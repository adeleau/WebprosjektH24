import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import format from 'date-fns';
import UserService from '../src/services/user-service';
import userService, {User} from '../src/services/user-service';
//import { response } from 'express';

axios.defaults.baseURL = 'http://localhost:3004';
const date = new Date().toISOString().split('.')[0].replace('T',' ');

const testUser : User[] = [
  { user_id: 1,
    username: 'onichan',
    email: 'onichan@mail.com' ,
    password_hash: 'onichan',
    created_at: date,
    role:  'user',
    bio: 'ohayo',
    profile_picture:'onichan.jpg', 
  },
  {
    user_id: 2,
    username: 'girl',
    email: 'girl@mail.com' ,
    password_hash: 'girl123',
    created_at: date,
    role:  'admin',
    bio: 'ohayo',
    profile_picture:'onichan.jpg'
  },
];

let webServer: any;
//kjører den nåværende datoen, samme metode brukt i post..tror jeg?

beforeAll((done) => {
  webServer = app.listen(3004, () => done());
});

beforeEach((done) => {
    pool.query('DELETE FROM Users', (error) => {
      if (error) return done(error);

     const values = testUser.map((user) => [
      user.user_id,
      user.username,
      user.email,
      user.password_hash,
      user.role,
      user.bio,
      user.profile_picture,
     ]);

     pool.query(
      'INSERT INTO Users (user_id, username, email, password_hash, role, bio, profile_picture) VALUES ?',
      [values],
      done
     );
    });
  });

afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => pool.end(() => done()));
});

//Henter alle brukere
describe('User router Tests', () => {
  test('Fetch all Users(GET /Users) - 200 OK', (done) => {
    axios.get('/users')
    .then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(
      expect.arrayContaining(
        testUser.map((user) => ({
          ...user,
          }))
        )
      );
      done();
    })
    .catch(done);
  });

  //henter en enjelt bruker med ID
  test('Fetch User by ID (GET /users:id) - 200 OK', (done) => {
    axios.get('/users/1')
    .then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual({
        ...testUser[0],
      });
      done();
    })
    .catch(done);
  });

  //Henting av bruker feiler
  test('Fetch User by ID (GET /users/:id) - 404 Not Found', (done) => {
    axios.get('/users/999')
    .then(() => done(new Error('Request should have failed')))
    .catch((error) => {
      expect(error.response?.status).toEqual(404);
      expect(error.response?.data).toEqual('User not found');
      done();
    });
  });

  //oppdaterer brukeren
  test('Update user (PUT /users/:id) - 200 OK', (done) => {
    const updateData = {
      username: 'onesan' ,
      email: 'onesan@mail.com',
      bio:'onesan konto' ,
      profile_picture: 'onesanimage.jpg',
    };

    axios
      .put('/users/1', updateData)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual('User updated successfully');
        return axios.get('/users/1');
      })
      .then((response) => {
        expect(response.data).toEqual({
          ...testUser[0],
          ...updateData,
        });
        done();
      })
      .catch(done);
  });

  //feilmelding ved update user
  test('Fetch User by ID (GET /users:id) -404 NOT FOUND', (done) => {
    axios
    .put('/users/999', { username: 'nonexistent'})
    .then(() => done(new Error('Request should have failed')))
    .catch((error) => {
      expect(error.response?.status).toEqual(404);
      expect(error.response?.data).toEqual('User not Found');
      done();
    });
  });

  //tester nå for login
  //Valid logging
  test('Valid Login (POST /users/login) - 200 OK', (done) => {
    axios
      .post('/users/login', {username:'onichan', password:'onichan' })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(true);
        done();
      })
      .catch(done);
  });

//Inavlid logging
test('Inavlid Login (POST /users/login) - 200 OK', (done) => {
  axios
  .post('/users/login', { username: 'sangwoo', password: 'bumbum'})
  .then((response) => {
    expect(response.status).toEqual(200);
    expect(response.data).toEqual(false);
    done();
  })
  .catch(done);
  });
});








/*
let webServer: any;
beforeAll((done) => {
    webServer = app.listen(3004, () => done());
});

const date = new Date().toISOString().split('.')[0].replace('T', ' ');

const testUser: User[] = [
  { user_id: 1, username: 'user1', email: '1@test.com', password_hash:'Angel123!', created_at: date, role: 'user', bio:'hei', profile_picture:'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/SA_534_01.jpg'},
  { user_id: 2, username: 'user2', email: '2@test.com', password_hash: 'Angel123!', created_at: date, role: 'user', bio:'hallo', profile_picture:'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/SA_733_01.jpg'}, 
  { user_id: 3, username: 'user3', email: '3@test.com', password_hash: 'Angel123!', created_at: date, role: 'user', bio:'hey', profile_picture:'https://www.sonnyangel.com/renewal/wp-content/uploads/2021/05/raccoon_dog.png'},
];

beforeEach((done) => {
  // Disable foreign key checks
  pool.query('SET FOREIGN_KEY_CHECKS = 0', (error) => {
    if (error) return done(error);

    // Truncate the Users table
    pool.query('TRUNCATE TABLE Users', (error) => {
      if (error) return done(error);

      // Re-enable foreign key checks
      pool.query('SET FOREIGN_KEY_CHECKS = 1', (error) => {
        if (error) return done(error);

        // Insert test users
        const values = testUser.map((user) => [
          user.username,
          user.email,
          user.password_hash,
          user.created_at,
          user.role,
          user.bio,
          user.profile_picture,
        ]);

        pool.query(
          'INSERT INTO Users (username, email, password_hash, created_at, role, bio, profile_picture) VALUES ?',
          [values],
          done
        );
      });
    });
  });
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => pool.end(() => done()));
});

describe('Fetch Users (GET)', () => {
  test('Fetch all Users (200 OK)', (done) => {
    axios.get('/users').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(
        testUser.map((user) => ({
          ...user,
          created_at: expect.any(String),
        }))
      );
      done();
    });
  }, 10000);

  test('Fetch user (200 OK)', (done) => {
    axios.get('/users/1').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual({
        ...testUser[0],
        created_at: expect.any(String), 
      });
      done();
    });
  }, 10000);

  test('Fetch user (404 Not Found)', (done) => {
    axios
      .get('/users/4')
      .then(() => done(new Error('Request should have failed')))
      .catch((error) => {
        expect(error.response?.status).toEqual(404);
        expect(error.response?.data).toEqual('User not found'); 
        done();
      });
  });
});

describe('Update user (PUT)', () => {
  test('Update user (200 OK)', (done) => {
    axios
      .put('/users/1', {
        username: 'updateduser',
        email: 'updateduser@example.com',
        bio: 'Updated bio',
        profile_picture: 'https://example.com/updated-profile.png',
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual('User updated successfully');
        done();
      })
      .catch(done);
  });

  test('Update user without required fields (400 Bad Request)', (done) => {
    axios
      .put('/users/1', {
        email: '', 
      })
      .then(() => done(new Error('Request should have failed')))
      .catch((error) => {
        expect(error.response?.status).toEqual(400);
        expect(error.response?.data).toEqual('Email is required');
        done();
      });
  });

  test('Update non-existing user (404 Not Found)', (done) => {
    axios
      .put('/users/999', {
        username: 'nonexistent',
        email: 'nonexistent@example.com',
      })
      .then(() => done(new Error('Request should have failed')))
      .catch((error) => {
        expect(error.response?.status).toEqual(404);
        expect(error.response?.data).toEqual('User not found');
        done();
      });
  });
});
*/

