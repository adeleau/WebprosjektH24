import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import postService, { Post } from '../src/services/post-service';

axios.defaults.baseURL = 'http://localhost:3003';

const testPosts: Post[] = [
  {
    post_id: 21,
    user_id: 31,
    title: 'Post1',
    content: 'Hello',
    image: 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/new_cameleon_01-1.jpg',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    post_id: 22,
    user_id: 32,
    title: 'Post2',
    content: 'Hei',
    image: 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/new_cow_01-1.jpg',
    created_at: new Date(),
    updated_at: new Date(),
  }
];

let webServer: any;
beforeAll((done) => {
    webServer = app.listen(3003, () => done());
}, 60000);

beforeEach((done) => {
  pool.query('SET FOREIGN_KEY_CHECKS = 0', (error) => {
    if (error) return done(error);

    pool.query('TRUNCATE TABLE Posts', (error) => {
      if (error) return done(error);

        pool.query('SET FOREIGN_KEY_CHECKS = 1', (error) => {
          if (error) return done(error);

          // Insert test data sequentially
          postService
            .createPost(testPosts[0].user_id, testPosts[0].title, testPosts[0].content, testPosts[0].image)
            .then((result) => {
              return postService.createPost(testPosts[1].user_id, testPosts[1].title, testPosts[1].content, testPosts[1].image)}
            )
            .then((result) => { 
              done(); 
            })
            .catch((error) => {
  
              done(error);
            });  
        });
    });
  });
});

afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => pool.end(() => done()));
}, 60000);

jest.setTimeout(60000);

describe('PostService GET Tests', () => {
  test('Fetch all posts (GET /posts) - 200 OK', (done) => {
    axios.get('/posts').then((response) => {
      // console.log('Response data:', response.data);
      // console.log('Response status:', response.status);
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(expect.arrayContaining([expect.objectContaining({ user_id: 31, title: 'Post1' })]));
      done();
    }).catch(done);
  });

  test('Fetch all posts (empty table) when no posts exist (GET /posts) - 200 OK', (done) => {
    pool.query('DELETE FROM Posts', (error) => {
      if (error) return done(error);
      axios.get('/posts').then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual([]);
        done();
      }).catch(done);
    });
  });  

  test('Fetch post by ID (GET /posts/:post_id) - 200 OK', (done) => {
    axios.get('/posts/32').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(expect.objectContaining({ title: 'Post2', content: 'Hei' }));
      done();
    }).catch(done);
  });

  test('Fetch post with invalid ID (GET /posts/:post_id) - 400 Bad Request', (done) => {
    axios.get('/posts/invalid-id').then(() => {
        done(new Error('Request should have failed due to invalid post ID'));
      })
      .catch((error) => {
        expect(error.response.status).toEqual(400);
        expect(error.response.data).toEqual('Invalid post ID');
        done();
      });
  });

  test('Fetch non-existing post (GET /posts/:post_id) - 404 Not Found', (done) => {
    axios.get('/posts/999')
      .then(() => {
        done(new Error('Request should have failed due to non-existing post'));
      })
      .catch((error) => {
        expect(error.response.status).toEqual(404);
        expect(error.response.data).toEqual('Post not found');
        done();
      });
  });
  
});

describe('PostService POST Tests', () => {
  test('Post new post (POST /posts) - 201 Created', (done) => {
    axios.post('/posts', 
      { user_id: 33, title: 'Post3', content: 'Halla', image: 'bilde.com/bilde.jpg' }
    ).then((response) => {
      expect(response.status).toEqual(201);
      expect(response.data).toEqual(expect.objectContaining({
        post_id: expect.any(Number),
      }));
      return axios.get('/posts/' + response.data.post_id);
    }).then((res) => {
      expect(res.data).toEqual(
        expect.objectContaining({ title: 'Post3' })
      );
      done();
    }).catch(done);
  });

  test('Post new post with missing fields (POST /posts) - 400 Bad Request', (done) => {
    axios.post('/posts', 
      { user_id: 34 }
    ).then(() => {
      done(new Error('Request should have failed due to missing field title'));
    }).catch((error) => {
      expect(error.response.status).toEqual(400);
      expect(error.response.data).toEqual("Missing required fields");
      done();
    }) 
  });

  test('Post new post with too long title (POST /posts) - 400 Bad Request', (done) => {
    axios.post('/posts', 
      { user_id: 31, title: 'a'.repeat(256), content: 'Valid content', image: 'image.jpg' }
    ).then(() => {
      done(new Error('Request should have failed due to overly long title'));
    }).catch((error) => {
      expect(error.response.status).toEqual(400);
      expect(error.response.data).toEqual('Title or content too long');
      done();
    });
  });  
});

describe('PostService DELETE Tests', () => {
  test('Delete post (DELETE /posts/:post_id) - 200 OK', (done) => {
    axios.delete('/posts/32').then((response) => {
      expect(response.status).toEqual(200);
      done();
    }).catch(done);
  })

  test('Delete non-existing post (DELETE /posts/:post_id) - 404 Not Found', (done) => {
    axios.delete('/posts/999').then(() => {
      done(new Error('Request should have failed due to non-existing id'));
    }).catch((error) => {
      expect(error.response.status).toEqual(404);
      expect(error.response.data).toEqual('Post not found');
      done();
    });
  });

  test('Delete post with invalid ID (DELETE /posts/:post_id) - 400 Bad Request', (done) => {
    axios.delete('/posts/invalid-id').then(() => {
        done(new Error('Request should have failed due to invalid ID'));
      }).catch((error) => {
        expect(error.response.status).toEqual(400);
        expect(error.response.data).toEqual('Invalid post ID');
        done();
      });
  });
  
});

describe('PostService PUT Tests', () => {
  test('Update post (PUT /posts/:post_id) - 200 OK', (done) => {
    axios.put('/posts/31', 
      { title: 'Updated title', content: 'Updated content', image: 'updated.img'}
    ).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual("Post updated successfully")
      return axios.get('/posts/31');
    })
    .then((res) => {
      expect(res.data.toEqual(expect.objectContaining({ title: 'Updated title' })))
      done();
    })
    .catch(done);
  });

  test('Update post with no changes (PUT /posts/:post_id) - 400 Bad Request', (done) => {
    axios.put('/posts/31', {}).then(() => {
        done(new Error('Request should have failed due to no changes provided'));
      })
      .catch((error) => {
        expect(error.response.status).toEqual(400);
        expect(error.response.data).toEqual('No changes made');
        done();
      });
  });
});














































