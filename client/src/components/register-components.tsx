import { Link, useHistory, useParams } from "react-router-dom";
import React from "react";
import {useState, useEffect, useRef} from "react";
import { createHashHistory } from 'history';

import { Navbar, Leftbar, Footer } from "./other-components";
import RegisterService from "../services/register-service";

 export const Register: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState<{ [key: string]: string }>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const history = useHistory(); //dette kommer av nettsiden jeg linker nå, gidder ikke kildeføring: https://gauravjoshi.hashnode.dev/building-a-system-for-user-registration-and-login-using-typescript-part-2


//setter opp et valideringskjema
 const ValidateForm = async ():Promise<boolean> => {
    let isValid = true;
    const errors: { [key: string]: string } = {};

        if (username.length < 3 || username.length > 20) {
            errors.username = "Username must be between 3 and 20 characters.";
            isValid = false;
        }

        if(!/\S+@\S+\.\S+/.test(email)){
            errors.email = "You have an invalid email format";
            isValid = false;
        }

        if(password.length < 6 || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*?])/.test(password)){
            errors.password = "Password must have at least 6 characters with uppercase, lowercase, numbers, and special characters.";
            isValid = false;
        }
        if (password !== confirmPassword){
            errors.confirmPassword = "Passwords do not match";
            isValid = false;
        }
         setError(errors);
         return isValid;      
    };

    const handleRegister = async () => {
        const isFormValid = await ValidateForm();
        if (isFormValid) {
            try {
                await RegisterService.registerUser(username, email, password);
                setSuccessMessage("Registration successful");
                history.push("/login");
            } catch (error) {
                console.error("Registration Error:", error);
                setError({ form: "Registration failed, please try again" });
            }
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {error["form"] && <p style={{ color: "red" }}>{error["form"]}</p>}
            
            <input
                type="text"
                value={username}
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
            />
            {error["username"] && <p style={{ color: "red" }}>{error["username"]}</p>}
            
            <input
                type="email"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />
            {error["email"] && <p style={{ color: "red" }}>{error["email"]}</p>}
            
            <input
                type="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />
            {error["password"] && <p style={{ color: "red" }}>{error["password"]}</p>}
            
            <input
                type="password"
                value={confirmPassword}
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error["confirmPassword"] && <p style={{ color: "red" }}>{error["confirmPassword"]}</p>}
            
            <button type="button" onClick={handleRegister}>Register</button>
            
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        </div>
    );
};





// export default Register;


 //sjekker om brukeren allerede eksisterer
    /*const checkUserExists = async () => {
    try {
        const exists = await RegisterService.checkUserExists(username, email);
        return exists;
    }catch (error){
        console.error("Error checking user existens:", error);
        return false;
    }
    }; */

 //Håndtering av registrering
    /*const handleRegister =  (e: React.FormEvent) => {
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

    /*if(await ValidateForm()){
        try{
            await RegisterService.registerUser(username, email, password);
            setSuccessMessage("Registration successful");
            history.push("/login");
        }catch(error) {
            console.error("Registration Error:", error);
            setError({ form: "Registration failed, please try again"});
        }
    } */ 