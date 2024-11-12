import { Link, useHistory, useParams } from "react-router-dom";
import React from "react";
import {useState, useEffect, useRef} from "react";

import { Navbar, Leftbar, Footer } from "./other-components";
import RegisterService from "../services/register-service";

export const Register: React.FC = () => {
   const [username, setusername] = useState<string>("");
   const [email, setEmail] = useState<string>("");
   const [password, setPassword] = useState<string>("");
   const [error, setError] = useState<string | null>(null);
   const history = useHistory(); //dette kommer av nettsiden jeg linker nå, gidder ikke kildeføring: https://gauravjoshi.hashnode.dev/building-a-system-for-user-registration-and-login-using-typescript-part-2

//Håndtering av registrering
    const handleRegister = (e: React.FormEvent)

const password_hash = password;
};


/*export const Register = () => {
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
    };*/


