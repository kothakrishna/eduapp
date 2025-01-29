import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "./Dashboard.css";
import micIcon from "C:/React1/my-app/src/mic-icon.png"; // Ensure you have a microphone icon image in the same directory
import ChatOllama from "../ChatOllama/ChatOllama";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user_name, role, related_user } = location.state;
  const [showChat, setShowChat] = useState(false);

  const handleLogout = () => {
    // Clear any stored user data (if any)
    // For example, you might clear localStorage or any state management store
    navigate("/LoginForm"); // Redirect to login page
  };

  return (
    <div className="dashboard-container">
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
      <div className="welcome-section">
        <h2>Welcome, {user_name}!</h2>
        <p>
          {role === "parent"
            ? `Your child: ${related_user}`
            : `Your parent: ${related_user}`}
        </p>
      </div>
      {role === "student" && (
        <div className="student-dashboard">
          <div className="left-panel">
            <img
              src={micIcon}
              alt="Mic"
              className="mic-icon"
              onClick={() => setShowChat(true)}
            />
          </div>
          <div className="right-panel">
            {showChat && <ChatOllama />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;