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
    username: 'User1'
  },
  {
    post_id: 22,
    user_id: 32,
    title: 'Post2',
    content: 'Hei',
    image: 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/new_cow_01-1.jpg',
    created_at: new Date(),
    updated_at: new Date(),
    username:'User2'
  }
];

let webServer: any;
beforeAll((done) => {
    webServer = app.listen(3003, () => done());
});

beforeEach((done) => {
  pool.query('SET FOREIGN_KEY_CHECKS = 0', (error) => {
    if (error) return done(error);

    pool.query('DELETE FROM Posts', (error) => {
      if (error) return done(error);

        pool.query('SET FOREIGN_KEY_CHECKS = 1', (error) => {
          if (error) return done(error);

          // Insert test data sequentially
          postService
            .createPost(testPosts[0].user_id, testPosts[0].title, testPosts[0].content, testPosts[0].image)
            .then(() => postService.createPost(testPosts[1].user_id, testPosts[1].title, testPosts[1].content, testPosts[1].image))
            .then(() => done())
            .catch((error) => {
              done(error);
            });  
        });
    });
  })

  //   pool.query('DELETE FROM Posts', (error) => {
  //     if (error) return done(error);

  //       pool.query('SET FOREIGN_KEY_CHECKS = 1', (error) => {
  //         if (error) return done(error);

  //         // Insert test data sequentially
  //         postService
  //           .createPost(testPosts[0].user_id, testPosts[0].title, testPosts[0].content, testPosts[0].image)
  //           .then(() => postService.createPost(testPosts[1].user_id, testPosts[1].title, testPosts[1].content, testPosts[1].image))
  //           .then(() => done())
  //           .catch((error) => {
  //             done(error);
  //           });  
  //       });
  //   });
  // });
});

afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => pool.end(() => done()));
});

jest.setTimeout(10000);

describe('PostService GET Tests', () => {
  test('Get all posts (GET /posts) - 200 OK', (done) => {
    axios.get('/posts').then((response) => {
      // console.log('Response data:', response.data);
      // console.log('Response status:', response.status);
      // console.log('Response data:', response.data);
      // console.log('Response status:', response.status);
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(expect.arrayContaining([expect.objectContaining({ user_id: 31, title: 'Post1' })]));
      done();
    }).catch(done);
  });

  test('Get all posts (empty table) when no posts exist (GET /posts) - 200 OK', (done) => {
    pool.query('DELETE FROM Posts', (error) => {
      if (error) return done(error);
      axios.get('/posts').then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual([]);
        done();
      }).catch(done);
    });
  });

  test('Get all posts (GET /posts) - 500 Internal Server Error', (done) => {
    jest.spyOn(postService, 'getAll').mockRejectedValueOnce(new Error('Database error'));
    axios.get('/posts').then(() => {
        done(new Error('Request should have failed with a 500 error'));
    })
    .catch((error) => {
      expect(error.response.status).toEqual(500);
      expect(error.response.data).toEqual('Database error');
     // expect(response.data).toEqual(expect.arrayContaining([expect.objectContaining({ user_id: 31, title: 'Post1' })]));
      done();
    }).catch(done);
  });

  test('Get all posts (empty table) when no posts exist (GET /posts) - 200 OK', (done) => {
    pool.query('DELETE FROM Posts', (error) => {
      if (error) return done(error);
      axios.get('/posts').then((response) => {
        expect(response.status).toEqual(200);
        expect(response.data).toEqual([]);
        done();
      }).catch(done);
    });
  });

  test('Get all posts (GET /posts) - 500 Internal Server Error', (done) => {
    jest.spyOn(postService, 'getAll').mockRejectedValueOnce(new Error('Database error'));
    axios.get('/posts').then(() => {
        done(new Error('Request should have failed with a 500 error'));
    })
    .catch((error) => {
      expect(error.response.status).toEqual(500);
      expect(error.response.data).toEqual('Database error');
      done();
    });
  });

  // test('Fetch post by ID (GET /posts/:post_id) - 200 OK', (done) => {
  //   axios.get('/posts/32').then((response) => {
  test('Fetch post by ID (GET /posts/:post_id) - 200 OK', (done) => {
    axios.get('/posts/32').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(expect.objectContaining({ title: 'Post2', content: 'Hei' }));
      done();
    }).catch(done);
    //   expect(response.data).toEqual(expect.objectContaining({ title: 'Post2', content: 'Hei' }));
    //   done();
    // }).catch(done);
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

  test('Get post with ID (GET /posts/:post_id) - 500 Internal Server Error', (done) => {
    jest.spyOn(postService, 'get').mockRejectedValueOnce(new Error('Database error'));
    axios.get('/posts/21').then(() => {
      done(new Error('Request should have failed with a 500 error'));
    })
    .catch((error) => {
      expect(error.response.status).toEqual(500);
      expect(error.response.data).toEqual('Database error');
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

  test('Create post (POST /posts) - 500 Internal Server Error', (done) => {
    jest.spyOn(postService, 'createPost').mockRejectedValueOnce(new Error('Database error'));
    axios.post('/posts', {
      user_id: 31, title: 'Post4', content: 'Heisann', image: 'test.img',
    })
      .then(() => {
        done(new Error('Request should have failed with a 500 error'));
      })
      .catch((error) => {
        expect(error.response.status).toEqual(500);
        expect(error.response.data).toEqual('Error creating post');
        done();
      });
  });
});

describe('PostService DELETE Tests', () => {
  test('Delete post (DELETE /posts/:post_id) - 200 OK', (done) => {
    axios.delete('/posts/22').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual('Post deleted successfully');
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
  
  test('Delete post (DELETE /posts/:post_id) - 500 Internal Server Error on get', (done) => {
    jest.spyOn(postService, 'get').mockRejectedValueOnce(new Error('Database error'));
    axios.delete('/posts/21').then(() => {
      done(new Error('Request should have failed with a 500 error'));
    })
      .catch((error) => {
        expect(error.response.status).toEqual(500);
        expect(error.response.data).toEqual('Error finding post');
        done();
      });
  });

  test('Delete post (DELETE /posts/:post_id) - 500 Internal Server Error on deletePost', (done) => {
    jest.spyOn(postService, 'get').mockResolvedValueOnce({
      post_id: 21, user_id: 31, username: 'User1', title: 'Post1', content: 'Hello', image: 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/new_cameleon_01-1.jpg', created_at: new Date(), updated_at: new Date()
    });
    jest.spyOn(postService, 'deletePost').mockRejectedValueOnce(new Error('Database error'));

    axios.delete('/posts/21').then(() => {
        done(new Error('Request should have failed with a 500 error'));
    })
      .catch((error) => {
        expect(error.response.status).toEqual(500);
        expect(error.response.data).toEqual('Error deleting post: Error: Database error');
        done();
      });
  });
});

describe('PostService PUT Tests', () => {
  test('Update post (PUT /posts/:post_id) - 200 OK', (done) => {
    axios.put('/posts/21', 
      { title: 'Updated title', content: 'Updated content', image: 'updated.img'}
    ).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual("Post updated successfully")
      return axios.get('/posts/21');
    })
    .then((res) => {
      expect(res.data.toEqual(expect.objectContaining({ title: 'Updated title' })))
      done();
    })
    .catch(done);
  });

  test('Update post with no changes (PUT /posts/:post_id) - 400 Bad Request', (done) => {
    axios.put('/posts/21', {}).then(() => {
        done(new Error('Request should have failed due to no changes provided'));
      })
      .catch((error) => {
        expect(error.response.status).toEqual(400);
        expect(error.response.data).toEqual('No changes made');
        done();
      });
  });

  test('Update post that does not exist (PUT /posts/:post_id) - 404 Not Found', (done) => {
    axios.put('/posts/999', { title: 'Non-existent' }).then(() => {
      done(new Error('Request should have failed due to non-existing id'))
    })
    .catch((error) => {
      expect(error.response.status).toEqual(404);
      expect(error.response.data).toEqual('Post not found');
    });
  });

  test('Update post with invalid ID format (PUT /posts/:post_id) - 400 Bad Request', (done) => {
    axios.put('/posts/invalid-id', { title: 'Invalid ID' }).then(() => {
      done(new Error('Request should have failed due to invalid ID'))
    })
    .catch((error) => {
      expect(error.response.status).toEqual(400);
      expect(error.response.data).toEqual('Invalid post ID');
    })
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

  test('Get post with ID (GET /posts/:post_id) - 500 Internal Server Error', (done) => {
    jest.spyOn(postService, 'get').mockRejectedValueOnce(new Error('Database error'));
    axios.get('/posts/21').then(() => {
      done(new Error('Request should have failed with a 500 error'));
    })
    .catch((error) => {
      expect(error.response.status).toEqual(500);
      expect(error.response.data).toEqual('Database error');
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

  test('Create post (POST /posts) - 500 Internal Server Error', (done) => {
    jest.spyOn(postService, 'createPost').mockRejectedValueOnce(new Error('Database error'));
    axios.post('/posts', {
      user_id: 31, title: 'Post4', content: 'Heisann', image: 'test.img',
    })
      .then(() => {
        done(new Error('Request should have failed with a 500 error'));
      })
      .catch((error) => {
        expect(error.response.status).toEqual(500);
        expect(error.response.data).toEqual('Error creating post');
        done();
      });
  });
});

describe('PostService DELETE Tests', () => {
  test('Delete post (DELETE /posts/:post_id) - 200 OK', (done) => {
    axios.delete('/posts/22').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual('Post deleted successfully');
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
  
  test('Delete post (DELETE /posts/:post_id) - 500 Internal Server Error on get', (done) => {
    jest.spyOn(postService, 'get').mockRejectedValueOnce(new Error('Database error'));
    axios.delete('/posts/21').then(() => {
      done(new Error('Request should have failed with a 500 error'));
    })
      .catch((error) => {
        expect(error.response.status).toEqual(500);
        expect(error.response.data).toEqual('Error finding post');
        done();
      });
  });

  test('Delete post (DELETE /posts/:post_id) - 500 Internal Server Error on deletePost', (done) => {
    jest.spyOn(postService, 'get').mockResolvedValueOnce({
      post_id: 21, user_id: 31, username: 'User1', title: 'Post1', content: 'Hello', image: 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/new_cameleon_01-1.jpg', created_at: new Date(), updated_at: new Date()
    });
    jest.spyOn(postService, 'deletePost').mockRejectedValueOnce(new Error('Database error'));

    axios.delete('/posts/21').then(() => {
        done(new Error('Request should have failed with a 500 error'));
    })
      .catch((error) => {
        expect(error.response.status).toEqual(500);
        expect(error.response.data).toEqual('Error deleting post: Error: Database error');
        done();
      });
  });
});

describe('PostService PUT Tests', () => {
  test('Update post (PUT /posts/:post_id) - 200 OK', (done) => {
    axios.put('/posts/21', 
      { title: 'Updated title', content: 'Updated content', image: 'updated.img'}
    ).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual("Post updated successfully")
      return axios.get('/posts/21');
    })
    .then((res) => {
      expect(res.data.toEqual(expect.objectContaining({ title: 'Updated title' })))
      done();
    })
    .catch(done);
  });

  test('Update post with no changes (PUT /posts/:post_id) - 400 Bad Request', (done) => {
    axios.put('/posts/21', {}).then(() => {
        done(new Error('Request should have failed due to no changes provided'));
      })
      .catch((error) => {
        expect(error.response.status).toEqual(400);
        expect(error.response.data).toEqual('No changes made');
        done();
      });
  });

  test('Update post that does not exist (PUT /posts/:post_id) - 404 Not Found', (done) => {
    axios.put('/posts/999', { title: 'Non-existent' }).then(() => {
      done(new Error('Request should have failed due to non-existing id'))
    })
    .catch((error) => {
      expect(error.response.status).toEqual(404);
      expect(error.response.data).toEqual('Post not found');
    });
  });

  test('Update post with invalid ID format (PUT /posts/:post_id) - 400 Bad Request', (done) => {
    axios.put('/posts/invalid-id', { title: 'Invalid ID' }).then(() => {
      done(new Error('Request should have failed due to invalid ID'))
    })
    .catch((error) => {
      expect(error.response.status).toEqual(400);
      expect(error.response.data).toEqual('Invalid post ID');
      expect(error.response.status).toEqual(400);
      expect(error.response.data).toEqual('Invalid post ID');
    });
  });
  

  test('Update post (PUT /posts/:post_id) - 500 Internal Server Error on get', (done) => {
    jest.spyOn(postService, 'get').mockRejectedValueOnce(new Error('Database error'));

    axios.put('/posts/21', { title: 'Updated title' })
      .then(() => {
        done(new Error('Request should have failed with a 500 error'));
      })
      .catch((error) => {
        expect(error.response.status).toEqual(500);
        expect(error.response.data).toEqual('Error finding post');
        done();
      });
  });

  test('Update post (PUT /posts/:post_id) - 500 Internal Server Error on updatePost', (done) => {
    jest.spyOn(postService, 'get').mockResolvedValueOnce({
      post_id: 21, user_id: 31, username: 'User1', title: 'Post1', content: 'Hello', image: 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/new_cameleon_01-1.jpg', created_at: new Date(), updated_at: new Date()
    });
    jest.spyOn(postService, 'updatePost').mockRejectedValueOnce(new Error('Database error'));

    axios.put('/posts/21', { title: 'Updated title' })
      .then(() => {
        done(new Error('Request should have failed with a 500 error'));
      })
      .catch((error) => {
        expect(error.response.status).toEqual(500);
        expect(error.response.data).toEqual('Error updating post');
        done();
      });
  });
});

// import express from 'express';
// import axios from 'axios';
// import postrouter from '../src/routers/post-router';
// import { Request, Response } from 'express';

// jest.mock('axios'); // Mock axios

// describe('PostRouter and Mocked Axios Tests', () => {
//   let req: Partial<Request>;
//   let res: Partial<Response>;
//   let next: jest.Mock;

//   beforeEach(() => {
//     req = {};
//     res = {
//       json: jest.fn(),
//       status: jest.fn().mockReturnThis(),
//       send: jest.fn(),
//     };
//     next = jest.fn();
//     jest.clearAllMocks();
//   });

//   describe('GET /posts', () => {
//     test('should return all posts', async () => {
//       const mockPosts = [
//         {
//           post_id: 1,
//           user_id: 1,
//           title: 'Test Post',
//           username: 'User1',
//           content: 'Test content',
//           image: 'https://example.com/image.jpg',
//           created_at: new Date(),
//           updated_at: new Date(),
//         },
//       ];

//       (axios.get as jest.Mock).mockResolvedValue({ data: mockPosts });

//       req.method = 'GET';
//       req.url = '/posts';

//       const router = express.Router();
//       router.use(postrouter);
//       await router(req as Request, res as Response, next);

//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith(mockPosts);
//     });

//     test('should handle errors when fetching all posts', async () => {
//       (axios.get as jest.Mock).mockRejectedValue(new Error('Database error'));

//       req.method = 'GET';
//       req.url = '/posts';

//       const router = express.Router();
//       router.use(postrouter);
//       await router(req as Request, res as Response, next);

//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.send).toHaveBeenCalledWith('Error fetching posts: Database error');
//     });
//   });

//   describe('GET /posts/:post_id', () => {
//     test('should return a specific post by ID', async () => {
//       const mockPost = {
//         post_id: 1,
//         user_id: 1,
//         title: 'Test Post',
//         username: 'User1',
//         content: 'Test content',
//         image: 'https://example.com/image.jpg',
//         created_at: new Date(),
//         updated_at: new Date(),
//       };

//       (axios.get as jest.Mock).mockResolvedValue({ data: mockPost });

//       req.method = 'GET';
//       req.url = '/posts/1';
//       req.params = { post_id: '1' };

//       const router = express.Router();
//       router.use(postrouter);
//       await router(req as Request, res as Response, next);

//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith(mockPost);
//     });

//     test('should return 404 if the post is not found', async () => {
//       (axios.get as jest.Mock).mockResolvedValue({ data: null });

//       req.method = 'GET';
//       req.url = '/posts/999';
//       req.params = { post_id: '999' };

//       const router = express.Router();
//       router.use(postrouter);
//       await router(req as Request, res as Response, next);

//       expect(res.status).toHaveBeenCalledWith(404);
//       expect(res.send).toHaveBeenCalledWith('Post not found');
//     });

//     test('should handle errors when fetching a specific post', async () => {
//       (axios.get as jest.Mock).mockRejectedValue(new Error('Database error'));

//       req.method = 'GET';
//       req.url = '/posts/1';
//       req.params = { post_id: '1' };

//       const router = express.Router();
//       router.use(postrouter);
//       await router(req as Request, res as Response, next);

//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.send).toHaveBeenCalledWith('Error fetching post: Database error');
//     });
//   });

//   describe('POST /posts', () => {
//     test('should create a new post', async () => {
//       (axios.post as jest.Mock).mockResolvedValue({ data: { post_id: 1 } });

//       req.method = 'POST';
//       req.url = '/posts';
//       req.body = {
//         user_id: 1,
//         username: 'User1',
//         title: 'New Post',
//         content: 'This is a new post',
//         image: 'https://example.com/image.jpg',
//       };

//       const router = express.Router();
//       router.use(postrouter);
//       await router(req as Request, res as Response, next);

//       expect(res.status).toHaveBeenCalledWith(201);
//       expect(res.json).toHaveBeenCalledWith({ post_id: 1 });
//     });

//     test('should return 400 if required fields are missing', async () => {
//       req.method = 'POST';
//       req.url = '/posts';
//       req.body = { user_id: 1 };

//       const router = express.Router();
//       router.use(postrouter);
//       await router(req as Request, res as Response, next);

//       expect(res.status).toHaveBeenCalledWith(400);
//       expect(res.send).toHaveBeenCalledWith('Missing required fields');
//     });

//     test('should handle errors when creating a post', async () => {
//       (axios.post as jest.Mock).mockRejectedValue(new Error('Database error'));

//       req.method = 'POST';
//       req.url = '/posts';
//       req.body = {
//         user_id: 1,
//         username: 'User1',
//         title: 'New Post',
//         content: 'This is a new post',
//         image: 'https://example.com/image.jpg',
//       };

//       const router = express.Router();
//       router.use(postrouter);
//       await router(req as Request, res as Response, next);

//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.send).toHaveBeenCalledWith('Error creating post: Database error');
//     });
//   });
// });


// // import express from 'express';
// // import axios from 'axios';
// // import postrouter from '../src/routers/post-router';
// // import { Request, Response } from 'express';

// // jest.mock('axios'); // Mock axios

// // describe('PostRouter and Mocked Axios Tests Without Supertest', () => {
// //   let req: Partial<Request>;
// //   let res: Partial<Response>;
// //   let next: jest.Mock;

// //   beforeEach(() => {
// //     req = {};
// //     res = {
// //       json: jest.fn(),
// //       status: jest.fn().mockReturnThis(),
// //       send: jest.fn(),
// //     };
// //     next = jest.fn();
// //     jest.clearAllMocks();
// //   });

// //   describe('GET /posts', () => {
// //     test('should return all posts', async () => {
// //       const mockPosts = [
// //         {
// //           post_id: 1,
// //           user_id: 1,
// //           title: 'Test Post',
// //           username: 'User1',
// //           content: 'Test content',
// //           image: 'https://example.com/image.jpg',
// //           created_at: new Date(),
// //           updated_at: new Date(),
// //         },
// //       ];

// //       (axios.get as jest.Mock).mockResolvedValue({ data: mockPosts });

// //       req.method = 'GET';
// //       req.url = '/posts';

// //       const router = express.Router();
// //       router.use(postrouter);
// //       await router.handle(req as Request, res as Response, next);

// //       expect(res.status).toHaveBeenCalledWith(200);
// //       expect(res.json).toHaveBeenCalledWith(mockPosts);
// //     });

// //     test('should handle errors when fetching all posts', async () => {
// //       (axios.get as jest.Mock).mockRejectedValue(new Error('Database error'));

// //       req.method = 'GET';
// //       req.url = '/posts';

// //       const router = express.Router();
// //       router.use(postrouter);
// //       await router.handle(req as Request, res as Response, next);

// //       expect(res.status).toHaveBeenCalledWith(500);
// //       expect(res.send).toHaveBeenCalledWith('Error fetching posts: Database error');
// //     });
// //   });

// //   describe('GET /posts/:post_id', () => {
// //     test('should return a specific post by ID', async () => {
// //       const mockPost = {
// //         post_id: 1,
// //         user_id: 1,
// //         title: 'Test Post',
// //         username: 'User1',
// //         content: 'Test content',
// //         image: 'https://example.com/image.jpg',
// //         created_at: new Date(),
// //         updated_at: new Date(),
// //       };

// //       (axios.get as jest.Mock).mockResolvedValue({ data: mockPost });

// //       req.method = 'GET';
// //       req.url = '/posts/1';
// //       req.params = { post_id: '1' };

// //       const router = express.Router();
// //       router.use(postrouter);
// //       await router.handle(req as Request, res as Response, next);

// //       expect(res.status).toHaveBeenCalledWith(200);
// //       expect(res.json).toHaveBeenCalledWith(mockPost);
// //     });

// //     test('should return 404 if the post is not found', async () => {
// //       (axios.get as jest.Mock).mockResolvedValue({ data: null });

// //       req.method = 'GET';
// //       req.url = '/posts/999';
// //       req.params = { post_id: '999' };

// //       const router = express.Router();
// //       router.use(postrouter);
// //       await router.handle(req as Request, res as Response, next);

// //       expect(res.status).toHaveBeenCalledWith(404);
// //       expect(res.send).toHaveBeenCalledWith('Post not found');
// //     });

// //     test('should handle errors when fetching a specific post', async () => {
// //       (axios.get as jest.Mock).mockRejectedValue(new Error('Database error'));

// //       req.method = 'GET';
// //       req.url = '/posts/1';
// //       req.params = { post_id: '1' };

// //       const router = express.Router();
// //       router.use(postrouter);
// //       await router.handle(req as Request, res as Response, next);

// //       expect(res.status).toHaveBeenCalledWith(500);
// //       expect(res.send).toHaveBeenCalledWith('Error fetching post: Database error');
// //     });
// //   });

// //   describe('POST /posts', () => {
// //     test('should create a new post', async () => {
// //       (axios.post as jest.Mock).mockResolvedValue({ data: { post_id: 1 } });

// //       req.method = 'POST';
// //       req.url = '/posts';
// //       req.body = {
// //         user_id: 1,
// //         username: 'User1',
// //         title: 'New Post',
// //         content: 'This is a new post',
// //         image: 'https://example.com/image.jpg',
// //       };

// //       const router = express.Router();
// //       router.use(postrouter);
// //       await router.handle(req as Request, res as Response, next);

// //       expect(res.status).toHaveBeenCalledWith(201);
// //       expect(res.json).toHaveBeenCalledWith({ post_id: 1 });
// //     });

// //     test('should return 400 if required fields are missing', async () => {
// //       req.method = 'POST';
// //       req.url = '/posts';
// //       req.body = { user_id: 1 };

// //       const router = express.Router();
// //       router.use(postrouter);
// //       await router.handle(req as Request, res as Response, next);

// //       expect(res.status).toHaveBeenCalledWith(400);
// //       expect(res.send).toHaveBeenCalledWith('Missing required fields');
// //     });

// //     test('should handle errors when creating a post', async () => {
// //       (axios.post as jest.Mock).mockRejectedValue(new Error('Database error'));

// //       req.method = 'POST';
// //       req.url = '/posts';
// //       req.body = {
// //         user_id: 1,
// //         username: 'User1',
// //         title: 'New Post',
// //         content: 'This is a new post',
// //         image: 'https://example.com/image.jpg',
// //       };

// //       const router = express.Router();
// //       router.use(postrouter);
// //       await router.handle(req as Request, res as Response, next);

// //       expect(res.status).toHaveBeenCalledWith(500);
// //       expect(res.send).toHaveBeenCalledWith('Error creating post: Database error');
// //     });
// //   });
// // });
