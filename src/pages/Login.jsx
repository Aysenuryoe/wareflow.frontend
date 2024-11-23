import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const validateEmail = (email) => {
    const re = /^\S+@\S+\.\S+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    let valid = true;

    if (!email) {
      setEmailError("Email is required.");
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      valid = false;
    }

    if (!valid) {
      return;
    }

    try {
      const response = await fetch(`https://localhost:3001/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid login data.");
      }

      const data = await response.json();
      login(data.token, data.user);
      navigate("/");
    } catch (err) {
      setGeneralError(err.message);
    }
  };

  return (
    <div className="login">
      <form className="login__form" onSubmit={handleSubmit} noValidate>
        <h2 className="login__title">Login</h2>
        {generalError && (
          <div className="login__error login__error--general">{generalError}</div>
        )}

        <div className="login__input-group">
          <label htmlFor="email" className="login__label">Email</label>
          <input
            type="email"
            id="email"
            placeholder="example@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-describedby="email-error"
            className={`login__input ${emailError ? "login__input--error" : ""}`}
          />
          {emailError && (
            <span id="email-error" className="login__error login__error--email">
              {emailError}
            </span>
          )}
        </div>

        <div className="login__input-group">
          <label htmlFor="password" className="login__label">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-describedby="password-error"
            className={`login__input ${passwordError ? "login__input--error" : ""}`}
          />
          {passwordError && (
            <span id="password-error" className="login__error login__error--password">
              {passwordError}
            </span>
          )}
        </div>

        <button className="login__button login__button--submit" type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;