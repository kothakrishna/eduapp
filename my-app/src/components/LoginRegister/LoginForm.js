import React, { useState } from "react";
import "./LoginForm.css";
import { Navigate, useNavigate } from "react-router-dom";

const LoginForm = ({setIsLoggedIn}) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null); // To store any error messages
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Reset error

    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem("isLoggedIn", true); // Store login status in localStorage
        localStorage.setItem("gender",data.gender);
        setIsLoggedIn(true);
        navigate("/Dashboard1", { state: data }); // Navigate to the dashboard page with login data
      } else {
        setError(data.message); // Display error message
      }
    } catch (error) {
      setError("An error occurred while logging in. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login to Your Account</h2>
        <p>Access your AI automation dashboard and manage your solutions</p>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleInputChange}
            />
          </div>
          <div className="options">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <a
              href="#"
              className="forgot-password"
              onClick={() => navigate("/ResetPassword")}
            >
              Forgot Password?
            </a>
          </div>
          <button type="submit" className="login-btn">
            LOGIN
          </button>
          <div className="signup"><p>
            To Create account{" "}
            <a
              href="#"
              //className="signup"
              onClick={() => navigate("/CreateAccount")}
            >
              click Here
            </a>
          </p>
          </div>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default LoginForm;