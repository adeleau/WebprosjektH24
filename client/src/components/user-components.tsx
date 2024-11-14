// user-settings.tsx
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import userService, { User } from '../services/user-service';


export const UserProfile: React.FC = () => {
    const userId = 1;
    const history = useHistory();
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const userId = 1; // Assume logged-in user's ID is 1 for testing
        userService.getById(userId)
            .then(setUser)
            .catch(err => setError('Error fetching user profile: ' + err.message));
    }, []);

    if (error) return <p>{error}</p>;
    if (!user) return <p>Loading...</p>;

    const handleEditClick = () => {
        history.push('/userprofile/edit'); // Route to edit page
    };

    const handleLikesClick = () => {
        history.push('/user-likes'); // Route to likes page
    };

    return (
        <div className="user-profile">
            <h2>{user.username}'s Profile</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Bio:</strong> {user.bio || "No bio provided"}</p>
            <img   src={user.profile_picture || "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg"} 
                   alt="User Profile" 
                     className="user-profile-image" 
            />

            <div className="profile-actions">
                <button onClick={handleEditClick}>Edit Profile</button>
                <button onClick={handleLikesClick}>View Likes</button>
            </div>
        </div>
    );
};



export const UserSettings: React.FC = () => {
    const userId = 1; // Hardcoded user_id for testing
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<User>>({});
    const [users, setUsers] = useState<User[]>([]); // To store all users
    const [isAdmin, setIsAdmin] = useState(false); // Check if logged-in user is admin

    useEffect(() => {
        userService.getById(userId)
            .then(setUser)
            .catch(err => setError('Error fetching user: ' + err.message));

        // Check if the user is an admin
        userService.getById(userId).then(user => {
            if (user && user.role === 'admin') {
                setIsAdmin(true);
            }
        });

        // Fetch all users if the logged-in user is an admin
        if (isAdmin) {
            userService.getAllUsers()
                .then(setUsers)
                .catch(err => setError('Error fetching users: ' + err.message));
        }
    }, [userId, isAdmin]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        userService.update(userId, formData)
            .then(() => alert('User updated successfully'))
            .catch(err => setError('Error updating user: ' + err.message));
    };

    const handleRoleChange = (userId: number, newRole: string) => {
        userService.update(userId, { role: newRole })
            .then(() => {
                setUsers(users.map(user => user.user_id === userId ? { ...user, role: newRole } : user));
                alert('User role updated successfully');
            })
            .catch(err => setError('Error updating role: ' + err.message));
    };

    if (error) return <p>{error}</p>;
    if (!user) return <p>Loading...</p>;

    return (
        <div className="user-settings">
            <h2>User Settings</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input
                        type="text"
                        name="username"
                        defaultValue={user.username}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        defaultValue={user.email}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Bio:
                    <input
                        type="text"
                        name="bio"
                        defaultValue={user.bio}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        defaultValue={user.password_hash}
                        onChange={handleChange}
                    />
                </label>
                <button type="submit">Save Changes</button>
            </form>

            {isAdmin && (
                <div className="user-overview">
                    <h3>All Users</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Change Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.user_id}>
                                    <td>{u.username}</td>
                                    <td>{u.email}</td>
                                    <td>{u.role}</td>
                                    <td>
                                        <button onClick={() => handleRoleChange(u.user_id, u.role === 'admin' ? 'user' : 'admin')}>
                                            {u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

