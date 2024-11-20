import { Link, useHistory, useParams } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { createHashHistory } from "history";
import { Navbar, Leftbar, Footer } from "./other-components";
import Cookies from "js-cookie";
import AngelService from "../services/angel-service";
import type { Angel, Angel_History } from "../services/angel-service";
import AngelCommentService from "../services/angelcomment-service";
import type { AngelComment as BaseAngelComment } from "../services/angelcomment-service";
import SeriesService from "../services/series-service";
import type { Series } from "../services/series-service";
import type { User } from "../services/user-service";
import LikesService from "../services/likes-service";
import WishlistService from "../services/wishlist-service";

interface AngelComment extends BaseAngelComment {
  isEditing: boolean;
}

const history = createHashHistory();

export const MasterList: React.FC = () => {
  const [angels, setAngels] = useState<Angel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null); // State for logged-in user
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const history = useHistory();

  useEffect(() => {
    // Get logged-in user from cookies
    const userCookie = Cookies.get("user");

    try {
      if (userCookie) {
        if (userCookie.startsWith("{") && userCookie.endsWith("}")) {
          const parsedUser = JSON.parse(userCookie);
          setUser(parsedUser);
        } else if (userCookie === "guest") {
          setUser({
            username: "Guest",
            user_id: 0,
            role: "guest",
            email: "",
            password_hash: "",
          });
        } else {
          console.warn("Unexpected cookie value:", userCookie);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error parsing user cookie:", error);
      setUser(null); // Set as not logged in if parsing fails
    }

    AngelService.getAll()
      .then((data) => setAngels(data))
      .catch((err) => {
        console.error("Error fetching angels:", err.message);
        setError(`Error fetching angels: ${err.message}`);
      });
  }, []);

  // Grouping angels by their starting letter
  const groupedAngels = angels.reduce((acc: { [key: string]: Angel[] }, angel) => {
    const firstLetter = angel.name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(angel);
    return acc;
  }, {});

  const handleScrollToSection = (letter: string) => {
    const section = sectionRefs.current[letter];
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
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

        {user && user.role === "admin" ? (
          <button
            className="btn-create-angel"
            onClick={() => history.push(`/series/1/new`)}
          >
            New Sonny Angel
          </button>
        ) : null}

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
      <Footer />
    </>
  );
};

export const AngelDetails: React.FC<{}> = () => {
  const { angel_id } = useParams<{ angel_id: string }>();
  const history = useHistory();

  const [angel, setAngel] = useState<Angel | null>(null);
  const [series, setSeries] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<AngelComment[]>([]);

  // Get angel details and user information
  useEffect(() => {
    if (angel_id) {
      AngelService.get(Number(angel_id))
        .then((data) => {
          setAngel(data);

          SeriesService.getName(data.series_id)
            .then((seriesName) => setSeries(seriesName))
            .catch((err) => setError(`Error fetching series name: ${err.message}`));

          AngelService.incrementViews(Number(angel_id))
            .then((updatedAngel) => setAngel(updatedAngel))
            .catch((err) => setError(`Error incrementing views: ${err.message}`));
        })
        .catch((err) => setError(`Error fetching angel: ${err.message}`));
    }

    const userCookie = Cookies.get("user");
    try {
      if (userCookie) {
        setUser(JSON.parse(userCookie));
      }
    } catch (error) {
      console.error("Error parsing user cookie:", error);
      setUser(null);
    }
  }, [angel_id]);

  // Check if the angel is liked or wishlisted
  useEffect(() => {
    if (user && angel) {
      LikesService.getUserLikes(user.user_id)
        .then((likes) => {
          const likedAngels = likes.map((like) => like.angel_id);
          setIsLiked(angel.angel_id !== undefined && likedAngels.includes(angel.angel_id));
        })
        .catch((err) => setError(`Error checking like status: ${err.message}`));

      WishlistService.getUserWishlist(user.user_id)
        .then((wishlist) => {
          const wishlistedAngels = wishlist.map((item) => item.angel_id);
          setIsWishlisted(
            angel?.angel_id !== undefined && wishlistedAngels.includes(angel.angel_id)
          );
        })
        .catch((err) => setError(`Error checking wishlist status: ${err.message}`));
    }
  }, [user, angel]);

  const handleLikeToggle = async () => {
    if (!user) {
      setError("You must be logged in to like this angel");
      return;
    }

    try {
      if (isLiked) {
        if (angel?.angel_id !== undefined) {
          await LikesService.removeLike(user.user_id, angel.angel_id);
        }
        setIsLiked(false);
      } else {
        if (angel?.angel_id !== undefined) {
          await LikesService.addLike(user.user_id, angel.angel_id);
        }
        setIsLiked(true);
      }
    } catch (err) {
      setError(`Failed to update like status: ${err}`);
    }
  };

  // Toggle wishlist
  const handleWishlistToggle = async () => {
    if (!user) {
      setError("You must be logged in to add this angel to your wishlist");
      return;
    }

    try {
      if (isWishlisted) {
        if (angel?.angel_id !== undefined) {
          await WishlistService.removeWishlist(user.user_id, angel.angel_id);
        }
        setIsWishlisted(false);
      } else {
        if (angel?.angel_id !== undefined) {
          await WishlistService.addWishlist(user.user_id, angel.angel_id);
        }
        setIsWishlisted(true);
      }
    } catch (err) {
      setError(`Failed to update wishlist status: ${err}`);
    }
  };

  // Fetch comments
  const fetchComments = async () => {
    try {
      const fetchedComments = await AngelCommentService.getAngelComments(Number(angel_id));
      setComments(fetchedComments.map((c) => ({ ...c, isEditing: false })));
    } catch (err) {
      setError(`Error fetching comments: ${err}`);
    }
  };

  // Post a comment
  const handlePostComment = async () => {
    if (!comment.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    if (!user) {
      setError("You must be logged in to post a comment");
      return;
    }

    try {
      await AngelCommentService.addAngelComment(Number(angel_id), user.user_id, comment);
      setComment("");
      fetchComments();
    } catch (err) {
      setError(`Failed to post comment: ${err}`);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [angel_id]);

  return (
    <>
      <Navbar />
      <Leftbar />

      <button className="back-button" onClick={() => history.push("/masterlist")}>
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
                {series ? (
                  <Link to={`/series/${angel.series_id}`} className="series-link">
                    {series}
                  </Link>
                ) : (
                  "Unknown"
                )}
              </div>
              <div className="detail-row">
                <strong>Description: </strong>
                <span>{angel.description}</span>
              </div>
              <div className="detail-row">
                <strong>Release year: </strong>
                <span>{angel.release_year || ""}</span>
              </div>
              <div className="detail-row">
                <strong>Views: </strong>
                <span>{angel.views}</span>
              </div>
            </div>

            {angel.image && (
              <div className="image-container">
                <img src={angel.image} alt={angel.name} className="angel-image" />
              </div>
            )}
          </div>

          <div className="info-row">
            <button className="history-button" onClick={() => history.push(`${angel_id}/history`)}>
              History
            </button>
            {user?.role === "admin" && (
              <button
                className="edit-button"
                onClick={() => history.push(`/angels/${angel_id}/edit`)}
              >
                Edit Angel
              </button>
            )}
          </div>

          <div className="button-container">
            {user ? (
              <>
                <button
                  className={`like-button ${isLiked ? "active" : ""}`}
                  onClick={handleLikeToggle}
                >
                  {isLiked ? "Remove from collection" : "Add to collection"}
                </button>

                <button
                  className={`wishlist-button ${isWishlisted ? "active" : ""}`}
                  onClick={handleWishlistToggle}
                >
                  {isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                </button>
              </>
            ) : null}
          </div>

          <div className="comment-section">
            <h2>Comments</h2>
            <div className="comments">
              {comments.map((comment) => (
                <div key={comment.angelcomment_id} className="comment">
                  {user && (user.role === "admin" || user.user_id === comment.user_id) ? (
                    <div>
                      {comment.isEditing ? (
                        <input
                          type="text"
                          value={comment.content}
                          onChange={(e) => {
                            const updatedComments = comments.map((c) =>
                              c.angelcomment_id === comment.angelcomment_id
                                ? { ...c, content: e.target.value }
                                : c
                            );
                            setComments(updatedComments);
                          }}
                          className="edit-comment-input"
                        />
                      ) : (
                        <p>
                          <strong>
                            <Link to={`/user/${comment.user_id}`}>{comment.username}</Link>
                          </strong>
                          : {comment.content}
                        </p>
                      )}
                      <div className="comment-actions">
                        {comment.isEditing ? (
                          <button
                            onClick={() => {
                              AngelCommentService.editAngelComment(
                                comment.angelcomment_id,
                                comment.content,
                                user.user_id,
                                user.role || ""
                              )
                                .then(() => {
                                  const updatedComments = comments.map((c) =>
                                    c.angelcomment_id === comment.angelcomment_id
                                      ? { ...c, isEditing: false }
                                      : c
                                  );
                                  setComments(updatedComments);
                                })
                                .catch((err) =>
                                  setError(`Failed to edit comment: ${err.message}`)
                                );
                            }}
                            className="save-comment-button"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              const updatedComments = comments.map((c) =>
                                c.angelcomment_id === comment.angelcomment_id
                                  ? { ...c, isEditing: true }
                                  : c
                              );
                              setComments(updatedComments);
                            }}
                            className="edit-comment-button"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() =>
                            AngelCommentService.deleteAngelComment(
                              comment.angelcomment_id,
                              user.user_id,
                              user.role || ""
                            )
                              .then(() => fetchComments())
                              .catch((err) =>
                                setError(`Failed to delete comment: ${err.message}`)
                              )
                          }
                          className="delete-comment-button"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p>
                      <strong>
                        <Link to={`/user/${comment.user_id}`}>{comment.username}</Link>
                      </strong>
                      : {comment.content}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {user ? (
              <div className="comment-input">
                <input
                  type="text"
                  placeholder="Post a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button className="post-button" onClick={handlePostComment}>
                  Post
                </button>
              </div>
            ) : (
              <p className="login-prompt">Log in to post a comment.</p>
            )}
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
  const [selectedSeriesId, setSelectedSeriesId] = useState<number | null>(Number(routeSeriesId));
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [newSeriesName, setNewSeriesName] = useState("");
  const [showAddSeries, setShowAddSeries] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ username: string; user_id: number; role: string } | null>(null);
  const history = useHistory();

  useEffect(() => {
    // Get logged-in user from cookies
    const userCookie = Cookies.get("user");

    try {
      if (userCookie) {
        if (userCookie.startsWith("{") && userCookie.endsWith("}")) {
          const parsedUser = JSON.parse(userCookie);
          setUser(parsedUser);
          if (parsedUser.role !== "admin") {
            history.push("/");
          }
        } else if (userCookie === "guest") {
          setUser({ username: "Guest", user_id: 0, role: "guest" });
          history.push("/"); // Restrictions for guests
        } else {
          setUser(null);
          history.push("/login");
        }
      } else {
        setUser(null);
        history.push("/login");
      }
    } catch (error) {
      console.error("Error parsing user cookie:", error);
      setUser(null);
      history.push("/login");
    }

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
      setShowAddSeries(true); // Input for adding a new series
      setSelectedSeriesId(null);
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
        setSeriesList([...seriesList, newSeries]);
        setSelectedSeriesId(newSeries.series_id); // Automatically select the new series
        setNewSeriesName("");
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
        // Redirect to new angel's page
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

        {/* Creation Form */}
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

export const AngelHistory: React.FC = () => {
  const { angel_id } = useParams<{ angel_id: string }>();
  const history = useHistory();

  const [AngelHistory, setAngelHistory] = useState<Angel_History[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (angel_id) {
      AngelService.getAngelHistory(Number(angel_id))
        .then((data) => {
          setAngelHistory(data);
        })
        .catch((err) => {
          console.error("Error fetching angel history:", err);
          setError("Failed to fetch angel history");
        });
    }
  }, [angel_id]);

  return (
    <>
      <Navbar />
      <Leftbar />

      <div className="angel-history">
        <button
          className="back-button"
          onClick={() => history.push(`/angels/${angel_id}`)}
        >
          Back to Angel Details
        </button>

        <h2>Angel History</h2>

        {error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="history-list">
            {AngelHistory.length > 0 ? (
              AngelHistory.map((entry) => (
                <div key={entry.angelhistory_id} className="history-entry">
                  <p>
                    <strong>Description:</strong> {entry.description}
                  </p>
                  <p>
                    <strong>Updated by User ID:</strong> {entry.user_id}
                  </p>
                  <p>
                    <strong>Updated at:</strong>{" "}
                    {new Date(entry.updated_at || "").toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p>No history available for this angel.</p>
            )}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export const AngelEdit: React.FC<{}> = () => {
  const { angel_id } = useParams<{ angel_id: string }>();
  const history = useHistory();

  const [angel, setAngel] = useState<Partial<Angel>>({
    angel_id: 0,
    name: "",
    description: "",
    image: "",
    release_year: 0,
    views: 0,
    user_id: 0,
    series_id: 0,
  });
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState<boolean>(false);

  useEffect(() => {
    const userCookie = Cookies.get("user");

    try {
      if (userCookie) {
        if (userCookie.startsWith("{") && userCookie.endsWith("}")) {
          const parsedUser = JSON.parse(userCookie) as User;
          setUser(parsedUser);

          if (parsedUser.role !== "admin") {
            setAccessDenied(true);
          }
        } else {
          setUser(null);
          setAccessDenied(true);
        }
      } else {
        setUser(null);
        setAccessDenied(true);
      }
    } catch (error) {
      console.error("Error parsing user cookie:", error);
      setUser(null);
      setAccessDenied(true);
    }

    SeriesService.getAll()
      .then((data) => setSeriesList(data))
      .catch((err) => setError("Error fetching series: " + err.message));
  }, []);

  useEffect(() => {
    if (angel_id && !accessDenied) {
      AngelService.get(Number(angel_id))
        .then((fetchedAngel) => setAngel(fetchedAngel))
        .catch((err) => setError("Error fetching angel details: " + err.message));
    }
  }, [angel_id, accessDenied]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setAngel((prevAngel) => ({
      ...prevAngel,
      [name]: value,
    }));
  };

  const handleSeriesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const seriesId = Number(event.target.value);
    setAngel((prevAngel) => ({
      ...prevAngel,
      series_id: seriesId,
    }));
  };

  const handleSave = () => {
    console.log("Angel being updated:", angel);
    AngelService.updateAngel(angel)
      .then(() => {
        history.push(`/angels/${angel.angel_id}`);
      })
      .catch((err) => setError("Error saving angel: " + err.message));
  };

  const handleDelete = () => {
    console.log("Deleting angel with ID:", angel.angel_id);
    AngelService.deleteAngel(angel.angel_id!)
      .then(() => {
        history.push(`/`);
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

        <div className="form-group">
          <label htmlFor="series_id">Series:</label>
          <select
            id="series_id"
            name="series_id"
            value={angel.series_id}
            onChange={handleSeriesChange}
            className="form-control"
          >
            {seriesList.map((series) => (
              <option key={series.series_id} value={series.series_id}>
                {series.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button className="save-button" onClick={handleSave}>
            Save Changes
          </button>
          <button className="delete-button" onClick={handleDelete}>
            Delete Angel
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};
