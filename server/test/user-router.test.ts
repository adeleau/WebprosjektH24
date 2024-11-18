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

const testUser: User[] = [
  { user_id: 1, username: 'fitti', email: 'fit@ti.com', password_hash:'Angel123!', created_at: new Date (), role: 'user', bio:'hei', profile_picture:'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/SA_534_01.jpg'},
  { user_id: 2, username: 'titti', email: 'tit@ti.com', password_hash: 'Angel123!', created_at: new Date(), role: 'user', bio:'hallo', profile_picture:'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/SA_733_01.jpg'}, 
  { user_id: 3, username: 'slikki', email: 'sli@kki.com', password_hash: 'Angel123!', created_at: new Date(), role: 'user', bio:'hey', profile_picture:'https://www.sonnyangel.com/renewal/wp-content/uploads/2021/05/raccoon_dog.png'},
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

