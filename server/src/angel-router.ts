import express from 'express';
import seriesService, { Series } from "./services/series-service"
import angelService, { Angel } from "./services/angel-service" //legg til angellikes
import angelCommentService, { AngelComment } from "./services/angelcomment-service"
import postService, { Post, PostComment } from "./services/post-service" //legg til postlikes
import { AxiosPromise } from 'axios';

const router = express.Router();

// ANGELS
// get all angels
router.get('/angels', (_request, response) => {
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
    .catch((error) => response.status(500).send(error));
});

// post new angel
router.post('/angels', (request, response) => {
  const data = request.body;
  if (data && data.name && data.name.length != 0)
    angelService
      .createAngel(data.name, data.description, data.image, data.release_year, data.user_id, data.created_at, data.series_id)
      .then((angel_id) => response.send({ angel_id: angel_id }))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing angel name');
});

// delete spesific angel
router.delete('/angels/:angel_id', (request, response) => {
  angelService
    .deleteAngel(Number(request.params.angel_id))
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
});

//get angels etter series_id
router.get('/series/:series_id', (req, res) => {
  const series_id = req.params.series_id;
  angelService.getBySeries(Number(series_id))
      .then((angels) => res.send(angels))
      .catch((err) => res.status(500).send({ error: err.message }));
});


// edit spesific angel
router.put('/angels/:angel_id', (request, response) => {
  const angel_id = Number(request.params.angel_id)
  const angel: Angel = request.body;
  if (angel) {
    angelService
      .updateAngel(angel)
      .catch((error) => response.status(500).send(error));
  } else {
    response.status(400).send('Missing angel');
  }
});

//get username of user by angel
router.get('angels/:angel_id/username', (request, response) => {
  const angel_id = Number(request.params.angel_id)
  angelService.getUsername(angel_id)
    .then((username) => response.send(username))
    .catch((error) => response.status(500).send({ error: error.message}))
})

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
router.post('/angels/:angel_id/comments', (request, response) => {
  const angel_id = Number(request.params.angel_id);
  const { user_id, content, created_at } = request.body;
  if (angel_id && user_id && content) {
    angelCommentService
      .addAngelComment(angel_id, user_id, content, created_at)
      .then((angelcomment_id) => response.status(201).send({ angelcomment_id }))
      .catch((error) => response.status(500).send(error));
  } else {
    response.status(400).send('Missing angel ID, user ID or comment content');
  }
});

// get all comments on an angel
router.get('/angels/:angel_id/comments', (request, response) => {
  const angel_id = Number(request.params.angel_id);
  angelCommentService
    .getAngelComments(angel_id)
    .then((comments) => response.send(comments))
    .catch((error) => response.status(500).send(error));
});

// edit comment
// router.put('/angels/:angel_id/comments/:angelcomment_id', (request, response) => {
//   const angelcomment_id = Number(request.params.angelcomment_id);
//   const angelcomment: AngelComment = request.body;
//   if (angelcomment) {
//     angelCommentService
//       .updateAngelComment(angelcomment)
//       .then(() => response.send())
//       .catch((error) => response.status(500).send(error));
//   } else {
//     response.status(400).send('Missing angelcomment');
//   }
// })

// delete comment


// SERIES
// get all series 
 router.get("/series", (_request, response) => {
   seriesService
   .getAll()
   .then((seriesList) => {response.send(seriesList)})
   .catch((error) => {response.status(500).send(error)})
 });

// get spesific series
//router.get('/series/:name', (request, response) => {
//  const name = String(request.params.name);
//  seriesService
//    .get(name)
//    .then((series) => (series ? response.send(series) : response.status(404).send('Series not found')))
//    .catch((error) => response.status(500).send(error));
// });

//get name of series by id
router.get('/series/name/:id',(req, res) =>{
  seriesService.getName(Number(req.params.id))
    .then((name) => res.send(name))
    .catch((err) => res.status(500).send(err))
})


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
//eventuelle enderinger som skal gjøres i denne: console.log(data) --> for å finne hva som feiler

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

// søkefelt
router.get('/angels/search/:search', async (request, response) => {
  const searchTerm = request.params.search as string;

  if (!searchTerm) {
    return response.status(400).send("Query parameter 'q' is required.");
  }

  try {
    const results = await angelService.search(searchTerm); 
    response.send(results); 
  } catch (error) {
    console.error('Error fetching search results:', error);
    response.status(500).send("Error fetching search results"); 
  }
});
// søkefelt



export default router;