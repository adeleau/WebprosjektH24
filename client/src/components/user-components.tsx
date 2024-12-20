// user-settings.tsx
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import userService, { User } from '../services/user-service';
import LikesService from '../services/likes-service';
import WishlistService from '../services/wishlist-service';
import angelService, { Angel } from '../services/angel-service';
import Cookies from 'js-cookie';

//for user-components we had to use cookies since we have administred roles
//ref src: 6,7
export const UserProfile: React.FC = () => {
    const history = useHistory();
    const [user, setUser] = useState<User>();
    const [likedAngels, setLikedAngels] = useState<Angel[]>([]);
    const [wishlistAngels, setWishlistAngels] = useState<Angel[]>([]);
    const [activeTab, setActiveTab] = useState<'collection' | 'wishlist'>('collection');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const user = Cookies.get("user");
        if (user) {
            setUser(JSON.parse(user) as User);

            const parsedUser = JSON.parse(user) as User;

            // Fetch liked angels for My Collection
            LikesService.getUserLikes(Number(parsedUser.user_id))
                .then(async (likes) => {
                    const angels = await Promise.all(
                        likes.map(async (like) => {
                            try {
                                return await angelService.get(like.angel_id);
                            } catch (error) {
                                console.error('Error fetching angel details:', error);
                                return null;
                            }
                        })
                    );
                    setLikedAngels(angels.filter((angel) => angel !== null) as Angel[]);
                })
                .catch((err) => setError('Error fetching liked angels: ' + err.message));

            // Fetch wishlist angels for My Wishlist
            WishlistService.getUserWishlist(Number(parsedUser.user_id))
                .then(async (wishlist) => {
                    const angels = await Promise.all(
                        wishlist.map(async (angel) => {
                            try {
                                return await angelService.get(angel.angel_id);
                            } catch (error) {
                                console.error('Error fetching wishlist angel details:', error);
                                return null;
                            }
                        })
                    );
                    setWishlistAngels(angels.filter((angel) => angel !== null) as Angel[]);
                })
                .catch((err) => setError('Error fetching wishlist: ' + err.message));
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

<div style={{ position: "relative" }}>
    <button className="home-button" onClick={() => history.push('/')}>
        Go to home
    </button>    
        <div className="series-page">
            {/* User Details Section */}
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
                <p><strong>My info:</strong></p>
                <p> {user.bio || "No bio provided"}</p>
                <p> {user.email}</p>
            </div>

            <div className="action-buttons">
                <button onClick={handleEditClick} className="btn-create-angel">Edit Profile</button>
                <button onClick={() => { handleLogout(); history.push("/"); }} className="btn-create-angel">Logout</button>
            </div>

           

            {/* Tabs for My Collection and My Wishlist */}
            <div className="profile-tabs">
                <button
                    className={`tab-button ${activeTab === 'collection' ? 'active' : ''}`}
                    onClick={() => setActiveTab('collection')}
                >
                    My Collection
                </button>
                <button
                    className={`tab-button ${activeTab === 'wishlist' ? 'active' : ''}`}
                    onClick={() => setActiveTab('wishlist')}
                >
                    My Wishlist
                </button>
            </div>

            {/* My Collection Section */}
            {activeTab === 'collection' && (
                <div className="angel-cards">
                    {likedAngels.length > 0 ? (
                        likedAngels.map((angel) => (
                            <div key={angel.angel_id} className="angel-card">
                                <a href={`/#/angels/${angel.angel_id}`} className="angel-card-link">
                                    <img
                                        src={angel.image || "https://placehold.co/150x150"}
                                        alt={angel.name}
                                        className="angel-card-image"
                                    />
                                    <h3 className="angel-card-name">{angel.name}</h3>
                                </a>
                            </div>
                        ))
                    ) : (
                        <p>Your collection is empty.</p>
                    )}
                </div>
            )}

            {/* My Wishlist Section */}
            {activeTab === 'wishlist' && (
                <div className="angel-cards">
                    {wishlistAngels.length > 0 ? (
                        wishlistAngels.map((angel) => (
                            <div key={angel.angel_id} className="angel-card">
                                <a href={`/#/angels/${angel.angel_id}`} className="angel-card-link">
                                    <img
                                        src={angel.image || "https://placehold.co/150x150"}
                                        alt={angel.name}
                                        className="angel-card-image"
                                    />
                                    <h3 className="angel-card-name">{angel.name}</h3>
                                </a>
                            </div>
                        ))
                    ) : (
                        <p>Your wishlist is empty.</p>
                    )}
                </div>
            )}
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
    const history = useHistory();

    useEffect(() => {
        const tempUser = Cookies.get("user");
        if (tempUser) {
            const parsedUser = JSON.parse(tempUser);
            setUser(parsedUser);
            setIsAdmin(parsedUser.role === "admin");
        }

        if (isAdmin) {
            userService
                .getAllUsers()
                .then(setUsers)
                .catch(err => setError("Error fetching users: " + err.message));
        }
    }, [isAdmin]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSaveAndLogout = (e: React.FormEvent) => {
        e.preventDefault();
        if (user) {
            userService
                .update(user.user_id, formData)
                .then(() => {
                    Cookies.remove("user"); // Clear the user cookie
                    setUser(null); // Clear user state
                    history.push("/login"); // Redirect to login page
                })
                .catch(err => setError("Error saving changes: " + err.message));
        }
    };

    const handleRoleChange = (userId: number, newRole: string) => {
        userService
            .update(userId, { role: newRole })
            .then(() => {
                setUsers(
                    users.map(user =>
                        user.user_id === userId ? { ...user, role: newRole } : user
                    )
                );
            })
            .catch(err => setError("Error updating role: " + err.message));
    };

    const handleBack = () => {
        history.goBack(); // Navigate to the previous page
    };

    if (error) return <p>{error}</p>;
    if (!user) return <p>Loading...</p>;

    return (
        <div className="user-settings">
            <h2>User Settings</h2>
            <button onClick={handleBack} className="goback-button">
                Back
            </button>
            <form onSubmit={handleSaveAndLogout}>
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
                <label>
                    Profile picture url:
                    <input
                        type="string"
                        name="profile_picture"
                        defaultValue={user.profile_picture}
                        onChange={handleChange}
                    />
                </label>
                <button type="submit">Save Changes and Log Out</button>
            </form>

            {isAdmin && (
                <div className="user-overview">
                    <h3>All Users</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Change Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.user_id}>
                                    <td>{u.username}</td>
                                    <td>{u.role}</td>
                                    <td>
                                        <button
                                            onClick={() =>
                                                handleRoleChange(
                                                    u.user_id,
                                                    u.role === "admin" ? "user" : "admin"
                                                )
                                            }
                                        >
                                            {u.role === "admin"
                                                ? "Revoke Admin"
                                                : "Make Admin"}
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


export const UserPage: React.FC = () => {
  const { user_id } = useParams<{ user_id: string }>();
  const history = useHistory();

  const [user, setUser] = useState<User | null>(null);
  const [likedAngels, setLikedAngels] = useState<Angel[]>([]);
  const [wishlistAngels, setWishlistAngels] = useState<Angel[]>([]);
  const [activeTab, setActiveTab] = useState<"collection" | "wishlist">("collection");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user_id || isNaN(Number(user_id))) {
      setError("Invalid User ID");
      return;
    }

    // Get user details
    userService
      .getById(Number(user_id))
      .then((fetchedUser) => setUser(fetchedUser))
      .catch((err) => setError(`Error fetching user: ${err.message}`));

    // Get liked angels (collection)
    LikesService.getUserLikes(Number(user_id))
      .then(async (likes) => {
        const angels = await Promise.all(
          likes.map(async (like) => {
            try {
              return await angelService.get(like.angel_id);
            } catch (err) {
              console.error("Error fetching angel details:", err);
              return null;
            }
          })
        );
        setLikedAngels(angels.filter((angel) => angel !== null) as Angel[]);
      })
      .catch((err) => setError(`Error fetching liked angels: ${err.message}`));

    // Get wishlist angels
    WishlistService.getUserWishlist(Number(user_id))
      .then(async (wishlist) => {
        const angels = await Promise.all(
          wishlist.map(async (wish) => {
            try {
              return await angelService.get(wish.angel_id);
            } catch (err) {
              console.error("Error fetching wishlist angel details:", err);
              return null;
            }
          })
        );
        setWishlistAngels(angels.filter((angel) => angel !== null) as Angel[]);
      })
      .catch((err) => setError(`Error fetching wishlist: ${err.message}`));
  }, [user_id]);

  if (error) return <p>{error}</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ position: "relative" }}>
      <button className="home-button" onClick={() => history.push("/")}>
        Go to Home
      </button>
      <div className="series-page">

        {/* User userdetails section */}
        <div className="profile-header">
          <h2>{user.username}</h2>
          <img
            src={
              user.profile_picture ||
              "https://wallpapers-clan.com/wp-content/uploads/2024/10/sonny-angel-pfp-02.jpg"
            }
            alt="User Profile"
            className="user-profile-image"
          />
        </div>

        <div className="profile-divider"></div>

        <div className="profile-info">
          <p>
            <strong>About:</strong> {user.bio || "No bio provided"}
          </p>
        </div>

        {/* Tabs for Collection and Wishlist */}
        <div className="profile-tabs">
          <button
            className={`tab-button ${activeTab === "collection" ? "active" : ""}`}
            onClick={() => setActiveTab("collection")}
          >
            Collection
          </button>
          <button
            className={`tab-button ${activeTab === "wishlist" ? "active" : ""}`}
            onClick={() => setActiveTab("wishlist")}
          >
            Wishlist
          </button>
        </div>

        {/* Collection Section */}
        {activeTab === "collection" && (
          <div className="angel-cards">
            {likedAngels.length > 0 ? (
              likedAngels.map((angel) => (
                <div key={angel.angel_id} className="angel-card">
                  <Link to={`/angels/${angel.angel_id}`} className="angel-card-link">
                    <img
                      src={angel.image || "https://placehold.co/150x150"}
                      alt={angel.name}
                      className="angel-card-image"
                    />
                    <h3 className="angel-card-name">{angel.name}</h3>
                  </Link>
                </div>
              ))
            ) : (
              <p>This user's collection is empty.</p>
            )}
          </div>
        )}

        {/* Wishlist Section */}
        {activeTab === "wishlist" && (
          <div className="angel-cards">
            {wishlistAngels.length > 0 ? (
              wishlistAngels.map((angel) => (
                <div key={angel.angel_id} className="angel-card">
                  <Link to={`/angels/${angel.angel_id}`} className="angel-card-link">
                    <img
                      src={angel.image || "https://placehold.co/150x150"}
                      alt={angel.name}
                      className="angel-card-image"
                    />
                    <h3 className="angel-card-name">{angel.name}</h3>
                  </Link>
                </div>
              ))
            ) : (
              <p>This user's wishlist is empty.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
