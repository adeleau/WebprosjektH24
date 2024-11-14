<<<<<<< HEAD
=======
import { Link, useHistory, useParams } from "react-router-dom";
import React from "react";
import {useState, useEffect, useRef} from "react";
const history = useHistory();

import { Navbar, Leftbar, Footer } from "./other-components";
import LoginService from "../services/login-service";


export const Login: React.FC = () => {
    const[username, setUsername] = useState<string>("");
    const[password, setPassword] = useState<string>("");
    const[error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await LoginService.loginUser(username, password);
            console.log("Login succes:", response);
            history.push("/Home");  
        } catch (error){
            console.error("Login failed:" , error);
            setError("Invalid Username or password"); 
        }
    };

    return (
        <div className="login">
            <div className="card">
                <div className="left">
                    <h1>Sign in </h1>
                    <p>Sign in to your account to continue</p>
                    <span>Dont have an account</span>
                    <Link to="/register">
                        <button>Create Account</button>
                    </Link>
                </div>
                <div className = "right">
                    <h1>Log in</h1>
                    <div>
                        <input type="text" value={username} placeholder="Username" onChange={(e) => setUsername(e.target.value)}/>
                        <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                    <button type="button" onClick={handleLogin}>Login</button>
                    </div>
                </div>
            </div>

        </div>
    )

} 






/*
export const Login: React.FC<{}> = () => {
    return (
        <>
    <Navbar></Navbar>
    <Leftbar></Leftbar
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
    };*/

   
    
>>>>>>> ea9568b9e0e0af8d7541ea818614bab01a72e757
