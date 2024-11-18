import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import { Post, PostComment } from '../src/services/post-service';

const testPosts: Post[] = [ /* ... */ ];
const testComments: PostComment[] = [ /* ... */ ];

let webServer: any;

beforeAll((done) => {
  webServer = app.listen(0, () => {
    const { port } = webServer.address();
    axios.defaults.baseURL = `http://localhost:${port}`;
    done();
  });
}, 60000);

beforeEach(async (done) => {
  try {
    await pool.query(`
      DELETE FROM Post_comments;
      DELETE FROM Posts;
      INSERT INTO Posts (user_id, title, content, image, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?);
      INSERT INTO Post_comments (post_id, user_id, content, created_at)
      VALUES (?, ?, ?, ?);
    `, [
      ...testPosts.flatMap((post) => [post.user_id, post.title, post.content, post.image, post.created_at, post.updated_at]),
      ...testComments.flatMap((comment) => [comment.post_id, comment.user_id, comment.content, comment.created_at])
    ]);
    done();
  } catch (error) {
    done(error);
  }
}, 60000);

afterAll(async (done) => {
  try {
    if (webServer) {
      await new Promise<void>((resolve) => webServer.close(() => resolve()));
    }
    await pool.end();
    done();
  } catch (error) {
    done(error);
  }
});

describe('PostService Tests', () => {
  jest.setTimeout(60000);

  test('Fetch all posts (GET /posts) - 200 OK', async () => {
    const response = await axios.get('/posts');
    expect(response.status).toEqual(200);
    expect(response.data).toEqual(expect.arrayContaining([
      expect.objectContaining({ title: 'Test Post 1', content: 'This is a test post' })
    ]));
  });

  test('Fetch single post by ID (GET /posts/:post_id) - 200 OK', async () => {
    const response = await axios.get('/posts/1');
    expect(response.status).toEqual(200);
    expect(response.data).toEqual(expect.objectContaining({ title: 'Test Post 1' }));
  });

});
