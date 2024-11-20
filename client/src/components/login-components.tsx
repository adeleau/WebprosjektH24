import { Link, useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import type { User } from "../services/user-service";
import Cookies from "js-cookie";
import userService from "../services/user-service";

//Joshi,G.(03.2023), Building a System for User Registration and Login using TypeScript (Part 2 ), Building by learning: https://gauravjoshi.hashnode.dev/building-a-system-for-user-registration-and-login-using-typescript-part-2
//samme oppsett som for register
export const Login: React.FC = () => {
  const history = useHistory();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // samme nettside^, men med hjelp av Chat.gpt
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
    } else if (user==null){
      Cookies.remove("user"); 
    }
  }, [user, history]);

  //Oraro,P(23.09.23), Building A Simple React Login Form: A Step By Step Guide, DEV, https://dev.to/paulineoraro/building-a-simple-react-login-form-a-step-by-step-guide-17g1
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
