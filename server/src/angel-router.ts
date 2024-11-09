import express from 'express';
import seriesService, { Series } from "./services/series-service"
import angelService, { Angel, AngelComment } from "./services/angel-service" //legg til angellikes
import postService, { Post, PostComment } from "./services/post-service" //legg til postlikes

const router = express.Router();

// ANGELS
// get all angels
router.get('/series/:name/angels', (_request, response) => {
  angelService
    .getAll()
    .then((angelList) => response.send(angelList))
    .catch((error) => response.status(500).send(error));
});

// get spesific angel
router.get('/angels/:angel_id', (request, response) => {
  const angel_id = Number(request.params.angel_id);
  angelService
    .get(angel_id)
    .then((angel) => (response.send(angel)))
    .catch((error) => response.status(500).send("pooooop"));
});

// post new angel
router.post('/series/:name/angels', (request, response) => {
  const data = request.body;
  if (data && data.name && data.name.length != 0)
    angelService
      .createAngel(data.name, data.description, data.image, data.release_year, data.user_id, data.created_at, data.series_id)
      .then((angel_id) => response.send({ angel_id: angel_id }))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing angel name');
});

// delete spesific angel
router.delete('/series/:name/angels/:angel_id', (request, response) => {
  angelService
    .deleteAngel(Number(request.params.angel_id))
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
});

// edit spesific angel
router.put('/series/:name/angels/:angel_id', (request, response) => {
  const angel_id = Number(request.params.angel_id)
  const { name, description, image, release_year, updated_at, series_id } = request.body;
  if (name) {
    angelService
      .updateAngel(angel_id, name, description, image, release_year, updated_at, series_id)
      .then(() => response.send())
      .catch((error) => response.status(500).send(error));
  } else {
    response.status(400).send('Missing angel name');
  }
});

// like spesific angel
// router.post('/angels/:angel_id/likes', (request, response) => {
//   const angel_id = Number(request.params.angel_id);
//   if (angel_id) {
//     angelService
//       .likePost(angel_id)
//       .then(() => response.status(201).send('Post liked successfully'))
//       .catch((error) => response.status(500).send(error));
//   } else {
//     response.status(400).send('Invalid angel ID');
//   }
// });

// get the likes of a angel
// router.get('/angels/:angel_id/likes', (request, response) => {
//   const angel_id = Number(request.params.angel_id);

//   angelService
//     .getPosLikes(angel_id)
//     .then((posLikeCount) => response.json({ angel_id: angel_id, like_count: posLikeCount }))
//     .catch((error) => response.status(500).send(error));
// });

// add a comment on an angel
router.post('/series/:name/angels/:angel_id/comments', (request, response) => {
  const angel_id = Number(request.params.angel_id);
  const { user_id, content, created_at } = request.body;
  if (angel_id && user_id && content) {
    angelService
      .addAngelComment(angel_id, user_id, content, created_at)
      .then((angelcomment_id) => response.status(201).send({ angelcomment_id }))
      .catch((error) => response.status(500).send(error));
  } else {
    response.status(400).send('Missing angel ID, user ID or comment content');
  }
});

// get all comments on an angel
router.get('/series/:name/angels/:angel_id/comments', (request, response) => {
  const angel_id = Number(request.params.angel_id);
  angelService
    .getAngelComments(angel_id)
    .then((comments) => response.send(comments))
    .catch((error) => response.status(500).send(error));
});


// SERIES
// get all series (trengs denne?)
// router.get("/series", (_request, response) => {
//   seriesService
//   .getAll()
//   .then((seriesList) => {response.send(seriesList)})
//   .catch((error) => {response.status(500).send(error)})
// });

// get spesific series
router.get('/series/:name', (request, response) => {
  const name = String(request.params.name);
  seriesService
    .get(name)
    .then((series) => (series ? response.send(series) : response.status(404).send('Series not found')))
    .catch((error) => response.status(500).send(error));
});


// POSTS
// get all posts
router.get('/posts', (_request, response) => {
  postService
    .getAll()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

// get spesific post
router.get('/posts/:post_id', (request, response) => {
  const post_id = Number(request.params.post_id);
  postService
    .get(post_id)
    .then((post) => (post ? response.send(post) : response.status(404).send('Post not found')))
    .catch((error) => response.status(500).send(error));
});

// post new post
router.post('/posts', (request, response) => {
  const data = request.body;
  if (data && data.title && data.title.length != 0)
    postService
      .createPost(data.user_id, data.title, data.content, data.image, data.created_at)
      .then((post_id) => response.send({ post_id: post_id }))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing post title');
});

// delete spesific post
router.delete('/posts/:post_id', (request, response) => {
  postService
    .deletePost(Number(request.params.post_id))
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
});

// edit spesific post
router.put('/posts/:post_id', (request, response) => {
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

// add a comment on a post
router.post('/posts/:post_id/comments', (request, response) => {
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
router.get('/posts/:post_id/comments', (request, response) => {
  const post_id = Number(request.params.post_id);

  postService
    .getPostComments(post_id)
    .then((comments) => response.send(comments))
    .catch((error) => response.status(500).send(error));
});

export default router;