import { useHistory } from "react-router-dom";
import React, { useState } from "react";
import RegisterService from "../services/register-service";


//Joshi,G.(03.2023), Building a System for User Registration and Login using TypeScript (Part 2 ), Building by learning: https://gauravjoshi.hashnode.dev/building-a-system-for-user-registration-and-login-using-typescript-part-2
//Brukt deler av strukturen for oppsettet til å bygge off for registreringen
export const Register: React.FC = () => {  
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const history = useHistory();

  const validateForm = async (): Promise<boolean> => {
    let isValid = true;
    const errors: { [key: string]: string } = {};

//Oraro,P(23.09.23), Building A Simple React Login Form: A Step By Step Guide, DEV, https://dev.to/paulineoraro/building-a-simple-react-login-form-a-step-by-step-guide-17g1
//For validering og oppsett av krav for passord
    if (username.length < 3 || username.length > 20) {
      errors.username = "Username must be between 3 and 20 characters.";
      isValid = false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Invalid email format.";
      isValid = false;
    }

    if (
      password.length < 6 ||
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(password)
    ) {
      errors.password =
        "Password must have at least 6 characters, including uppercase, lowercase, number, and special character.";
      isValid = false;
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    setError(errors);
    return isValid;
  };


  const handleRegister = async () => {
    const isFormValid = await validateForm();
    if (isFormValid) {
      try {
        await RegisterService.registerUser(username, email, password);
        setSuccessMessage("Registration successful!");
        setTimeout(() => history.push("/login"), 1500);
      } catch (error) {
        setError({ form: "Registration failed. Please try again." });
      }
    }
  };
  
//Denne delen er det brukt chat.gpt, men hjelp fra øvinger og følgende nettside:
//Pantoja, E (29.05.23), React Registration Form, Medium
  return (
    <div className="register">
      <div className="card">
        <h1>Register</h1>
        {successMessage && <p className="success-message">{successMessage}</p>}
        <div className="form-group">
          <input
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          {error.username && <p className="error-message">{error.username}</p>}
        </div>
        <div className="form-group">
          <input
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          {error.email && <p className="error-message">{error.email}</p>}
        </div>
        <div className="form-group">
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {error.password && <p className="error-message">{error.password}</p>}
        </div>
        <div className="form-group">
          <input
            type="password"
            value={confirmPassword}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error.confirmPassword && (
            <p className="error-message">{error.confirmPassword}</p>
          )}
        </div>
        <button className="btn-register" onClick={handleRegister}>
          Register
        </button>
        {error.form && <p className="error-message">{error.form}</p>}
      </div>
    </div>
  );
};
