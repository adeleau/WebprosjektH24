// user-service.ts
import axios from "axios";

export type User = {
    user_id: number;
    username: string;
    email: string;
    password_hash: string;
    created_at?: string;
    role?: string;
    bio?: string;
    profile_picture?: string;
};

class UserService {
  // Get all users
  getAllUsers() {
    return axios
        .get<User[]>('/users') 
        .then((response) => response.data)
        .catch((error) => {
            console.error('Error fetching users:', error);
            throw new Error('Could not fetch users');
        });
}

 // Fetch user by ID
 getById(userId: number) {
    return axios
        .get<User>(`users/${userId}`)
        .then((response) => response.data)
        .catch((error) => {
            console.error('Error fetching user:', error);
            throw new Error('Could not fetch user');
        });
    }

    getByUsername(username: string) {
        return axios.get<User>(`/users/uname/${username}`)
            .then(res => res.data)
            .catch((error) => {
                console.error('Error fetching user:', error);
                throw new Error('Could not fetch user');
            })
    }

    // Update user details
    update(userId: number, userData: Partial<User>) {
        return axios
            .put(`users/${userId}`, userData)
            .then(() => {
                console.log('User updated successfully');
            })
            .catch((error) => {
                console.error('Error updating user:', error);
                throw new Error('Could not update user');
            });
    }

    login(uname: string, passwd: string): Promise<boolean> {
        return axios.post("/users/login", { username: uname, password: passwd }).then((response) => response.data)
    }
}

export default new UserService();