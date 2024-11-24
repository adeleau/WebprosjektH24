import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import format from 'date-fns';
import UserService, { User } from '../src/services/user-service';
//import { response } from 'express';

axios.defaults.baseURL = 'http://localhost:3004';
const normalizeDate = (date: string) => new Date(date).toISOString().split('.')[0];
// We had to use normalize date and toISOString since this was more compatible with React
const testUser: User[] = [
  {
    user_id: 80,
    username: 'onichan',
    email: 'onichan@mail.com',
    email: 'onichan@mail.com',
    password_hash: 'onichan',
    created_at: normalizeDate(new Date().toISOString()),
    role: 'user',
    created_at: normalizeDate(new Date().toISOString()),
    role: 'user',
    bio: 'ohayo',
    profile_picture: 'onichan.jpg',
    profile_picture: 'onichan.jpg',
  },
];

let webServer: any;

beforeAll((done) => {
  webServer = app.listen(3004, () => done());
},60000);
},60000);

beforeEach((done) => {
  pool.query('SET FOREIGN_KEY_CHECKS = 0', (err) => {
    if (err) return done(err);

    pool.query('DELETE FROM Users', (truncateErr) => {
      if (truncateErr) return done(truncateErr);

      pool.query('SET FOREIGN_KEY_CHECKS = 1', (enableErr) => {
        if (enableErr) return done(enableErr);
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
},60000); // The methods used up to here are very similar to the mandatory assigments we had
// Explenation for method of choice is in the ReadMe file
describe('User Router Tests', () => {
  // Test to get all users
  test('Fetch all users (GET /users) - 200 OK', async () => {
    try {
      const response = await axios.get('/users');
      expect(response.status).toEqual(200);
      expect(response.data.length).toEqual(1);
      expect(response.data).toEqual(expect.arrayContaining(testUser));
    } catch (error) {
      throw error;
    }
  });

  // Test to get a user by ID 
  test('Fetch user by ID (GET /users/:id) - 200 OK', async () => {
    try {
      const response = await axios.get('/users/1');
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testUser[0]);
    } catch (error) {
      throw error;
    }
  });

  // Test to get a user who doesent exist
  test('Fetch user by ID (GET /users/:id) - 404 Not Found', async () => {
    try {
      await axios.get('/users/999');
      throw new Error('Should not find a non-existing user');
    } catch (error: any) {
      expect(error.response.status).toEqual(404);
      expect(error.response.data).toEqual('User not found');
    }
  });

  // Test to update a user
  test('Update user (PUT /users/:id) - 200 OK', async () => {
    try {
      const updatedUser = { username: 'updatedUsername' };
      const updateResponse = await axios.put('/users/80', updatedUser);
      expect(updateResponse.status).toEqual(200);
      expect(updateResponse.data).toEqual('User updated successfully');

      const fetchResponse = await axios.get('/users/80');
      expect(fetchResponse.data.username).toEqual(updatedUser.username);
    } catch (error) {
      throw error;
    }
  });

  // Test to update a user with invalid role 
  test('Update user with invalid role (PUT /users/:id/role) - 400 Bad Request', async () => {
    try {
      await axios.put('/users/80/role', { role: 'invalidRole' });
      throw new Error('Should have failed');
    } catch (error: any) {
      expect(error.response.status).toEqual(400);
      expect(error.response.data).toEqual('Invalid role');
    }
  });

  // Test for successfull inlogging 
  test('Successful login (POST /users/login) - 200 OK', async () => {
    try {
      const response = await axios.post('/users/login', {
        username: 'onichan',
        password: 'onichan',
      });
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(true);
    } catch (error) {
      throw error;
    }
  });

  // Test for unsuccessfull inlogging 
  test('Failed login (POST /users/login) - 401 Unauthorized', async () => {
    try {
      await axios.post('/users/login', {
        username: 'onichan',
        password: 'wrongpassword',
      });
      throw new Error('Should have failed');
    } catch (error: any) {
      expect(error.response.status).toEqual(401);
      expect(error.response.data).toEqual('Invalid username or password');
    }
  });

  // Test for an empty database
  test('Fetch all users with empty database (GET /users) - 200 OK', async () => {
    try {
      await pool.query('TRUNCATE TABLE Users');
      const response = await axios.get('/users');
      expect(response.status).toEqual(200);
      expect(response.data).toEqual([]);
    } catch (error) {
      throw error;
    }
  });

  // Test to get likes for user 
  test('Fetch likes for user (GET /:userId/likes) - 200 OK', async () => {
    try {
      const response = await axios.get('/80/likes');
      expect(response.status).toEqual(200);
      expect(response.data).toEqual([]); // Expect no likes
    } catch (error) {
      throw error;
    }
  });

  // Test to add a like
  test('Add a like (POST /:userId/likes) - 201 Created', async () => {
    try {
      const response = await axios.post('/80/likes', { angelId: 123 });
      expect(response.status).toEqual(201);
      expect(response.data).toEqual('Like added');
    } catch (error) {
      throw error;
    }
  });

  // Test to delete a like 
  test('Delete a like (DELETE /:userId/likes) - 200 OK', async () => {
    try {
      const response = await axios.delete('/80/likes', {
        data: { seriesId: 123 },
      });
      expect(response.status).toEqual(200);
      expect(response.data).toEqual('Like deleted');
    } catch (error) {
      throw error;
    }
  });

  // Test to get wishlist for user
  test('Fetch wishlist for user (GET /:userId/wishlist) - 200 OK', async () => {
    try {
      const response = await axios.get('/80/wishlist');
      expect(response.status).toEqual(200);
      expect(response.data).toEqual([]); // Expect no wishlist items
    } catch (error) {
      throw error;
    }
  });

  // Test to add an item to wishlist
  test('Add an item to wishlist (POST /:userId/wishlist) - 201 Created', async () => {
    try {
      const response = await axios.post('/80/wishlist', { angelId: 456 });
      expect(response.status).toEqual(201);
      expect(response.data).toEqual('Item added to wishlist');
    } catch (error) {
      throw error;
    }
  });

  // Test to delete an item from wishlist for å slette en item fra wishlist
  test('Delete an item from wishlist (DELETE /:userId/wishlist) - 200 OK', async () => {
    try {
      const response = await axios.delete('/80/wishlist', {
        data: { seriesId: 456 },
      });
      expect(response.status).toEqual(200);
      expect(response.data).toEqual('Item removed from wishlist');
    } catch (error) {
      throw error;
    }
  });
});

// import axios from 'axios';
// import app from '../src/app';
// import pool from '../src/mysql-pool';

// jest.mock('../src/mysql-pool', () => ({
//   query: jest.fn(),
// }));

// axios.defaults.baseURL = 'http://localhost:3004';

// let webServer: any;

// jest.setTimeout(10000); 

// beforeAll((done) => {
//   webServer = app.listen(3004, () => done());
// }, 60000);

// afterAll(async () => {
//   if (webServer) {
//     await webServer.close();
//   }
// });

// describe('User Router Tests with Mocked Database (Async)', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   test('Fetch all users (GET /users) - 200 OK', async () => {
//     (pool.query as jest.Mock).mockResolvedValue([
//       {
//         user_id: 80,
//         username: 'onichan',
//         email: 'onichan@mail.com',
//         password_hash: 'onichan',
//         role: 'user',
//         bio: 'ohayo',
//         profile_picture: 'onichan.jpg',
//         created_at: new Date().toISOString(),
//       },
//     ]);
  
//     const response = await axios.get('/users');
//     expect(response.status).toEqual(200);
//     expect(response.data).toEqual([
//       {
//         user_id: 80,
//         username: 'onichan',
//         email: 'onichan@mail.com',
//         password_hash: 'onichan',
//         role: 'user',
//         bio: 'ohayo',
//         profile_picture: 'onichan.jpg',
//         created_at: expect.any(String),
//       },
//     ]);
//   }, 10000); 
  

//   test('Fetch user by ID (GET /users/:id) - 200 OK', async () => {
//     (pool.query as jest.Mock).mockResolvedValue([
//       {
//         user_id: 80,
//         username: 'onichan',
//         email: 'onichan@mail.com',
//         password_hash: 'onichan',
//         role: 'user',
//         bio: 'ohayo',
//         profile_picture: 'onichan.jpg',
//         created_at: new Date().toISOString(),
//       },
//     ]);

//     const response = await axios.get('/users/80');
//     expect(response.status).toEqual(200);
//     expect(response.data).toEqual({
//       user_id: 80,
//       username: 'onichan',
//       email: 'onichan@mail.com',
//       password_hash: 'onichan',
//       role: 'user',
//       bio: 'ohayo',
//       profile_picture: 'onichan.jpg',
//       created_at: expect.any(String),
//     });
//   });

//   test('Fetch user by ID (GET /users/:id) - 404 Not Found', async () => {
//     (pool.query as jest.Mock).mockResolvedValue([]);

//     try {
//       await axios.get('/users/999');
//     } catch (error: any) {
//       expect(error.response.status).toEqual(404);
//       expect(error.response.data).toEqual('User not found');
//     }
//   });

//   test('Update user (PUT /users/:id) - 200 OK', async () => {
//     (pool.query as jest.Mock).mockResolvedValueOnce({ affectedRows: 1 });
//     (pool.query as jest.Mock).mockResolvedValueOnce([
//       {
//         user_id: 80,
//         username: 'updatedUsername',
//         email: 'onichan@mail.com',
//         password_hash: 'onichan',
//         role: 'user',
//         bio: 'ohayo',
//         profile_picture: 'onichan.jpg',
//         created_at: new Date().toISOString(),
//       },
//     ]);

//     const updateResponse = await axios.put('/users/80', { username: 'updatedUsername' });
//     expect(updateResponse.status).toEqual(200);
//     expect(updateResponse.data).toEqual('User updated successfully');

//     const fetchResponse = await axios.get('/users/80');
//     expect(fetchResponse.data.username).toEqual('updatedUsername');
//   });

//   test('Successful login (POST /users/login) - 200 OK', async () => {
//     (pool.query as jest.Mock).mockResolvedValue([
//       {
//         user_id: 80,
//         username: 'onichan',
//         password_hash: 'onichan',
//       },
//     ]);

//     const response = await axios.post('/users/login', {
//       username: 'onichan',
//       password: 'onichan',
//     });
//     expect(response.status).toEqual(200);
//     expect(response.data).toEqual(true);
//   });

//   test('Failed login (POST /users/login) - 401 Unauthorized', async () => {
//     (pool.query as jest.Mock).mockResolvedValue([]);

//     try {
//       await axios.post('/users/login', {
//         username: 'onichan',
//         password: 'wrongpassword',
//       });
//     } catch (error: any) {
//       expect(error.response.status).toEqual(401);
//       expect(error.response.data).toEqual('Invalid username or password');
//     }
//   });
// });
