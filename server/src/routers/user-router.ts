import express from 'express';
import seriesService, { Series } from "../services/series-service"
import angelService, { Angel } from "../services/angel-service" //legg til angellikes
import angelCommentService, { AngelComment } from "../services/angelcomment-service"
import postService, { Post, PostComment } from "../services/post-service" //legg til postlikes
import registerService from '../services/register-service';
import { AxiosPromise } from 'axios';
import userService from '../services/user-service';

const userrouter = express.Router();

// USERS 

// Get user by ID
userrouter.get('/users/:id', async (req, res) => {
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
  
userrouter.get('/users/uname/:username', async (req, res) => {
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
userrouter.get('/users', async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Server error');
    }
});
  
  
// Update user role (Admin/User)
userrouter.put('/users/:id/role', async (req, res) => {
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
userrouter.put('/users/:id', async (req, res) => {
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
userrouter.post("/users/login", async (req, res) => {
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

  //get username of user by angel
userrouter.get('angels/:angel_id/username', (request, response) => {
    const angel_id = Number(request.params.angel_id)
    angelService.getUsername(angel_id)
      .then((username) => response.send(username))
      .catch((error) => response.status(500).send({ error: error.message}))
})

export default userrouter;