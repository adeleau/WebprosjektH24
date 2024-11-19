import express from 'express';
import postService from "../services/post-service" 

const postrouter = express.Router();

// POSTS
// Get all posts
postrouter.get('/posts', (_req, res) => {
  postService
    .getAll()
    .then((posts) => res.send(posts))
    .catch((error) => res.status(500).send(error));
});
  
// Get specific post
postrouter.get('/posts/:post_id', (req, res) => {
  const post_id = Number(req.params.post_id);
  postService
    .get(post_id)
    .then((post) => (post ? res.send(post) : res.status(404).send('Post not found')))
    .catch((error) => res.status(500).send(error));
});
  
postrouter.post('/posts', (req, res) => {
  const { user_id, username, title, content, image } = req.body;

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

  postService
    .updatePost(post_id, title, content, image) 
    .then(() => res.status(200).send('Post updated successfully'))
    .catch((err) => {
      console.error('Service Error:', err.message);
      res.status(500).send('Error updating post');
    });
});

export default postrouter;