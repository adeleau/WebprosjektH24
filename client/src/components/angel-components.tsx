import { Link, useHistory, useParams } from "react-router-dom";
import React from "react";
import {useState, useEffect, useRef} from "react";
import { createHashHistory } from 'history';
import Cookies from 'js-cookie';
import userService from "../services/user-service";
import type { User } from "../services/user-service";
import LikesService from "../services/likes-service";
import WishlistService from "../services/wishlist-service";


import AngelService from "../services/angel-service";
import type { Angel } from "../services/angel-service";
import AngelCommentService from "../services/angelcomment-service";
import type { AngelComment } from "../services/angelcomment-service";

import SeriesService from "../services/series-service";
import type { Series } from "../services/series-service";

// import UserService from "../services/user-service";
// import type { User } from "../services/user-service";

import { Navbar, Leftbar, Footer } from "./other-components";
const history = createHashHistory();

export const MasterList: React.FC = () => {
    const [angels, setAngels] = useState<Angel[]>([]);
    const [error, setError] = useState<string | null>(null);
    const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
    useEffect(() => {
      AngelService.getAll()
        .then((data) => setAngels(data))
        .catch((err) => setError(`Error fetching angels: ${err.message}`));
    }, []);
  
    // Group angels by their starting letter
    const groupedAngels = angels.reduce((acc: { [key: string]: Angel[] }, angel) => {
      const firstLetter = angel.name.charAt(0).toUpperCase();
      if (!acc[firstLetter]) acc[firstLetter] = [];
      acc[firstLetter].push(angel);
      return acc;
    }, {});
  
    const handleScrollToSection = (letter: string) => {
      const section = sectionRefs.current[letter];
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    };
  
    return (
      <>
        <Navbar />
        <Leftbar />
    
        <div className="angel-master-list">
          <h2>Angel Master List</h2>
          <hr className="masterlist-divider" />
    
          {error && <div className="error-message">{error}</div>}
    
          {/* Alphabet Links */}
          <div className="alphabet-links">
            {Object.keys(groupedAngels)
              .sort()
              .map((letter) => (
                <button 
                  key={letter}
                  onClick={() => handleScrollToSection(letter)}
                  className="alphabet-link"
                >
                  {letter}
                </button>
              ))}
          </div>
    
          {/* List of Angels by Alphabet */}
          <div className="angel-list">
            {Object.keys(groupedAngels)
              .sort()
              .map((letter) => (
                <div
                  key={letter}
                  id={letter}
                  className="angel-group"
                  ref={(el) => (sectionRefs.current[letter] = el)}
                >
                  <h2>{letter}</h2>
                  <ul>
                    {groupedAngels[letter].map((angel) => (
                      <li key={angel.angel_id}>
                        <Link to={`/angels/${angel.angel_id}`} className="angel-link">
                          {angel.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>
        <Footer></Footer>
      </>
    );
};


export const AngelDetails: React.FC<{}> = () => {
  const { angel_id } = useParams<{ angel_id: string }>();
  const history = useHistory();

  const [angel, setAngel] = useState<Angel>({
    angel_id: 0,
    name: '',
    description: '',
    image: '',
    release_year: 0,
    views: 0,
    user_id: 0,
    series_id: 0,
  });
  const [series, setSeries] = useState<string>();
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [comment, setComment] = useState<string>('');
  const [comments, setComments] = useState<AngelComment[]>([]);

  // Fetch angel details and user information
  useEffect(() => {
    if (angel_id) {
      AngelService.get(Number(angel_id))
        .then((data) => {
          setAngel(data);
          SeriesService.getName(data.series_id)
            .then((name) => setSeries(name))
            .catch((err) => setError(`Error getting series name: ${err.message}`));
        })
        .catch((err) => setError(`Error getting angel: ${err.message}`));
    }

    const loggedInUser = Cookies.get('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, [angel_id]);

  // Check if the angel is liked or wishlisted
  useEffect(() => {
    if (user && angel) {
      LikesService.getUserLikes(user.user_id)
        .then((likes) => {
          const likedAngels = likes.map((like) => like.angel_id);
          setIsLiked(likedAngels.includes(angel.angel_id));
        })
        .catch((err) => setError(`Error checking like status: ${err.message}`));

      WishlistService.getUserWishlist(user.user_id)
        .then((wishlist) => {
          const wishlistedAngels = wishlist.map((item) => item.angel_id);
          setIsWishlisted(wishlistedAngels.includes(angel.angel_id));
        })
        .catch((err) => setError(`Error checking wishlist status: ${err.message}`));
    }
  }, [user, angel]);

  // Handle like toggle
  const handleLikeToggle = async () => {
    if (!user) {
      setError('You must be logged in to like this angel');
      return;
    }

    try {
      if (isLiked) {
        await LikesService.removeLike(user.user_id, angel.angel_id);
        setIsLiked(false);
      } else {
        await LikesService.addLike(user.user_id, angel.angel_id);
        setIsLiked(true);
      }
    } catch (err) {
      setError(`Failed to update like status: ${err.message}`);
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async () => {
    if (!user) {
      setError('You must be logged in to add this angel to your wishlist');
      return;
    }

    try {
      if (isWishlisted) {
        await WishlistService.removeWishlist(user.user_id, angel.angel_id);
        setIsWishlisted(false);
      } else {
        await WishlistService.addWishlist(user.user_id, angel.angel_id);
        setIsWishlisted(true);
      }
    } catch (err) {
      setError(`Failed to update wishlist status: ${err.message}`);
    }
  };

  // Fetch and manage comments
  const fetchComments = async () => {
    try {
      const fetchedComments = await AngelService.getComments(Number(angel_id));
      setComments(fetchedComments);
    } catch (err) {
      setError(`Error fetching comments: ${err.message}`);
    }
  };

  const handlePostComment = async () => {
    if (!comment.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    if (!user) {
      setError('You must be logged in to post a comment');
      return;
    }

    try {
      await AngelService.addComment(Number(angel_id), user.user_id, comment);
      setComment('');
      fetchComments(); // Refresh comments
    } catch (err) {
      setError(`Failed to post comment: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [angel_id]);

  // const handleEditAngel = () => {

  // }

  return (
    <>
      <Navbar />
      <Leftbar />

      <button className="back-button" onClick={() => history.push('/masterlist')}>
        View all angels
      </button>

      {angel ? (
        <div className="angel-details">
          <div className="header-container">
            <h2 className="angel-header">{angel.name}</h2>
          </div>

          <div className="details-content">
            <div className="details-text">
              <div className="detail-row series-row">
                <strong>Series: </strong>
                <Link to={`/series/${angel.series_id}`} className="series-link">
                  {series}
                </Link>
              </div>
              <div className="detail-row">
                <strong>Description: </strong>
                <span>{angel.description}</span>
              </div>
              <div className="detail-row">
                <strong>Release year: </strong>
                <span>{angel.release_year}</span>
              </div>
            </div>

            {angel.image && (
              <div className="image-container">
                <img src={angel.image} alt={angel.name} className="angel-image" />
              </div>
            )}
          </div>

          <div className="info-row">
            <span className="info-item">Views: {angel.views}</span>
            <span className="info-item">Created at: {angel.created_at}</span>
            <span className="info-item">Last updated at: {angel.updated_at}</span>
            <button className="history-button" onClick={() => history.push(`${angel_id}/history`)}>
              History
            </button>
          </div>

          <div className="button-container">
            <button
              className={`like-button ${isLiked ? 'active' : ''}`}
              onClick={handleLikeToggle}
            >
              {isLiked ? 'Remove from collection' : 'Add to collection'}
            </button>

            <button
              className={`wishlist-button ${isWishlisted ? 'active' : ''}`}
              onClick={handleWishlistToggle}
            >
              {isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            </button>
          </div>
          
          <div className="comment-section">
            <h2>Comments</h2>
            <div className="comments">
              {comments.map((comment) => (
                <div key={comment.angelcomment_id} className="comment">
                  <p>
                    <strong>{comment.user_id}</strong>: {comment.content}
                  </p>
                </div>
              ))}
            </div>
            <div className="comment-input">
              <input
                type="text"
                placeholder="Post a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button onClick={handlePostComment}>Post</button>
            </div>
          </div>
        </div>
      ) : null}

      <Footer />
    </>
  );
};


export const AngelNew: React.FC<{}> = () => {
  const { series_id: routeSeriesId } = useParams<{ series_id: string }>();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [release_year, setReleaseYear] = useState(0);
  const [selectedSeriesId, setSelectedSeriesId] = useState<number | null>(
    Number(routeSeriesId)
  );
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [newSeriesName, setNewSeriesName] = useState("");
  const [showAddSeries, setShowAddSeries] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ username: string; user_id: number; role: string } | null>(
    null
  );
  const history = useHistory();

  useEffect(() => {
    // Fetch logged-in user from cookies
    const userCookie = Cookies.get("user");
    if (userCookie) {
      const parsedUser = JSON.parse(userCookie);
      setUser(parsedUser);

      if (parsedUser.role !== "admin") {
        history.push("/");
      }
    } else {
      history.push("/login");
    }

    // Fetch series list
    SeriesService.getAll()
      .then((data) => setSeriesList(data))
      .catch((error) => setError("Error fetching series: " + error.message));
  }, [history]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    if (name === "name") setName(value);
    else if (name === "description") setDescription(value);
    else if (name === "image") setImage(value);
    else if (name === "release_year") setReleaseYear(Number(value));
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value === "add-new-series") {
      setShowAddSeries(true); // Show input for adding a new series
      setSelectedSeriesId(null); // Reset selected series
    } else {
      setShowAddSeries(false);
      setSelectedSeriesId(Number(value));
    }
  };

  const handleCreateSeries = () => {
    if (!newSeriesName.trim()) {
      setError("Series name cannot be empty.");
      return;
    }

    SeriesService.createSeries({ name: newSeriesName })
      .then((newSeries) => {
        setSeriesList([...seriesList, newSeries]); // Update series list
        setSelectedSeriesId(newSeries.series_id); // Automatically select the new series
        setNewSeriesName(""); // Clear input
        setShowAddSeries(false); // Hide input
      })
      .catch((error) => setError("Error creating series: " + error.message));
  };

  const handleCreateAngel = () => {
    if (!user) {
      setError("User information is missing.");
      return;
    }

    if (!selectedSeriesId) {
      setError("Please select or add a series.");
      return;
    }

    const newAngel: Angel = {
      angel_id: 0,
      name,
      description,
      image,
      release_year,
      views: 0,
      user_id: user.user_id,
      series_id: selectedSeriesId,
    };

    AngelService.createAngel(newAngel)
      .then((angel) => {
        // Redirect to the new angel's page
        history.push(`/angels/${angel.angel_id}`);
      })
      .catch((error) => setError("Error creating angel: " + error.message));
  };

  return (
    <>
      <Navbar />
      <Leftbar />
      <div className="card">
        {error && <div className="error-message">{error}</div>}

        <h2>Add New Angel as {user?.username || "Unknown"}</h2>

        {/* Angel Creation Form */}
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="series_id">Series:</label>
          <select
            id="series_id"
            name="series_id"
            value={selectedSeriesId ?? "add-new-series"}
            onChange={handleSelectChange}
            className="form-control"
          >
            {seriesList.map((series) => (
              <option key={series.series_id} value={series.series_id}>
                {series.name}
              </option>
            ))}
            <option value="add-new-series">Add New Series</option>
          </select>
        </div>

        {showAddSeries && (
          <div className="form-group">
            <label htmlFor="newSeries">New Series Name:</label>
            <input
              id="newSeries"
              type="text"
              placeholder="Enter series name"
              value={newSeriesName}
              onChange={(e) => setNewSeriesName(e.target.value)}
              className="form-control"
            />
            <button className="btn btn-create" onClick={handleCreateSeries}>
              Add Series
            </button>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={handleInputChange}
            rows={10}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="release_year">Release Year:</label>
          <input
            id="release_year"
            name="release_year"
            type="number"
            value={release_year}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image URL:</label>
          <input
            id="image"
            name="image"
            type="text"
            value={image}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <button className="btn btn-create" onClick={handleCreateAngel}>
          Create Angel
        </button>
      </div>
      <Footer />
    </>
  );
};


export const AngelEdit: React.FC<{}> = () => {
  const { angel_id } = useParams<{ angel_id: string }>();
  const history = useHistory();

  const [angel, setAngel] = useState<Angel>({
    angel_id: 0,
    name: "",
    description: "",
    image: "",
    release_year: 0,
    views: 0,
    user_id: 0,
    series_id: 0,
  });
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState<boolean>(false);

  // Check access control on mount
  useEffect(() => {
    const loggedInUser = Cookies.get("user");
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser) as User;
      setUser(parsedUser);

      if (parsedUser.role !== "admin") {
        setAccessDenied(true); // Deny access if the user is not an admin
      }
    } else {
      setAccessDenied(true); // Deny access if the user is not logged in
    }
  }, []);

  // Fetch angel details when the component mounts
  useEffect(() => {
    if (angel_id && !accessDenied) {
      AngelService.get(Number(angel_id))
        .then((fetchedAngel) => setAngel(fetchedAngel))
        .catch((err) => setError("Error fetching angel details: " + err.message));
    }
  }, [angel_id, accessDenied]);

  // Handle input changes
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setAngel((prevAngel) => ({
      ...prevAngel,
      [name]: value,
    }));
  };

  // Save updated angel details
  const handleSave = () => {
    AngelService.updateAngel(angel)
      .then(() => {
        history.push(`/angels/${angel.angel_id}`); // Redirect to the angel's details page
      })
      .catch((err) => setError("Error saving angel: " + err.message));
  };

  // Delete the angel
  const handleDelete = () => {
    AngelService.deleteAngel(angel.angel_id!)
      .then(() => {
        history.push(`/series/${angel.series_id}`); // Redirect to the associated series page after deletion
      })
      .catch((err) => setError("Error deleting angel: " + err.message));
  };

  if (accessDenied) {
    return (
      <>
        <Navbar />
        <Leftbar />
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You do not have permission to access this page.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Leftbar />
      <div className="card">
        {error && <div className="error-message">{error}</div>}

        <h2>Edit Angel</h2>

        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            name="name"
            type="text"
            value={angel.name}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={angel.description}
            onChange={handleInputChange}
            rows={4}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="release_year">Release Year:</label>
          <input
            id="release_year"
            name="release_year"
            type="number"
            value={angel.release_year}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image URL:</label>
          <input
            id="image"
            name="image"
            type="text"
            value={angel.image}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="form-actions">
          <button className="btn btn-success" onClick={handleSave}>
            Save Changes
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete Angel
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};
