import { Link, useHistory, useParams } from "react-router-dom";
import React from "react";
import {useState, useEffect, useRef} from "react";
import Cookies from "js-cookie";
import type { User } from "../services/user-service";
import PostService from "../services/post-service";
import type { Post } from "../services/post-service"
import { Navbar, Leftbar, Footer } from "./other-components";

export const PostList: React.FC<{}> = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

  useEffect(() => {
    const userCookie = Cookies.get("user"); // Using cookies again, since we are working with users
    // Referanse: src 6,7

    try {
      if (userCookie && userCookie.startsWith("{") && userCookie.endsWith("}")) {
        setUser(JSON.parse(userCookie));
      } else {
        setUser(null); 
      }
    } catch (err) {
      console.error("Error parsing user cookie:", err);
      setUser(null);
    }

    PostService.getAll()
      .then((data) => {
        const sortedData = data.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setPosts(sortedData);
      })
      .catch((err) => setError("Error getting posts: " + err.message));
  }, []);

  return (
    <>
      <Navbar />
      <Leftbar />
      <div className="post-list">
        {error && <div className="error-message">{error}</div>}

        <h2>RECENT POSTS</h2>
        {user ? (
          <button
            className="btn-new"
            onClick={() => history.push("/posts/new")}
          >
            New post as {user.username}
          </button>
        ) : null}

        <div className="post-list-content">
          {posts.map((post) => (
            <div key={post.post_id} className="post-preview-card">
            <img
              src="https://www.sonnyangel-france.com/cdn/shop/files/Sonny_angel_hippers_barre_de_recherche.svg?v=1709401074&width=80"
              alt="Post Header"
              className="post-preview-hipper"
            />
            {post.username && (
                <Link to={`/user/${post.user_id}`} className="post-creator">
                  {post.username}
                </Link>
              )}
            <Link to={`/posts/${post.post_id}`} className="post-link">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-preview-content"> 
                  {post.content.slice(0, 100)}
                </p>
            </Link>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export const PostNew: React.FC<{}> = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

  useEffect(() => {
    const userCookie = Cookies.get("user");
// Referanse src 6,7
    try {
      if (userCookie && userCookie.startsWith("{") && userCookie.endsWith("}")) {
        setUser(JSON.parse(userCookie));
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Error parsing user cookie:", err);
      setUser(null);
    }
  }, []);

  const handleCreatePost = () => {
    if (!user) {
      setError("You must be logged in to create a post.");
      return;
    }

    PostService.createPost(user.user_id, user.username, title, content, image)
      .then((post_id) => history.push(`/posts/${post_id}`))
      .catch((err) => setError("Error creating post: " + err.message));
  };

  return (
    <>
      <Navbar />
      <Leftbar />
      <div className="card">
        {error && <div className="error-message">{error}</div>}

        <h2>New Post as {user?.username}</h2>

        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            name="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image URL:</label>
          <textarea
            id="image"
            name="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            rows={10}
            className="form-control"
          />
        </div>

        <button className="btn btn-create" onClick={handleCreatePost}>
          Create Post
        </button>
      </div>
      <Footer />
    </>
  );
};

export const PostEdit: React.FC<{}> = () => {
  const { post_id } = useParams<{ post_id: string }>();
  const [post, setPost] = useState<Post>({
    post_id: 0,
    user_id: 0,
    username: "",
    title: "",
    content: "",
    image: "",
    created_at: new Date().toISOString(),
  } as unknown as Post);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

  useEffect(() => {
    const userCookie = Cookies.get("user"); // Referanse: src 6,7

    try {
      if (userCookie && userCookie.startsWith("{") && userCookie.endsWith("}")) {
        setUser(JSON.parse(userCookie));
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Error parsing user cookie:", err);
      setUser(null);
    }

    PostService.get(Number(post_id))
      .then((fetchedPost) => setPost(fetchedPost))
      .catch((err) => setError("Error getting post: " + err.message));
  }, [post_id]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
  };

  const handleSave = () => {
    PostService.updatePost(post.post_id, post.title, post.content, post.image)
      .then(() => history.push(`/posts/${post.post_id}`))
      .catch((err) => setError("Error updating post: " + err.message));
  };

  const handleDelete = () => {
    PostService.deletePost(post.post_id)
      .then(() => history.push("/posts"))
      .catch((err) => setError("Error deleting post: " + err.message));
  };

  if (!user || (user.user_id !== post.user_id && user.role !== "admin")) {
    return (
      <>
        <Navbar />
        <Leftbar />
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You do not have permission to edit this post.</p>
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

        <h2>Edit Post</h2>

        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            name="title"
            type="text"
            value={post.title}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            name="content"
            value={post.content}
            onChange={handleInputChange}
            rows={10}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image URL:</label>
          <textarea
            id="image"
            name="image"
            value={post.image}
            onChange={handleInputChange}
            rows={5}
            className="form-control"
          />
        </div>

        <div className="form-actions">
          <button className="btn btn-success" onClick={handleSave}>
            Save
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};


export const PostDetails: React.FC<{}> = () => {
  const { post_id } = useParams<{ post_id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

  useEffect(() => {
    const userCookie = Cookies.get("user"); // Referanse: src 6,7

    try {
      if (userCookie && userCookie.startsWith("{") && userCookie.endsWith("}")) {
        setUser(JSON.parse(userCookie));
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Error parsing user cookie:", err);
      setUser(null);
    }

    PostService.get(Number(post_id))
      .then((fetchedPost) => setPost(fetchedPost))
      .catch((err) => setError("Error getting post: " + err.message));
  }, [post_id]);

  if (error) {
    return (
      <>
        <Navbar />
        <Leftbar />
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Navbar />
        <Leftbar />
        <div className="no-post-message">
          <h2>No Post Found</h2>
          <p>The post does not exist or is unavailable.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Leftbar />
      <div className="post-details">
        <button
          className="back-button"
          onClick={() => history.push("/posts")}
        >
          Back to Posts
        </button>

        <h2 className="post-title">{post.title}</h2>

        <div className="post-meta">
          {post.username ? (
            <span>
              By{" "}
              <Link to={`/user/${post.user_id}`} className="post-author">
                {post.username}
              </Link>
            </span>
          ) : (
            <span>By Anonymous</span>
          )}
          <span> | Created at: {new Date(post.created_at).toLocaleString()}</span>
        </div>

        <div className="post-content">
          <p>{post.content}</p>
          {post.image && (
            <div className="post-image">
              <img
                src={post.image}
                alt={post.title}
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </div>
          )}
        </div>

        {user && (user.user_id === post.user_id || user.role === "admin") ? (
          <div className="post-actions">
            <button
              className="edit-button"
              onClick={() => history.push(`/posts/${post_id}/edit`)}
            >
              Edit Post
            </button>
            <button
              className="delete-button"
              onClick={() => {
                PostService.deletePost(post.post_id)
                  .then(() => history.push("/posts"))
                  .catch((err) =>
                    setError("Error deleting post: " + err.message)
                  );
              }}
            >
              Delete Post
            </button>
          </div>
        ) : null}
      </div>
      <Footer />
    </>
  );
};
