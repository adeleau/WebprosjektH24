import { Link } from "react-router-dom";
import React from "react";
import {useState, useEffect} from "react";
import SeriesService from "./services/series-service"
import type { Series } from "./services/series-service";
import AngelService from "./services/angel-service";
import PostService from "./services/post-service";
import seriesService from "./services/series-service";
import type { Angel, AngelCardProps } from "./services/angel-service";

// import PostService from "./services/post-service";
// import type { Post } from "./services/post-service";

export const Home: React.FC<{}> = () => {
    return (
        <>
        <Navbar></Navbar>
        <Leftbar></Leftbar>
        <div className="Home-text">
          <h2>Information</h2>
        </div>
        <div className="home-image">
          <img src="https://www.sonnyangel.com/renewal/wp-content/uploads/2021/10/sa_christmas2021_banner.jpg"/>
        </div>

        <Footer></Footer>
        </>
        )
}


export const About: React.FC<{}> = () => {
    return (
        
        <>
        <Navbar></Navbar>
        <Leftbar></Leftbar>
        <div className="about-container">
                <div className="about-text">
                    <h2>He may bring you happiness.</h2>
                    <hr className="about-divider" />
                    <p>
                        Sonny Angel is a little angel boy who likes wearing all sorts of headgear.
                        He is always by your side to make you smile. Sonny Angel will provide
                        healing moments in your everyday life. He is a welcome sight at the
                        entrance to your home, next to your bed, on your desk, and so many other
                        places.
                    </p>
                    <button className="view-more-button">View more</button>
                </div>
                <div className="about-image">
                    <img
                        src="https://www.sonnyangel.com/renewal/wp-content/uploads/2021/09/sa_hippers_banner.jpg" 
                        alt="Sonny Angel Figurines" 
                    />
                </div>
                <div className="about-text">
                    <h2>Try your luck.</h2>
                    <hr className="about-divider" />
                    <p>
                       The major feature of Sonny Angel Mini Figures is
                       that each series is comprised of 12 different figures. 
                       Sonny Angel utilizes blind box packaging; you do not know 
                       which figure you will receive until you buy one and open the box.
                    </p>
                    <button className="view-more-button">View more</button>
                </div>
                <div className="about-image">
                    <img
                        src="https://kawaiiloversclub.com/cdn/shop/files/ScreenShot2023-05-14at3.43.06PM.png?v=1684105784&width=1445" 
                        alt="Sonny Angel Figurines" 
                    />
                </div>
            </div>
        <Footer></Footer>
        </>
        )
}


/*export const Card: React.FC<{Angel: Angel}> = (Angel) =>{
    const thisAngel = Angel
    return (
        <>
        <div className = "card">
            <div className = "top">
                thisAngel.image_url
            </div>
            <div className = "bottom">
                thisAngel.name
            </div>
        </div>
        </>
    )
}*/

export const Navbar = () => {
    return (
      <>
        <div className="navbar">
            <div className="navbar_search">
              <input type="text" placeholder="Search..."/>
            </div>  

            {/* Center section: Main logo */}
            <div className="navbar_logo-container">
                <Link to="/">
                    <img src="https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/SonnyAngel_logo.png" alt="Main Logo" className="navbar_logo" />
                </Link>
            </div>

            {/* Right section: Profile picture 
            <div className="navbar_profile">
                IKON for profile picture
                <div className="user">
                    <img src="https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg" 
                        alt="" />
                    <span>John Doe</span>

                </div>

            </div> */}

        </div>
      </>
    );
};

export const Leftbar: React.FC<{}>= () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [series, setSeries] = useState<Array<string>>([]);

  useEffect(() => {
    const fetchSeries = async () => {

        try {
            const serieslist = await SeriesService.getAll();

            if (serieslist) {
                setSeries(serieslist.map((series) => series.name));
            } 
            else {
                console.log('No series available');
            }
        } 
        catch (error) {
            console.log(error);
        }
    };

    fetchSeries();
    
}, []);
    
  const toggleSidebar: () => void = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (isDropdownOpen) setIsDropdownOpen(false); // Close dropdown when closing sidebar
  };

  const toggleDropdown: () => void = () => {setIsDropdownOpen(!isDropdownOpen)};

  return (
    <>
    <div>
      <button className={`menu-toggle ${isSidebarOpen ? 'active' : ''}`} onClick={toggleSidebar}>
        {isSidebarOpen ? 'X' : '≡'}
      </button>

      <nav className={`nav-menu ${isSidebarOpen ? 'active' : ''}`}>
        <Link to="/"><img src="https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/sa_logo_pink.png" alt="Sidebar Logo" className="sidebar-logo" /></Link>

        <ul className="nav-menu-items">
          <li className="nav-text">
            <Link to="/about">About</Link>
          </li>
          <li className={`nav-text series ${isDropdownOpen ? 'active' : ''}`}>
            <span onClick={toggleDropdown}>
              Series {isDropdownOpen ? '↓' : '→'}
            </span>
            {isDropdownOpen && (
              <ul className="dropdown-menu active">
                {series.map((name, i) =>(
                    <li key={i} className = "nav-text">
                        <Link to = {`/series/${name}`}>{name}</Link>
                    </li>
                ))}
              </ul>
            )}
          </li>
          <li className="nav-text">
            <Link to="/popular">Most Popular</Link>
          </li>
          <li className="nav-text">
            <Link to="/posts">Community</Link>
          </li>
          <li className="nav-text">
            <Link to="/trading">Trading</Link>
          </li>
        </ul>
      </nav>
      {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </div>
    </>
  );
};

export const Menu: React.FC<{}> = () => {
    const [showDropDown, setShowDropDown] = useState<boolean>(false);

    return (
        <>
        </>
    )
}

export const AngelList: React.FC<{}> = () => {
  const [angels, setAngels] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AngelService.getAll()
      .then((data) => setAngels(data))
      .catch((err) => setError('Error getting angels: ' + err.message));
  }, []);

  return (
    <>
      {error && <div className="danger">{error}</div>}
      <div title="Sonny Angel Collection">
        {angels.map((angel) => (
          <ul key={angel.angel_id}>
            <li>
              <Link to={`/angels/${angel.angel_id}`}>{angel.name}</Link>
            </li>
          </ul>
        ))}
      </div>
      <button className="button-success" onClick={() => window.history.push('/angels/new')}>
        New Sonny Angel
      </button>
    </>
  );
};

export const AngelDetails: React.FC<{}> = () => {
  const { angel_id } = useParams<{ angel_id: string }>();
  const history = useHistory();
  
  const [angel, setAngel] = useState({
    angel_id: 0,
    collection_id: 0,
    name: '',
    description: '',
    image: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AngelService.get(Number(angel_id))
      .then((data) => setAngel(data))
      .catch((err) => setError('Error getting angel: ' + err.message));
  }, [angel_id]);

  return (
    <>|
    <div className="angel-details">
      {error && <div className="error-message">{error}</div>}
      
      <h2>{angel.name}</h2>
      
      <div className="detail-row">
        <strong>Name:</strong> <span>{angel.name}</span>
      </div>
      <div className="detail-row">
        <strong>Collection:</strong> <span>{angel.collection_id}</span>
      </div>
      <div className="detail-row">
        <strong>Description:</strong> <span>{angel.description}</span>
      </div>
      <div className="detail-row">
        <strong>Image:</strong> 
        {angel.image && (
          <img
            src={angel.image}
            alt={angel.name}
            style={{ maxWidth: '200px', maxHeight: '200px' }}
          />
        )}
      </div>
      
      <button
        className="button-success"
        onClick={() => history.push(`/angels/${angel.angel_id}/edit`)}
      >
        Edit
      </button>
    </div>
    </>
  );
}
  
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
        className="button-success" 
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
  const [post, setPost] = useState<Post>({ post_id: 0, user_id: 0, title: '', content: '', img: '' });
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
    <div className="post-details">
      {error && <div className="error-message">{error}</div>}

      <h2>{post.title}</h2>
      <div className="post-content">
        <p><strong>Title:</strong> {post.title}</p>
        <p><strong>Content:</strong> {post.content}</p>
        <p><strong>Image:</strong></p>
        <img src={post.img} alt={post.title} style={{ maxWidth: '200px', maxHeight: '200px' }} />
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
    </>
  );
};

export const PostNew: React.FC<{}> = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [img, setImg] = useState('');
  const [user_id, setUserId] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    if (name === 'title') {
      setTitle(value);
    } else if (name === 'content') {
      setContent(value);
    } else if (name === 'img') {
      setImg(value);
    }
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setUserId(Number(event.target.value));
  };

  const handleCreatePost = () => {
    PostService
      .create(title, user_id, content, img)
      .then((post_id) => {
        window.location.href = `/posts/${post_id}`; // Redirect to the new post page
      })
      .catch((error) => setError('Error creating post: ' + error.message));
  };

  return (
    <>
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
          id="img"
          name="img"
          value={img}
          onChange={handleInputChange}
          rows={10}
          className="form-control"
        />
      </div>

      <button 
        className="btn btn-success" 
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
    img: ''
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
    PostService
      .updatePost(post.post_id, post.title, post.content, post.img)
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
        <label htmlFor="img">Image URL:</label>
        <textarea
          id="img"
          name="img"
          value={post.img}
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


export const SeriesDetails: React.FC<{}> = () => {
  const [Series, setSeries] = useState<Series[]>([]);

  useEffect(() => {
    
  })
}
export const Popular: React.FC<{}> = () => {
  
}

export const Trading: React.FC<{}> = () => {
  
}



export const Login: React.FC<{}> = () => {
    return (
        <>
        <div className="login">
            <div className="card">
                <div className="left">
                    <h1>Sign In</h1>
                    <p>Sign in to your account to continue</p>
                    <span>Don't have an account?</span>
                    <Link to="/register">
                    <button>Create account</button>
                    </Link>
                </div>
                <div className="right">
                    <h1>Log in</h1>
                    <form>
                        <input type="text" placeholder="Username" />
                        <input type="password" placeholder="Password" />
                        <button>Log in</button>
                    </form>
                </div>
            </div>
        </div>
        </>
    );
    };


const Register = () => {
    return (
      <>
        <div className="register">
            <div className="card">
                <div className="right">
                    <h1>Register here:</h1>
                    <form>
                        <input type="text" placeholder="Name" />
                        <input type="text" placeholder="Username" />
                        <input type="email" placeholder="Email" />
                        <input type="password" placeholder="Password" />
                        <button>Register</button>
                    </form>
                </div>
                
                <div className="left">
                    <h1>Join the Sonny Angel wiki</h1>
                    <span>Already have an account?</span>
                    <Link to="/login">
                    <button>Log in</button>
                    </Link>
                </div>
                
            </div>
        </div>
        </>
    );
    };

export default Register; 

const Footer =() => {
    return (
    <>
      <footer className="footer">
        <p>&copy; 2024 Sonny Angel Wiki. All rights reserved.</p>
      </footer>
    </>
    );
  }