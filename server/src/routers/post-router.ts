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
// get all posts
postrouter.get('/posts', (_request, response) => {
    postService
      .getAll()
      .then((rows) => response.send(rows))
      .catch((error) => response.status(500).send(error));
  });
  
  // get spesific post
  postrouter.get('/posts/:post_id', (request, response) => {
    const post_id = Number(request.params.post_id);
    postService
      .get(post_id)
      .then((post) => (post ? response.send(post) : response.status(404).send('Post not found')))
      .catch((error) => response.status(500).send(error));
  });
  
  // post new post
  postrouter.post('/posts', (request, response) => {
    const data = request.body;
    if (data && data.title && data.title.length != 0)
      postService
        .createPost(data.user_id, data.title, data.content, data.image, data.created_at)
        .then((post_id) => response.send({ post_id: post_id }))
        .catch((error) => response.status(500).send(error));
    else response.status(400).send('Missing post title');
  });
  //eventuelle enderinger som skal gjøres i denne: console.log(data) --> for å finne hva som feiler
  
  // delete spesific post
  postrouter.delete('/posts/:post_id', (request, response) => {
    postService
      .deletePost(Number(request.params.post_id))
      .then((_result) => response.send())
      .catch((error) => response.status(500).send(error));
  });
  
  // edit spesific post
  postrouter.put('/posts/:post_id', (request, response) => {
    const post_id = Number(request.params.post_id);
    const { title, content, image, updated_at } = request.body;
    if (title) {
      postService
        .updatePost(post_id, title, content, image, updated_at)
        .then(() => response.send())
        .catch((error) => response.status(500).send(error));
    } else {
      response.status(400).send('Missing post title');
    }
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