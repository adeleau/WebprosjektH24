import express from 'express';
import seriesService, { Series } from "../services/series-service"
import angelService, { Angel } from "../services/angel-service" //legg til angellikes
import angelCommentService, { AngelComment } from "../services/angelcomment-service"
import postService, { Post } from "../services/post-service" //legg til postlikes
import registerService from '../services/register-service';
import { AxiosPromise } from 'axios';
import userService from '../services/user-service';

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
  if (isNaN(post_id)) {
    return res.status(400).send('Invalid post ID');
  }
  postService
    .get(post_id)
    .then((post) => (post ? res.send(post) : res.status(404).send('Post not found')))
    .catch((error) => res.status(500).send(error));
});
  
postrouter.post('/posts', (req, res) => {
  const { user_id, username, title, content, image } = req.body;

  if (!title || !user_id) {
    return res.status(400).send('Missing required fields');
  }

  if (title.length > 255 || content.length > 5000) {
    return res.status(400).send('Title or content too long');
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
  
  if(isNaN(post_id)) {
    return res.status(400).send('Invalid post ID');
  }

  postService
    .get(post_id)
    .then((post) => {
      if (!post) return res.status(404).send('Post not found');
      return postService
        .deletePost(post_id)
        .then(() => res.status(200).send('Post deleted successfully'))
        .catch((error) => res.status(500).send('Error deleting post: '+ error));
    })
    .catch((error) => {
      console.error('Error finding post: ', error.message);
      res.status(500).send('Error finding post');
    })
});
  
 // Update specific post
 postrouter.put('/posts/:post_id', (req, res) => {
  const post_id = Number(req.params.post_id);
  const { title, content, image } = req.body;

  if (isNaN(post_id)) {
    return res.status(400).send('Invalid post ID')
  }

  if (!title && !content && !image) {
    return res.status(400).send('No changes made');
  } 

  postService
    .get(post_id)
    .then((post) => {
      if (!post) return res.status(404).send('Post not found')
      return postService
        .updatePost(post_id, title, content, image)
        .then(() => res.status(200).send('Post updated successfully'))
        .catch((err) => {
        console.error('Service Error:', err.message);
        res.status(500).send('Error updating post');
        });
    })
    .catch((err) => {
      console.error('Error fetching post: ', err.message);
      res.status(500).send('Error finding post')
    })
});



export default postrouter;