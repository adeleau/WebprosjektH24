import express from 'express';
import userService from '../services/user-service';
import LikesService from '../services/likes-service';
import WishlistService from '../services/wishlist-service';

const userrouter = express.Router();

//Get user by ID
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
  
//Get all users
userrouter.get('/users', async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Server error');
    }
});
  
  
//Update user role (Admin/User)
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
  
  
//Update user details
userrouter.put('/users/:id', async (req, res) => {
    const user_id = parseInt(req.params.id, 10);
    const updatedData = req.body;

    try {
        //Map `password` to `password_hash` if provided
        if (updatedData.password) {
            updatedData.password_hash = updatedData.password; // Map to `password_hash`
            delete updatedData.password; // Remove plaintext `password` from payload
        }

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

//Get likes of a user by user ID
userrouter.get('/:userId/likes', async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    try {
        const likes = await LikesService.getUserLikes(userId);
        res.json(likes);
    } catch (error) {
        console.error('Error fetching user likes:', error);
        res.status(500).send('Server error');
    }
});

//Add a like for a user
userrouter.post('/:userId/likes', async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const { angelId } = req.body;  
    try {
        await LikesService.addLike(userId, angelId);  
        res.status(201).send('Like added');
    } catch (error) {
        console.error('Error adding like:', error);
        res.status(500).send('Server error');
    }
});

//Delete a like for a user
userrouter.delete('/:userId/likes', async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const { seriesId } = req.body;
    try {
        await LikesService.removeLike(userId, seriesId);
        res.status(200).send('Like deleted');
    } catch (error) {
        console.error('Error deleting like:', error);
        res.status(500).send('Server error');
    }
});


//Get wishlist of a user by user ID
userrouter.get('/:userId/wishlist', async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    try {
        const wishlist = await WishlistService.getUserWishlist(userId);
        res.json(wishlist);
    } catch (error) {
        console.error('Error fetching user wishlist:', error);
        res.status(500).send('Server error');
    }
});

//Add an item to a user's wishlist
userrouter.post('/:userId/wishlist', async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const { angelId } = req.body;  
    try {
        await WishlistService.addWishlistItem(userId, angelId);  
        res.status(201).send('Item added to wishlist');
    } catch (error) {
        console.error('Error adding item to wishlist:', error);
        res.status(500).send('Server error');
    }
});

//Delete an item from a user's wishlist
userrouter.delete('/:userId/wishlist', async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const { seriesId } = req.body;
    try {
        await WishlistService.removeWishlistItem(userId, seriesId);
        res.status(200).send('Item removed from wishlist');
    } catch (error) {
        console.error('Error removing item from wishlist:', error);
        res.status(500).send('Server error');
    }
});

export default userrouter;