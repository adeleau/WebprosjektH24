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
    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();

        RegisterService.registerUser(username,email, password)
            .then((data) => {
                console.log("Successful registration:", data);
                history.push("/login");
            })
            .catch((error) => {
                setError("Registration failed, you may try again.");
                console.error("Registration error:", error.message);
            });
    }
   
return (
    <div>
        <input type="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
        <input type="text" value={username} placeholder="Username" onChange={(e) => setUsername(e.target.value)}/>
        <input type="text" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
        <button type="Registrer" onClick={handleRegister}>Register</button>
    </div>
)
}

export default Register;

   /*{axios.post(litt usikker hva jeg skal sette inn her, det skal være en path ,{
            username, email, password,
        })
        .then((response) => {
            console.log(response.data);
            navigate("/login")
        })
        .catch((error) => {
            console.log(error.message);
        })
    }*/




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


