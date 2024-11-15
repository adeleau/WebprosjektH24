// user-settings.tsx
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import userService, { User } from '../services/user-service';
import Cookies from 'js-cookie';


export const UserProfile: React.FC = () => {
    const history = useHistory();
    const [user, setUser] = useState<User>();
    const [error, setError] = useState<string>();

    useEffect(() => { 
        const user = Cookies.get("user");
        if (user) {
            setUser(JSON.parse(user) as User)
        }
    }, []);

    if (error) return <p>{error}</p>;
    if (!user) return <p>Loading...</p>;

    const handleEditClick = () => {
        history.push('/userprofile/edit'); 
    };

    const handleLogout = () => {
        setUser(undefined); 
        Cookies.set("user", "0", { domain: "localhost" });
      };


      return (
        <div className="profile-container">
            <div className="action-buttons">
                <button onClick={handleEditClick}>Edit Profile</button>
                <button onClick={() => history.push("/")}>Go Back to Homepage</button>
            </div>
    
            <div className="user-profile">
                <div className="profile-header">
                    <h2>{user.username}</h2>
                    <img
                        src={user.profile_picture || "https://wallpapers-clan.com/wp-content/uploads/2024/10/sonny-angel-pfp-02.jpg"}
                        alt="User Profile"
                        className="user-profile-image"
                    />
                </div>
    
                <div className="profile-divider"></div>
    
                <div className="profile-info">
                    <p><strong>Bio:</strong> {user.bio || "No bio provided"}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                </div>
    
                <div className="profile-sections">
                    <button className="profile-section-button">My Likes</button>
                    <button className="profile-section-button">My Wishlist</button>
                    <button className="profile-section-button">My Contributions</button>
                </div>
    
                <div className="logout-button">
                    <button onClick={() => { handleLogout(); history.push("/"); }}>Logout</button>
                </div>
            </div>
        </div>
    );
    
};    


export const UserSettings: React.FC = () => {

    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<User>>({});
    const [users, setUsers] = useState<User[]>([]); // To store all users
    const [isAdmin, setIsAdmin] = useState(false); // Check if logged-in user is admin

    useEffect(() => {
        const tempUser = Cookies.get("user");
        if (tempUser) {
            setUser(JSON.parse(tempUser));
            setIsAdmin(JSON.parse(tempUser).role === "admin");
        }

        if (isAdmin) {
            userService.getAllUsers()
                .then(setUsers)
                .catch(err => setError('Error fetching users: ' + err.message));
        }
    }, [isAdmin]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        console.log(formData);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(user) {
            userService.update(user.user_id, formData)
                .then(() => alert('User updated successfully'))
                .catch(err => setError('Error updating user: ' + err.message));
        }
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

