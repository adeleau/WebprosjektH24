import { Link, useHistory, useParams } from "react-router-dom";
import React from "react";
import {useState, useEffect, useRef} from "react";

import { Navbar, Leftbar, Footer } from "./other-components";
import LoginService from "../services/login-service";



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

    export const Register = () => {
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
    
    
    