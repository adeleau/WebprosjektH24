import express from 'express';
import seriesService, { Series } from "../services/series-service"
import angelService, { Angel } from "../services/angel-service" //legg til angellikes
import angelCommentService, { AngelComment } from "../services/angelcomment-service"
import postService, { Post, PostComment } from "../services/post-service" //legg til postlikes
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
  postService
    .get(post_id)
    .then((post) => (post ? res.send(post) : res.status(404).send('Post not found')))
    .catch((error) => res.status(500).send(error));
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
  const { title, content, image, updated_at } = req.body;

  console.log('Update Request Data:', req.body); // Log the incoming data

  if (!title) {
    return res.status(400).send('Missing post title');
  }

  postService
    .updatePost(post_id, title, content, image, updated_at)
    .then(() => res.status(200).send())
    .catch((error) => {
      console.error('Error updating post:', error.message);
      res.status(500).send('Error updating post');
    });
});

  
  // LIKES
  // like spesific post
  // router.post('/posts/:post_id/likes', (request, response) => {
  //   const post_id = Number(request.params.post_id);
  //   if (post_id) {
  //     postService
  //       .likePost(post_id)
  //       .then(() => response.status(201).send('Post liked successfully'))
  //       .catch((error) => response.status(500).send(error));
  //   } else {
  //     response.status(400).send('Invalid post ID');
  //   }
  // });
  
  // get the likes of a post
  // router.get('/posts/:post_id/likes', (request, response) => {
  //   const post_id = Number(request.params.post_id);
  
  //   postService
  //     .getPosLikes(post_id)
  //     .then((posLikeCount) => response.json({ post_id: post_id, like_count: posLikeCount }))
  //     .catch((error) => response.status(500).send(error));
  // });
  
  // COMMENTS
  // add a comment on a post
  postrouter.post('/posts/:post_id/comments', (request, response) => {
    const post_id = Number(request.params.post_id);
    const { user_id, content, created_at } = request.body;
  
    if (user_id && content) {
      postService
        .addPostComment(post_id, user_id, content, created_at)
        .then((comment_id) => response.status(201).send({ comment_id }))
        .catch((error) => response.status(500).send(error));
    } else {
      response.status(400).send('Missing user ID or comment content');
    }
  });
  
  // get all comments on a post
  postrouter.get('/posts/:post_id/comments', (request, response) => {
    const post_id = Number(request.params.post_id);
  
    postService
      .getPostComments(post_id)
      .then((comments) => response.send(comments))
      .catch((error) => response.status(500).send(error));
  });


export default postrouter;