import express from 'express';
import services from './angel-service';
const { angelService, postService } = services; 

/**
 * Express router containing angel methods.
 */
const router = express.Router();

router.get('/angels', (_request, response) => {
  angelService
    .getAll()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

router.get('/angels/:angel_id', (request, response) => {
  const angel_id = Number(request.params.angel_id);
  angelService
    .get(angel_id)
    .then((angel) => (angel ? response.send(angel) : response.status(404).send('Angel not found')))
    .catch((error) => response.status(500).send(error));
});

router.get('/posts', (_request, response) => {
  postService
    .getAll()
    .then((rows) => response.send(rows))
    .catch((error) => response.status(500).send(error));
});

router.get('/posts/:post_id', (request, response) => {
  const post_id = Number(request.params.post_id);
  postService
    .get(post_id)
    .then((post) => (post ? response.send(post) : response.status(404).send('Post not found')))
    .catch((error) => response.status(500).send(error));
});

// Example request body: { title: "Ny oppgave" }
// Example response body: { id: 4 }
router.post('/posts', (request, response) => {
  const data = request.body;
  if (data && data.title && data.title.length != 0)
    postService
      .create(data.title, data.content, data.img)
      .then((post_id) => response.send({ post_id: post_id }))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing post title');
});

router.delete('/posts/:post_id', (request, response) => {
  postService
    .deletePost(Number(request.params.post_id))
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
});

router.put('/posts/:post_id', (request, response) => {
  const { title, content, img } = request.body;
  if (title && content) {
    postService
      .updatePost(Number(request.params.post_id), title, content, img)
      .then(() => response.send())
      .catch((error) => response.status(500).send(error));
  } else {
    response.status(400).send('Missing angel title or content');
  }
});

export default router;