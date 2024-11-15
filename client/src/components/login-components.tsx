import { Link, useHistory, useParams } from "react-router-dom";
import React from "react";
import {useState, useEffect, useRef} from "react";
import { Navbar, Leftbar, Footer } from "./other-components";
import type { User } from "../services/user-service";
import Cookies from "js-cookie";
import userService from "../services/user-service";



export const Login: React.FC = () => {
    const history = useHistory();
    const[username, setUsername] = useState<string>();
    const [user, setUser] = useState<User | null>(null);
    const[password, setPassword] = useState<string>();
    const[error, setError] = useState<string | null>(null);

    const handleLogin = async () => {

        try {
            if(username && password) {
            const userLoggedin: boolean = await userService.login(username, password);
            console.log(userLoggedin);
            if (userLoggedin){
                window.alert("Login success")
                setUser(await userService.getByUsername(username));
            }
            else {
                window.alert("Login failed")
                setError("Invalid Username or password"); 
            }
        }
        } catch (error){
            console.error("Login failed:" , error);
        }
    };

    useEffect(() => {
        if (user) {
            Cookies.set("user", JSON.stringify(user), {domain: "localhost"})
            console.log(user)
            history.push("/");
            return;
        }
        else {
            Cookies.set("user",  "guest", {domain: "localhost"})
            console.log(Cookies.get("user"))
        }
    }, [user])

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
                        <input type="text" value={username} placeholder="Username" onChange={(e) => {setUsername(e.target.value); console.log("Det skrives")}}/>
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

   
    
