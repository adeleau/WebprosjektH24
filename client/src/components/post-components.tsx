import { Link, useHistory, useParams } from "react-router-dom";
import React from "react";
import {useState, useEffect, useRef} from "react";
import { createHashHistory } from 'history';

import PostService from "../services/post-service";
import type {Post} from "../services/post-service"
import { Navbar, Leftbar, Footer } from "./other-components";
import postService from "../services/post-service";

export const PostList: React.FC<{}> = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [error, setError] = useState<string | null>(null);
    const history = useHistory();
  
    useEffect(() => {
      PostService
        .getAll()
        .then((data) => setPosts(data))
        .catch((err) => setError('Error getting posts: ' + err.message));
    }, []);
  
    return (
      <>
      <Navbar></Navbar>
      <Leftbar></Leftbar>
      <div className="post-list">
        {error && <div className="error-message">{error}</div>}
        
        <h2>Community</h2>
        <ul className="post-list-ul">
          {posts.map((post) => (
            <li key={post.post_id}>
              <Link to={`/posts/${post.post_id}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
  
        <button 
          className="btn-new" 
          onClick={() => history.push('/posts/new')}
        >
          New post
        </button>
      </div>
      <Footer></Footer>
      </>
      
    );
  };
  
  export const PostDetails: React.FC<{}> = () => {
    const { post_id } = useParams<{ post_id: string }>(); // Retrieve post ID from URL params
    const [post, setPost] = useState<Post>({ post_id: 0, user_id: 0, title: '', content: '', image: '', created_at: new Date(), updated_at: new Date() });
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const history = useHistory();
  
    useEffect(() => {
    PostService
        .get(Number(post_id))
        .then((data) => {
          setPost(data);
          setLoading(false);
        })
        .catch((err) => {
          setError('Error getting post: ' + err.message);
          setLoading(false);
        });
      //fetchLikeCount();
    }, [post_id]);
  
   {/* const fetchLikeCount = () => {
      postService
        .getPostLikes(Number(post_id))
        .then((count) => setLikeCount(count))
        .catch((err) => setError('Error getting like count: ' + err.message));
    };
  
    const toggleLike = () => {
      const newLikeCount = isLiked ? likeCount - 1 : likeCount + 1;
      setLikeCount(newLikeCount);
      setIsLiked(!isLiked);
      
      postService.likePost(Number(post_id)).catch((error) => {
        setError('Error updating like count: ' + error.message);
      });
    };
  
    if (loading) {
      return <p>Loading...</p>;
    } */}

    
    return (
      <>
      <Navbar></Navbar>
      <Leftbar></Leftbar>
      <div className="post-details">
        {error && <div className="error-message">{error}</div>}
        <button className="back-button" onClick={() => history.push('/posts')}>Back</button>
        <h2>{post.title}</h2>
        <div className="post-content">
          <p><strong>Title:</strong> {post.title}</p>
          <p><strong>Content:</strong> {post.content}</p>
          <p><strong>Image:</strong></p>
          <img src={post.image} alt={post.title} style={{ maxWidth: '200px', maxHeight: '200px' }} />
        </div>
  
        {/*<div className="post-likes">
          <button className="like-button" onClick={toggleLike}>
            {isLiked ? "Dislike" : "Like"}
          </button>
          <span>{likeCount} like(s)</span>
        </div> */}
  
        <button className="edit-button" onClick={() => history.push(`/posts/${post_id}/edit`)}>
          Edit
        </button>
      </div>
      {/* <div className="comment-section">
        <h2>Comments</h2>
        <div className="comments">

        </div>
        <div className="comment-input">
            <div className="form-group">
            <input
                id="comment-input"
                name="comment-input"
                type="text"
                value={content}
                onChange={handleInputChange}
                className="form-control"
            />
            </div>
        </div>
      </div> */}
      </>
    );
  };
  
  export const PostNew: React.FC<{}> = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [user_id, setUserId] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const history = useHistory();
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      if (name === 'title') {
        setTitle(value);
      } else if (name === 'content') {
        setContent(value);
      } else if (name === 'image') {
        setImage(value);
      }
    };
  
    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setUserId(Number(event.target.value));
    };
  
    const handleCreatePost = () => {
      const created_at = new Date().toISOString().slice(0,19).replace('T',' '); // vet ikke om denne kanskje lagrer dato for når bruker trykker på create post istedet for post
      console.log('Attempting to create post with:', { title, user_id, content, image, created_at }); //legger inn dette for å finne feilen
      PostService                                                //skal legge til et annet format for tid, siden dette kan være en av årsakene til at den ikke vil create og update
        .createPost(title, user_id, content, image, created_at)
        .then((post_id) => {
          history.push(`/posts/${post_id}`); // Redirect to the new post page
        })
        .catch((error) => setError('Error creating post: ' + error.message));
    };
  
    return (
      <>
        <Navbar></Navbar>
        <Leftbar></Leftbar>
       {/* <header className="header">
      <h1>Sonny Angel</h1>
      <p className="subtitle">He may bring you happiness</p>
    </header> */}
      <div className="card">
        {error && <div className="error-message">{error}</div>}
  
        <h2>New Post</h2>
        
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            name="title"
            type="text"
            value={title}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="user_id">By:</label>
          <select
            id="user_id"
            name="user_id"
            value={user_id}
            onChange={handleSelectChange}
            className="form-control"
          >
            <option value="">Select a user</option>
            <option value="2">Jub</option>
          </select>
        </div>
  
        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            name="content"
            value={content}
            onChange={handleInputChange}
            rows={10}
            className="form-control"
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="img">Image URL:</label>
          <textarea
            id="image" //endrer begge fra img til image for å prøve å endre bilde på edit
            name="image"
            value={image}
            onChange={handleInputChange}
            rows={10}
            className="form-control"
          />
        </div>
  
        <button 
          className="btn btn-create" 
          onClick={handleCreatePost}
        >
          Create Post
        </button>
      </div>
      </>
    );
  };
  
  export const PostEdit: React.FC<{}> = () => {
     const [post, setPost] = useState<Post>({
      post_id: 0,
      user_id: 0,
      title: '',
      content: '',
      image: '',
      created_at: new Date(),
      updated_at: new Date(),
    });
    const [error, setError] = useState<string | null>(null);
    const { post_id } = useParams<{ post_id: string }>();
    const history = useHistory();
  
    useEffect(() => {
      PostService
        .get(Number(post_id))
        .then((fetchedPost) => setPost(fetchedPost))
        .catch((err) => setError('Error getting post: ' + err.message));
    }, [post_id]);
  
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      setPost((prevPost) => ({
        ...prevPost,
        [name]: value
      }));
    };
  
    const handleSave = () => {
      const updated_at = new Date().toISOString().slice(0,19).replace('T',' '); // samme som jeg gjorde med create post, gjør samme med tid her også
      PostService
        .updatePost(post.post_id, post.title, post.content, post.image, updated_at)
        .then(() => {
          history.push('/posts/' + post.post_id);
        })
        .catch((error) => setError('Error updating post: ' + error.message));
    };
  
    const handleDelete = () => {
      PostService
        .deletePost(post.post_id)
        .then(() => {
          history.push('/posts'); // Redirect to post list after deletion
        })
        .catch((error) => setError('Error deleting post: ' + error.message));
    };
  
    return (
      <>
      <Navbar></Navbar>
      <Leftbar></Leftbar>
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
            rows={10}
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
      </>
    );
  };