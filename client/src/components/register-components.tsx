import { Link, useHistory, useParams } from "react-router-dom";
import React from "react";
import {useState, useEffect, useRef} from "react";
import { createHashHistory } from 'history';


import { Navbar, Leftbar, Footer } from "./other-components";
import RegisterService from "../services/register-service";

 export const Register: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password_hash, setPasswordHash] = useState<string>("");
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

        if(password_hash.length < 6 || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*?])/.test(password_hash)){
            errors.password_hash = "Password must have at least 6 characters with uppercase, lowercase, numbers, and special characters.";
            isValid = false;
        }
        if (password_hash !== confirmPassword){
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

                

                await RegisterService.registerUser(username, email, password_hash);
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
                value={password_hash}
                placeholder="Password"
                onChange={(e) => setPasswordHash(e.target.value)}
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