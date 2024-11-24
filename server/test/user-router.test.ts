import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import format from 'date-fns';
import UserService, { User } from '../src/services/user-service';

axios.defaults.baseURL = 'http://localhost:3004';
// const normalizeDate = (date: string) => new Date(date).toISOString();

const testUser: User[] = [
  {
    user_id: 80,
    username: 'user1',
    email: 'user1@mail.com',
    password_hash: 'User123',
    created_at: "2024-11-08 18:11:00",
    role: 'user',
    bio: 'Hei!',
    profile_picture: 'user1.jpg',
  },
];

let webServer: any;

beforeAll((done) => {
  webServer = app.listen(3004, () => done());
}, 10000); // Shortened timeout to 10 seconds

beforeEach((done) => {
  pool.query('SET FOREIGN_KEY_CHECKS = 0', (err) => {
    if (err) return done(err);
    pool.query('DELETE FROM Users', (err) => {
      if (err) return done(err);
      pool.query('SET FOREIGN_KEY_CHECKS = 1', (err) => {
        if (err) return done(err);

        const values = testUser.map((user) => [
          user.user_id,
          user.username,
          user.email,
          user.password_hash,
          user.created_at,
          user.role,
          user.bio,
          user.profile_picture,
        ]);

        pool.query(
          'INSERT INTO Users (user_id, username, email, password_hash, created_at, role, bio, profile_picture) VALUES ?',
          [values],
          done
        );
      });
    });
  });
}, 10000);

afterAll((done) => {
  if (webServer) {
    webServer.close(() => pool.end(() => done()));
  } else {
    done();
  }
}, 10000);

describe('User Router Tests', () => {
  test('Fetch all users (GET /users) - 200 OK', async () => {
    const response = await axios.get('/users');
  
    expect(response.status).toEqual(200);
  /*
    const expectedTimestamp = new Date(testUser[0].created_at).getTime();
    const receivedTimestamp = new Date(response.data[0].created_at).getTime();
  
    const timeDifference = Math.abs(expectedTimestamp - receivedTimestamp);

    expect(timeDifference).toBeLessThanOrEqual(2000);
  */

    const formattedResponseData = response.data.map((testUser: User) => ({
      ...testUser,
      created_at: new Date(testUser.created_at).toISOString().replace('T', ' ').replace('.000Z', ''),
    }));

    expect(formattedResponseData).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          user_id: testUser[0].user_id,
          username: testUser[0].username,
          password_hash: testUser[0].password_hash,
          email: testUser[0].email,
          role: testUser[0].role,
          created_at: testUser[0].created_at,
          bio: testUser[0].bio,
          profile_picture: testUser[0].profile_picture,
        }),
      ])
    );
  });
  
  test('Fetch user by ID (GET /users/:id) - 200 OK', async () => {
    const response = await axios.get('/users/80');
    expect(response.status).toEqual(200);
    expect(response.data).toEqual(expect.objectContaining({
      user_id: testUser[0].user_id,
      username: testUser[0].username,
      password_hash: testUser[0].password_hash,
      email: testUser[0].email,
      role: testUser[0].role,
      created_at: testUser[0].created_at,
      bio: testUser[0].bio,
      profile_picture: testUser[0].profile_picture,
    }),);
  });

  test('Fetch user by ID (GET /users/:id) - 404 Not Found', async () => {
    try {
      await axios.get('/users/999');
    } catch (error: any) {
      expect(error.response.status).toEqual(404);
      expect(error.response.data).toEqual('User not found');
    }
  });

  test('Update user (PUT /users/:id) - 200 OK', async () => {
    const updatedUser = { username: 'updatedUsername' };
    const updateResponse = await axios.put('/users/80', updatedUser);
    expect(updateResponse.status).toEqual(200);
    expect(updateResponse.data).toEqual('User updated successfully');

    const fetchResponse = await axios.get('/users/80');
    expect(fetchResponse.data.username).toEqual(updatedUser.username);
  });

  test('Update user with invalid role (PUT /users/:id/role) - 400 Bad Request', async () => {
    try {
      await axios.put('/users/80/role', { role: 'invalidRole' });
    } catch (error: any) {
      expect(error.response.status).toEqual(400);
      expect(error.response.data).toEqual('Invalid role');
    }
  });

  test('Successful login (POST /users/login) - 200 OK', async () => {
    const response = await axios.post('/users/login', {
      username: 'onichan',
      password: 'onichan',
    });
    expect(response.status).toEqual(200);
    expect(response.data).toEqual(true);
  });

  test('Failed login (POST /users/login) - 401 Unauthorized', async () => {
    try {
      await axios.post('/users/login', {
        username: 'onichan',
        password: 'wrongpassword',
      });
    } catch (error: any) {
      expect(error.response.status).toEqual(401);
      expect(error.response.data).toEqual('Invalid username or password');
    }
  });

  test('Fetch all users with empty database (GET /users) - 200 OK', async () => {
    await pool.query('DELETE FROM Users');
    const response = await axios.get('/users');
    expect(response.status).toEqual(200);
    expect(response.data).toEqual([]);
  });

  test('Fetch likes for user (GET /:userId/likes) - 200 OK', async () => {
    const response = await axios.get('/80/likes');
    expect(response.status).toEqual(200);
    expect(response.data).toEqual([]); // Expect no likes
  });

  test('Add a like (POST /:userId/likes) - 201 Created', async () => {
    const response = await axios.post('/80/likes', { angelId: 123 });
    expect(response.status).toEqual(201);
    expect(response.data).toEqual('Like added');
  });

  test('Delete a like (DELETE /:userId/likes) - 200 OK', async () => {
    const response = await axios.delete('/80/likes', {
      data: { angelId: 123 },
    });
    expect(response.status).toEqual(200);
    expect(response.data).toEqual('Like deleted');
  });

  test('Fetch wishlist for user (GET /:userId/wishlist) - 200 OK', async () => {
    const response = await axios.get('/80/wishlist');
    expect(response.status).toEqual(200);
    expect(response.data).toEqual([]); // Expect no wishlist items
  });

  test('Add an item to wishlist (POST /:userId/wishlist) - 201 Created', async () => {
    const response = await axios.post('/80/wishlist', { angelId: 456 });
    expect(response.status).toEqual(201);
    expect(response.data).toEqual('Item added to wishlist');
  });

  test('Delete an item from wishlist (DELETE /:userId/wishlist) - 200 OK', async () => {
    const response = await axios.delete('/80/wishlist', {
      data: { angelId: 456 },
    });
    expect(response.status).toEqual(200);
    expect(response.data).toEqual('Item removed from wishlist');
  });
});
