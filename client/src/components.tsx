import { Link } from "react-router-dom";
import React from "react";
import {useState, useEffect} from "react";
import SeriesService from "./services/series-service"
import type { Series } from "./services/series-service";
import AngelService from "./services/angel-service";
import type { Angel, AngelCardProps } from "./services/angel-service";
import PostService from "./services/post-service";
import type { Post } from "./services/post-service";



export const Home: React.FC<{}> = () => {
    return (
        <>
        <Navbar></Navbar>
        <Leftbar></Leftbar>
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
    <div>
      <button className={`menu-toggle ${isSidebarOpen ? 'active' : ''}`} onClick={toggleSidebar}>
        {isSidebarOpen ? 'X' : '≡'}
      </button>

      <nav className={`nav-menu ${isSidebarOpen ? 'active' : ''}`}>
        <img src="https://www.sonnyangel.com/renewal/wp-content/uploads/2018/10/sa_logo_pink.png" alt="Sidebar Logo" className="sidebar-logo" />

        <ul className="nav-menu-items">
          <li className="nav-text">
            <Link to="/master-list">Master List</Link>
          </li>
          <li className={`nav-text categories ${isDropdownOpen ? 'active' : ''}`}>
            <span onClick={toggleDropdown}>
              Categories {isDropdownOpen ? '↓' : '→'}
            </span>
            {isDropdownOpen && (
              <ul className="dropdown-menu active">
                {series.map((name, i) =>(
                    <li key={i} className = "nav-text">
                        <Link to = {`/categories/${name}`}>{name}</Link>
                    </li>
                ))}
              </ul>
            )}
          </li>
          <li className="nav-text">
            <Link to="/popular">Most Popular</Link>
          </li>
          <li className="nav-text">
            <Link to="/trading">Trading Site</Link>
          </li>
          <li className="nav-text">
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>
      {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </div>
  );
};

export const Menu: React.FC<{}> = () => {
    const [showDropDown, setShowDropDown] = useState<boolean>(false);

    return (
        <>

        
        </>
    )
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
    );
    };

export default Register; 