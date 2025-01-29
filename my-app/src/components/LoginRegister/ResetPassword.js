import React from "react";
import "./ResetPassword.css";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const Navigate = useNavigate();
  return (
    <div className="reset-container">
      <div className="reset-box">
        <h2>Reset Password</h2>
        <p>
          Enter your email address and we'll send you instructions to reset your
          password.
        </p>
        <form>
          <div className="input-group">
            <input type="email" placeholder="Enter your email" required />
          </div>
          <button type="submit" className="reset-btn">
            SEND RESET INSTRUCTIONS
          </button>
        </form>
        <p className="back-login">
          Remember your password? <a onClick={()=>Navigate('/LoginForm')}>Back to Login</a>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
