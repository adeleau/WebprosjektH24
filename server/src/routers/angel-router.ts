import express from 'express';
import seriesService, { Series } from "../services/series-service"
import angelService, { Angel } from "../services/angel-service" //legg til angellikes
import angelCommentService, { AngelComment } from "../services/angelcomment-service"
import postService, { Post, PostComment } from "../services/post-service" //legg til postlikes
import registerService from '../services/register-service';
import { AxiosPromise } from 'axios';
import userService from '../services/user-service';

const angelrouter = express.Router();

// ANGELS
// get all angels
angelrouter.get('/angels', (_request, response) => {
  angelService
    .getAll()
    .then((angelList) => response.send(angelList))
    .catch((error) => response.status(500).send(error));
});

// get spesific angel
angelrouter.get('/angels/:angel_id', (request, response) => {
  const angel_id = Number(request.params.angel_id);
  angelService
    .get(angel_id)
    .then((angel) => (response.send(angel)))
    .catch((error) => response.status(500).send(error));
});

// post new angel
angelrouter.post('/angels', (request, response) => {
  const data = request.body;
  if (data && data.name && data.name.length != 0)
    angelService
      .createAngel(data)
      .then((angel_id) => response.send({ angel_id: angel_id }))
      .catch((error) => response.status(500).send(error));
  else response.status(400).send('Missing angel name');
});

// delete spesific angel
angelrouter.delete('/angels/:angel_id', (request, response) => {
  angelService
    .deleteAngel(Number(request.params.angel_id))
    .then((_result) => response.send())
    .catch((error) => response.status(500).send(error));
});

//get angels etter series_id
angelrouter.get('/series/:series_id', (req, res) => {
  const series_id = req.params.series_id;
  angelService.getBySeries(Number(series_id))
      .then((angels) => res.send(angels))
      .catch((err) => res.status(500).send({ error: err.message }));
});

// edit spesific angel
angelrouter.put('/angels/:angel_id', (request, response) => {
  const angel_id = Number(request.params.angel_id)
  const angel: Angel = request.body;
  if (angel) {
    angelService
      .updateAngel(angel)
      .then(() => response.status(200).send('Angel updated'))
      .catch((error) => response.status(500).send(error));
  } else {
    response.status(400).send('Missing angel');
  }
});

// Hent historikken til en spesifikk engel
angelrouter.get('/angels/:angel_id/history', (request, response) => {
  const angel_id = Number(request.params.angel_id);

  if (isNaN(angel_id)) {
    response.status(400).send('Invalid angel ID');
    return;
  }

  // Bruk angelService for å hente historikk
  angelService
    .getAngelHistory(angel_id)
    .then((history) => response.send(history))
    .catch((error) => response.status(500).send(error));
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

// COMMENTS
angelrouter.post('/angels/:angel_id/comments', (request, response) => {
  const angel_id = Number(request.params.angel_id);
  const { user_id, content, created_at } = request.body;
  if (angel_id && user_id && content) {
    angelCommentService
      .addAngelComment(angel_id, user_id, content)
      .then((angelcomment_id) => response.status(201).send({ angelcomment_id }))
      .catch((error) => response.status(500).send(error));
  } else {
    response.status(400).send('Missing angel ID, user ID or comment content');
  }
});

//get all comments on angel
angelrouter.get('/angels/:angel_id/comments', (request, response) => {
  const angel_id = Number(request.params.angel_id);
  if (isNaN(angel_id)) {
    return response.status(400).send('Invalid angel ID');
  }

  angelCommentService
    .getAngelComments(angel_id)
    .then((comments) => response.json(comments))
    .catch((error) => response.status(500).json({ error: error.message }));
});

//edit comment
/*router.put('/angels/:angel_id/comments/:angelcomment_id', (request, response) => {
   const angelcomment_id = Number(request.params.angelcomment_id);
   const angelcomment: AngelComment = request.body;
  if (angelcomment) {
     angelCommentService
      .updateAngelComment(angelcomment)
       .then(() => response.send())
      .catch((error) => response.status(500).send(error));
   } else {
     response.status(400).send('Missing angelcomment');
   }
})*/
angelrouter.put('/angels/:angel_id/comments/:angelcomment_id', (request, response) => {
  const angelcomment_id = Number(request.params.angelcomment_id);
  const { content } = request.body; // Only extract content from the request body

  if (!content) {
    return response.status(400).send('Missing comment content');
  }

  angelCommentService
    .updateAngelComment(angelcomment_id, content)
    .then(() => response.status(200).send('Comment updated successfully'))
    .catch((error) => response.status(500).json({ error: error.message }));
});

// delete comment
angelrouter.delete('/angels/:angel_id/comments/:angelcomment_id', (request, response) => {
  const angelcomment_id = Number(request.params.angelcomment_id);

  if (isNaN(angelcomment_id)) {
    return response.status(400).send('Invalid comment ID');
  }

  angelCommentService
    .deleteAngelComment(angelcomment_id)
    .then(() => response.status(200).send('Comment deleted successfully'))
    .catch((error) => response.status(500).json({ error: error.message }));
});

// SEARCHBAR
angelrouter.get('/angels/search/:search', async (request, response) => {
  const searchTerm = request.params.search;

  try {
      const results = await angelService.search(searchTerm); 
      response.send(results); 
  } catch (error) {
      console.error('Error fetching search results:', error);
      response.status(500).send("Error fetching search results"); 
  }
});

// CREATED/UPDATED AT
angelrouter.get('/angels/:angel_id/created_at', (request, response) => {
  console.log('Request received for angel_id:', request.params.angel_id);
  const angel_id = Number(request.params.angel_id)
  if (isNaN(angel_id)) {
    return response.status(400).send({ error: 'Invalid angel_id'})
  }
  angelService
    .getCreatedAt(angel_id)
    .then((created_at) => {
      console.log('Created at: ' + created_at);
      (response.send({created_at}))
    })
    .catch((error) => {
      console.error("her er feilen");
      response.status(500).send(error)
    });
})

angelrouter.get('/angels/:angel_id/updated_at', (request, response) => {
  const angel_id = Number(request.params.angel_id)
  angelService
    .getUpdatedAt(angel_id)
    .then((updated_at) => (response.send(updated_at)))
    .catch((error) => response.status(500).send(error));
})

 //get username of user by angel
 angelrouter.get('angels/:angel_id/username', (request, response) => {
  const angel_id = Number(request.params.angel_id)
  angelService.getUsername(angel_id)
    .then((username) => response.send(username))
    .catch((error) => response.status(500).send({ error: error.message}))
})


export default angelrouter;