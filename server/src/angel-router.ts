import express from 'express';
import seriesService, { Series } from "./services/series-service"
import angelService, { Angel } from "./services/angel-service" //legg til angellikes
import angelCommentService, { AngelComment } from "./services/angelcomment-service"
import postService, { Post, PostComment } from "./services/post-service" //legg til postlikes
import registerService from './services/register-service';
import { AxiosPromise } from 'axios';
import userService from './services/user-service';

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

//COMMENTS
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

//get all comments on angel
router.get('/angels/:angel_id/comments', (request, response) => {
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
router.put('/angels/:angel_id/comments/:angelcomment_id', (request, response) => {
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
router.delete('/angels/:angel_id/comments/:angelcomment_id', (request, response) => {
  const angelcomment_id = Number(request.params.angelcomment_id);

  if (isNaN(angelcomment_id)) {
    return response.status(400).send('Invalid comment ID');
  }

  angelCommentService
    .deleteAngelComment(angelcomment_id)
    .then(() => response.status(200).send('Comment deleted successfully'))
    .catch((error) => response.status(500).json({ error: error.message }));
});

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


// USERS 

// Get user by ID
router.get('/users/:id', async (req, res) => {
  const user_id = parseInt(req.params.id, 10);
  try {
      const user = await userService.getById(user_id);
      if (user) {
          res.json(user);
      } else {
          res.status(404).send('User not found');
      }
  } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).send('Server error');
  }
});

router.get('/users/uname/:username', async (req, res) => {
  const username = req.params.username;
  try {
      const user = await userService.getByUsername(username);
      if (user) {
          res.json(user);
      } else {
          res.status(404).send('User not found');
      }
  } catch (error) {
      res.status(500).send("Shits fucked");
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
      const users = await userService.getAllUsers();
      res.json(users);
  } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).send('Server error');
  }
});


// Update user role (Admin/User)
router.put('/users/:id/role', async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const { role } = req.body; // Expect { role: "admin" or "user" }

  if (role !== 'admin' && role !== 'user') {
      return res.status(400).send('Invalid role');
  }

  try {
      await userService.updateUser(userId, { role });
      res.send(`User role updated to ${role}`);
  } catch (error) {
      console.error('Error updating user role:', error);
      res.status(500).send('Server error');
  }
});


// Update user details
router.put('/users/:id', async (req, res) => {
  const user_id = parseInt(req.params.id, 10);
  const updatedData = req.body;

  try {
      await userService.updateUser(user_id, updatedData);
      res.send('User updated successfully');
  } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).send('Server error');
  }
});

//Check if user is logged in
router.post("/users/login", async (req, res) => {
    const userData = req.body;
    userService.login(userData)
      .then((userExists) => {if (userExists){
        res.send(true);
      }
      else {
        res.send(false);
      }
      })
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
  const searchTerm = request.params.search;

  try {
      const results = await angelService.search(searchTerm); 
      response.send(results); 
  } catch (error) {
      console.error('Error fetching search results:', error);
      response.status(500).send("Error fetching search results"); 
  }
});
// søkefelt

//Registrering
// get all users
router.get('/user', (_request, response) =>{
  registerService
    .getAllUsers()
    .then((userList) =>  response.send(userList))
    .catch((error) => response.status(500).send(error));
});

// get a user
router.get('/user/:user_id', (_request, response) =>{
  const user_id = Number(_request.params.user_id);
  registerService
    .getUserById(user_id)
    .then((user_id) =>  response.send(user_id))
    .catch((error) => response.status(500).send(error));
});


router.post('/register', (request,response) =>{
  const {username, email, password_hash} = request.body;

  if ( username && email && password_hash) {
    registerService
      .registerUser(username, email, password_hash)
      .then((userId) => { response.status(201).send({ user_id: userId });
    })
    .catch((error) => {
      console.error('Error during registration:', error);
      response.status(500).send('Error during registration');
    });
} else {
  response.status(400).send('Missing username, email, or password hash');
}
});

//sjekker om brukeren allerede eksisterer
router.get('/check/user', (request, response) => {
  const {username, email} = request.query;

  if (username && email) {
    registerService
      .checkUserExists(String(username), String(email))
      .then((exists) => {
        if (exists){
          response.send('User exists');
        }else{
          response.send('User does not exist');
        }
      })
      .catch((error) => {
        console.error('Error checking user existens:', error);
        response.status(500).send('Error checking user existense');
      });
  }else{
    response.status(400).send('username or email are required');
  }
});

export default router;