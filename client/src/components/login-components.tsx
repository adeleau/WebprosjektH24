import { Link, useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import type { User } from "../services/user-service";
import Cookies from "js-cookie"; 
import userService from "../services/user-service";


export const Login: React.FC = () => {
  const history = useHistory();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      if (username && password) {
        const userLoggedIn = await userService.login(username, password);
        if (userLoggedIn) {
          setUser(await userService.getByUsername(username));
        } else {
          setError("Invalid Username or Password");
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  useEffect(() => {
    if (user) {
      Cookies.set("user", JSON.stringify(user), { domain: "localhost" });
      history.push("/");
    } else {
      Cookies.set("user", "guest", { domain: "localhost" });
    }
  }, [user, history]); //Using cookies since this is a method that works for remembering users
  //This is valuable for us since we have users with admin privleges
  //sources used:
  //Chikari, M (14.04.23), Setting and Using Cookies in React, Clerk: https://clerk.com/blog/setting-and-using-cookies-in-react
   //Djirdeh, H (24.10.23), React Basics: How to Use Cookies in React, KendoReact: https://www.telerik.com/blogs/react-basics-how-to-use-cookies 
   

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Sign In</h1>
          <p>Sign in to your account to continue</p>
          <span>Don't have an account?</span>
          <Link to="/register">
            <button>Create Account</button>
          </Link>
        </div>
        <div className="right">
          <h1>Log in</h1>
          <div>
            <input
              type="text"
              value={username}
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="login-btn" onClick={handleLogin}>
              Login
            </button>
            {error && <p className="error-message">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
