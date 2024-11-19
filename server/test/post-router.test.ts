import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import postService, { Post } from '../src/services/post-service';

axios.defaults.baseURL = 'http://localhost:3003';

const testPosts: Post[] = [
  {
    post_id: 1,
    user_id: 1,
    title: 'Post1',
    content: 'Hello',
    username: 'user1',
    image: 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/new_cameleon_01-1.jpg',
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    post_id: 2,
    user_id: 2,
    title: 'Post2',
    content: 'Hei',
    username: 'user2',
    image: 'https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/new_cow_01-1.jpg',
    created_at: new Date(),
    updated_at: new Date(),
  }
];

let webServer: any;
beforeAll((done) => {
    webServer = app.listen(3003, () => done());
});

beforeEach((done) => {
  pool.query('DELETE FROM Posts', (error) => {
    if (error) return done(error);
      postService
        .createPost(testPosts[0].user_id, testPosts[0].title, testPosts[0].content, testPosts[0].username, testPosts[0].image)
        .then(() => 
          postService.createPost(testPosts[1].user_id, testPosts[1].title, testPosts[1].content, testPosts[1].username, testPosts[1].image))
        .then(() => { done() })
        .catch(done);    
  });
});

// afterAll((done) => {
//   try {
//     if (webServer) {
//       new Promise<void>((resolve) => webServer.close(() => resolve()));
//     }
//     pool.end();
//     done();
//   } catch (error) {
//     done(error);
//   }
// });

afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => pool.end(() => done()));
});

describe('PostService Tests', () => {
  jest.setTimeout(60000);

  test('Fetch all posts (GET /posts) - 200 OK', (done) => {
    axios.get('/posts').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(expect.arrayContaining([
        expect.objectContaining({ title: 'Post1', content: 'Hello' })
      ]));
      done();
    }).catch(done)
  });

  test('Fetch single post by ID (GET /posts/:post_id) - 200 OK', (done) => {
    axios.get('/posts/1').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(expect.objectContaining({ title: 'Post1' }));
    })
  });

  test('Post new post (POST /posts) - 200 OK', async() => {
    const response = await axios.post('/posts', { user_id: 1, username: 'Bruker1', title: 'Tittel1', content: 'Innhold1', image: 'bilde.com/bilde.jpg' })

  })

});

postrouter.post('/posts', (req, res) => {
  const { user_id, username, title, content, image } = req.body;

  console.log('Request data:', req.body);

  if (!title || !user_id || !username) {
    return res.status(400).send('Missing required fields');
  }

  postService
    .createPost(user_id, username, title, content, image)
    .then((post_id) => res.status(201).send({ post_id }))
    .catch((error) => {
      console.error('Error creating post:', error.message);
      res.status(500).send('Error creating post');
    });
});

// Delete specific post
postrouter.delete('/posts/:post_id', (req, res) => {
  const post_id = Number(req.params.post_id);

  postService
    .deletePost(post_id)
    .then(() => res.status(200).send())
    .catch((error) => res.status(500).send(error));
});
  
 // Update specific post
 postrouter.put('/posts/:post_id', (req, res) => {
  const post_id = Number(req.params.post_id);
  const { title, content, image } = req.body;

  console.log('Incoming Data:', { post_id, title, content, image });


  postService
    .updatePost(post_id, title, content, image) // Remove updated_at
    .then(() => res.status(200).send('Post updated successfully'))
    .catch((err) => {
      console.error('Service Error:', err.message);
      res.status(500).send('Error updating post');
    });
});