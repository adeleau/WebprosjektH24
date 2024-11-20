import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import format from 'date-fns';
import UserService from '../src/services/user-service';
import userService, {User} from '../src/services/user-service';
//import { response } from 'express';

axios.defaults.baseURL = 'http://localhost:3004';
const normalizeDate = (date: string) => new Date(date).toISOString().split('.')[0];

const testUser: User[] = [
  {
    user_id: 80,
    username: 'onichan',
    email: 'onichan@mail.com',
    password_hash: 'onichan',
    created_at: normalizeDate(new Date().toISOString()),
    role: 'user',
    bio: 'ohayo',
    profile_picture: 'onichan.jpg',
  },
];

let webServer: any;

beforeAll((done) => {
  webServer = app.listen(3004, () => done());
},60000);

beforeEach((done) => {
  pool.query('SET FOREIGN_KEY_CHECKS = 0', (err) => {
    if (err) return done(err);

    pool.query('DELETE FROM Users', (truncateErr) => {
      if (truncateErr) return done(truncateErr);

      pool.query('SET FOREIGN_KEY_CHECKS = 1', (enableErr) => {
        if (enableErr) return done(enableErr);

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
  });
},60000);

afterAll((done) => {
  if (webServer) {
    webServer.close(() => pool.end(() => done()));
  } else {
    done();
  }
},60000);

describe('User Router Tests', () => {
  // Test for å hente alle brukere
  test('Fetch all users (GET /users) - 200 OK', (done) => {
    axios
      .get('/users')
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data.length).toEqual(1);
        expect(response.data).toEqual(expect.arrayContaining(testUser));
        done();
      })
      .catch(done);
  });

  // Test for å hente en bruker basert på ID
  test('Fetch user by ID (GET /users/:id) - 200 OK', (done) => {
    axios
      .get('/users/1')
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(testUser[0]);
        done();
      })
      .catch(done);
  });

  // Test for å hente en bruker som ikke eksisterer
  test('Fetch user by ID (GET /users/:id) - 404 Not Found', (done) => {
    axios
      .get('/users/999')
      .then(() => done(new Error('Should not find a non-existing user')))
      .catch((error) => {
        expect(error.response.status).toEqual(404);
        expect(error.response.data).toEqual('User not found');
        done();
      });
  });

  // Test for å oppdatere en bruker
  test('Update user (PUT /users/:id) - 200 OK', (done) => {
    const updatedUser = { username: 'updatedUsername' };

    axios
      .put('/users/1', updatedUser)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual('User updated successfully');

        return axios.get('/users/80');
      })
      .then((response) => {
        expect(response.data.username).toEqual(updatedUser.username);
        done();
      })
      .catch(done);
  });

 
  // Test for å oppdatere en bruker med ugyldig rolle
  test('Update user with invalid role (PUT /users/:id/role) - 400 Bad Request', (done) => {
    axios
      .put('/users/80/role', { role: 'invalidRole' })
      .then(() => done(new Error('Should have failed')))
      .catch((error) => {
        expect(error.response.status).toEqual(400);
        expect(error.response.data).toEqual('Invalid role');
        done();
      });
  });

  // Test for vellykket innlogging
  test('Successful login (POST /users/login) - 200 OK', (done) => {
    axios
      .post('/users/login', { username: 'onichan', password: 'onichan' })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(true);
        done();
      })
      .catch(done);
  });

  // Test for mislykket innlogging
  test('Failed login (POST /users/login) - 401 Unauthorized', (done) => {
    axios
      .post('/users/login', { username: 'onichan', password: 'wrongpassword' })
      .then(() => done(new Error('Should have failed')))
      .catch((error) => {
        expect(error.response.status).toEqual(401);
        expect(error.response.data).toEqual('Invalid username or password');
        done();
      });
  });

  // Test for en tom database
  test('Fetch all users with empty database (GET /users) - 200 OK', (done) => {
    pool.query('TRUNCATE TABLE Users', (err) => {
      if (err) return done(err);

      axios
        .get('/users')
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.data).toEqual([]);
          done();
        })
        .catch(done);
    });
  });

  //hente likes
  test('Fetch likes for user (GET /:userId/likes) - 200 OK', (done) => {
    axios
      .get('/80/likes')
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual([]); // Expect no likes
        done();
      })
      .catch(done);
  });

  //legge til en like
  test('Add a like (POST /:userId/likes) - 201 Created', (done) => {
    axios
      .post('/80/likes', { angelId: 123 })
      .then((response) => {
        expect(response.status).toEqual(201);
        expect(response.data).toEqual('Like added');
        done();
      })
      .catch(done);
  });

  //Slette en like
  test('Delete a like (DELETE /:userId/likes) - 200 OK', (done) => {
    axios
      .delete('/80/likes', { data: { seriesId: 123 } })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual('Like deleted');
        done();
      })
      .catch(done);
  })

  //hente noe fra wishlist
  test('Fetch wishlist for user (GET /:userId/wishlist) - 200 OK', (done) => {
    axios
      .get('/80/wishlist')
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual([]); // Expect no wishlist items
        done();
      })
      .catch(done);
  });

  //legge til en item for wishlist
  test('Add an item to wishlist (POST /:userId/wishlist) - 201 Created', (done) => {
    axios
      .post('/80/wishlist', { angelId: 456 })
      .then((response) => {
        expect(response.status).toEqual(201);
        expect(response.data).toEqual('Item added to wishlist');
        done();
      })
      .catch(done);
  });


  //Slette en item fra wishlist
  test('Delete an item from wishlist (DELETE /:userId/wishlist) - 200 OK', (done) => {
    axios
      .delete('/80/wishlist', { data: { seriesId: 456 } })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual('Item removed from wishlist');
        done();
      })
      .catch(done);
  });

  // Test for uventet databasefeil
  test('Unexpected database error (GET /users) - 500 Internal Server Error', (done) => {
    (pool.query as jest.Mock).mockImplementationOnce((_, __, callback) =>
      callback(new Error('Unexpected database error'), null)
    );

    axios
      .get('/users')
      .then(() => done(new Error('Should have failed')))
      .catch((error) => {
        expect(error.response.status).toEqual(500);
        expect(error.response.data).toEqual('Server error');
        done();
      });
  });
});




