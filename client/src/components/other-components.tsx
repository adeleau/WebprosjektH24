import { Link, useHistory, useParams } from "react-router-dom";
import React from "react";
import {useState, useEffect, useRef } from "react";
import SeriesService from "../services/series-service";
import type { Series } from "../services/series-service";
import AngelService, {Angel} from "../services/angel-service";
import userService from "../services/user-service";
import type { User } from "../services/user-service";
import Cookies from "js-cookie";

// Renders the Homepage
export const Home: React.FC<{}> = () => {
    return (
      <>
      <Navbar />
      <Leftbar />
        <div className="home-content">
          <div className="home-text">
          </div>
          <div className="home-image">
            <img src="https://www.sonnyangel.com/renewal/wp-content/uploads/2021/10/sa_christmas2021_banner.jpg"/>
          </div>
            <h2>INFORMATION</h2>
          <div className="home-information">
            <div className="info-item">
              <p className="date">05.11.2024</p>
              <p className="text">Enjoy a dreamy christmas with Sonny Angel</p>
            </div>
          <div className="info-item">
            <p className="date">15.10.2024</p>
            <p className="text">Enjoy decoration with your new Sonny Angel Stickers</p>
          </div>
          <div className="home-image">
            <img src="https://www.sonnyangel.com/renewal/wp-content/uploads/2024/05/photo_contest_2024_banner.png"/>
            <img src= "https://www.sonnyangel.com/renewal/wp-content/uploads/2024/06/banner_vote-2024.png"/>
          </div>
        </div>
        </div>
        <Footer />
        </>
      );
}

// Renders the Sonny Angel About page
export const About: React.FC<{}> = () => {
    return (
        <>
        <Navbar />
        <Leftbar />
        <div className="about-container">

          <div className="about-section">
            <div className="about-text">
              <h2>He may bring you happiness.</h2>
              <hr className="about-divider" />
                <p className="pink-bold">
                  Sonny Angel is a little angel boy who likes wearing all sorts of headgear.
                  He is always by your side to make you smile. Sonny Angel will provide
                  healing moments in your everyday life. He is a welcome sight at the
                  entrance to your home, next to your bed, on your desk, and so many other
                  places. 20 years have passed since the birth of Sonny Angel, who was born 
                  to make us all smile and add a little fun to our lives. From the corner of a 
                  room to a prominent display on a shelf, he has been delivering smiles and healing 
                  all around the world.
                    <strong> Embrace these healing figures in your life.</strong>
                </p>
            </div>
            <div className="about-image">
              <img
                src="https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/180907_0170_-2.jpg" 
                alt="Sonny Angel Figurines" 
              />
            </div>
          </div>

          <div className="about-section">
            <div className="about-image">
              <img
                src="https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/180907_0261_2cus.jpg" 
                alt="Sonny Angel Figurines" 
              />
            </div>
            <div className="about-text">
              <h2>Try your luck.</h2>
              <hr className="about-divider" />
              <p className="pink-bold">
                The major feature of Sonny Angel Mini Figures is that each series is comprised of 12 different figures. 
                Sonny Angel utilizes blind box packaging; you do not know which figure you will receive until you buy 
                one and open the box. Unboxing Sonny Angel adds to the excitement and fans get pleasure from collecting 
                them all. The wonder of meeting your Sonny Angel is waiting for you. Each series also has a 
                <strong>secret figure</strong>, which are randomly included in certain boxes and are the most collectible. 
                Robby Angel is a good friend of Sonny Angel. He can change his body color at any time, like a chameleon, 
                and he likes to dress up.
              </p>
            </div>
          </div>

          <div className="about-section">
            <div className="about-text">
              <h2>All started from 18cm.</h2>
              <hr className="about-divider" />
              <p className="pink-bold">
                The first mini figure series “Animal Series Ver. 1” was released with Sonny Angel wearing animal headgear. 
                To date, more 1,300 types of figures were born. Currently, Sonny Angel is sold in 33 countries. As an 
                interior design element or a world traveling companion. Sonny Angel is not just a decorative figure. 
                He is a very photogenic buddy for social media posts and his presence provides smiles and a sense of 
                well-being and healing to fans around the world. Each of us finds unique ways to enjoy Sonny Angel.
              </p>
            </div>
            <div className="about-image">
              <img
                src="https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/sa_original_image-1-768x512.jpg" 
                alt="Sonny Angel Figurines" 
              />
            </div>
          </div>
        </div>
      <Footer />
    </>
  );
};

//Renders the Navbar 
export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Angel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User| Partial<User>>();
  const history = useHistory();

  useEffect(() => {
    if (Cookies.get("user") !== "guest") {
      const stringifiedUser = Cookies.get("user");
      if(stringifiedUser !== undefined){

        setUser(JSON.parse(stringifiedUser))
      }
      if (stringifiedUser === undefined) {
        console.log(stringifiedUser); 
        const partialUser: Partial<User> = {};
        setUser(partialUser);
      }
    }
  }, [])

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query) {
      setResults([]);
      return;
    }

    try {
      const searchResults: Angel[] = await AngelService.search(query);
      setResults(searchResults);
      setError(null);
    } catch (error) {
      setResults([]);
      setError('Error fetching search results');
    }
  };

  const handleSearch = () => {
    if (searchQuery) {
      history.push(`/search/${searchQuery}`);
      setResults([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <div className="navbar">
        <div className="navbar_search">
          <input 
            type="text" 
            placeholder="Search..."
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          {searchQuery && (
            <div className="search-results">
              {results.length > 0 && results.map((angel) => (
                <div key={angel.angel_id} className="result-item">
                  <a href={`/#/angels/${angel.angel_id}`}>{angel.name}</a>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="navbar_logo-container">
          <Link to="/">
            <img 
              src="https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/SonnyAngel_logo.png" 
              alt="Main Logo" 
              className="navbar_logo" 
            />
          </Link>
        </div>

        <div className="navbar_profile">
          {user ? (
            <div className="user">
            <img 
              src={user.profile_picture || "https://wallpapers-clan.com/wp-content/uploads/2024/10/sonny-angel-pfp-02.jpg"} 
              alt="User" 
              className="profile-image"
            />
            <Link to="/userprofile" className="user-link">
              <span>{user.username || 'Loading'}</span>
            </Link>
          </div>
          ) : (
            <Link to="/login" className="login-link">
              Log in
            </Link>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
    </>
  );
};

//Renders the Search page
export const SearchPage = () => {
  const { searchQuery } = useParams<{ searchQuery: string }>();
  const [results, setResults] = useState<Angel[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (searchQuery) {
      AngelService.search(searchQuery) 
        .then((data) => {
          setResults(data);
          setError('');
        })
        .catch((err) => {
          setError('No results found or error occurred.');
        });
    }
  }, [searchQuery]);

  return (
    <>
    <Navbar />
    <Leftbar />
    <div className="series-page">
      {searchQuery && (
        <div>
          <h1>Search Results for: {searchQuery}</h1>
          <div className="search-header-line"></div> 
        </div>
      )}

      {error && <p>{error}</p>}

      <div className="angel-cards">
        {results.length > 0 ? (
          results.map((angel) => (
            <div key={angel.angel_id} className="angel-card">
              <Link to={`/angels/${angel.angel_id}`} className="angel-card-link">
                <img
                  src={angel.image}
                  alt={angel.name}
                  className="angel-card-image"
                />
                <h3>{angel.name}</h3>
              </Link>
            </div>
          ))
        ) : (
          <p>No content found for this search.</p>
        )}
      </div>
    </div>
    <Footer></Footer>
    </>
  );
};

//Renders the Leftbar
export const Leftbar: React.FC<{}> = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [series, setSeries] = useState<Array<Series>>([]);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const serieslist = await SeriesService.getAll();

        if (serieslist) {
          setSeries(serieslist.map((series) => series));
        } else {
          console.log('No series available');
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSeries();
  }, []);

  const toggleSidebar: () => void = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (isDropdownOpen) setIsDropdownOpen(false); // Close dropdown when closing sidebar
  };

  const toggleDropdown: () => void = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <div>
        <button
          className={`menu-toggle ${isSidebarOpen ? 'active' : ''}`}
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? 'X' : '≡'}
        </button>

        <nav className={`nav-menu ${isSidebarOpen ? 'active' : ''}`}>
          <Link to="/" onClick={toggleSidebar}>
            <img
              src="https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/sa_logo_pink.png"
              alt="Sidebar Logo"
              className="sidebar-logo"
            />
          </Link>

          <ul className="nav-menu-items">
            <li className="nav-text">
              <Link to="/masterlist" onClick={toggleSidebar}>
                Master List
              </Link>
            </li>
            <li className="nav-text">
              <Link to="/about" onClick={toggleSidebar}>
                About
              </Link>
            </li>
            <li className={`nav-text series ${isDropdownOpen ? 'active' : ''}`}>
              <span onClick={toggleDropdown}>
                Series {isDropdownOpen ? '↓' : '→'}
              </span>
              {isDropdownOpen && (
                <ul className="dropdown-menu active">
                  {series.map((series, i) => (
                    <li key={i} className="nav-text">
                      <Link
                        to={`/series/${series.series_id}`}
                        onClick={toggleSidebar} 
                      >
                        {series.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li className="nav-text">
              <Link to="/popular" onClick={toggleSidebar}>
                Most Popular
              </Link>
            </li>
            <li className="nav-text">
              <Link to="/posts" onClick={toggleSidebar}>
                Community
              </Link>
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

// export const Popular: React.FC<{}> = () => {
  
// }

// export const Trading: React.FC<{}> = () => {
  
// }
//DISSE LIGGER VEL I DE ANDRE COMPONENTS?
// export const Login: React.FC<{}> = () => {
//     return (
//         <>
//         <div className="login">
//             <div className="card">
//                 <div className="left">
//                     <h1>Sign In</h1>
//                     <p>Sign in to your account to continue</p>
//                     <span>Don't have an account?</span>
//                     <Link to="/register">
//                     <button>Create account</button>
//                     </Link>
//                 </div>
//                 <div className="right">
//                     <h1>Log in</h1>
//                     <form>
//                         <input type="text" placeholder="Username" />
//                         <input type="password" placeholder="Password" />
//                         <button>Log in</button>
//                     </form>
//                 </div>
//             </div>
//         </div>
//         </>
//     );
//   };


// export const Register = () => {
//     return (
//       <>
//         <div className="register">
//             <div className="card">
//                 <div className="right">
//                     <h1>Register here:</h1>
//                     <form>
//                         <input type="text" placeholder="Name" />
//                         <input type="text" placeholder="Username" />
//                         <input type="email" placeholder="Email" />
//                         <input type="password" placeholder="Password" />
//                         <button>Register</button>
//                     </form>
//                 </div>
                
//                 <div className="left">
//                     <h1>Join the Sonny Angel wiki</h1>
//                     <span>Already have an account?</span>
//                     <Link to="/login">
//                     <button>Log in</button>
//                     </Link>
//                 </div>
                
//             </div>
//         </div>
//         </>
//     );
//     };


export const Footer =() => {
  const [isAtBottom, setIsAtBottom] = useState(false);

    return (
    <>
      <footer className="footer">
        <p>2024 Sonny Angel Wiki</p>
      </footer>
    </>
    );
  } 