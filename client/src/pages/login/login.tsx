import { Link } from "react-router-dom";
import React from "react";
import "./login.css";
import userService from "src/angel-service";


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

