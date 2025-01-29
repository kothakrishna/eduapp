import React, { useState } from "react";
import "./CreateAccount.css";
import { useNavigate } from "react-router-dom";

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    parentFirstName: "",
    parentLastName: "",
    email: "",
    phone: "",
    studentName: "",
    studentClass: "",
    schoolName: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/create_account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        navigate("/LoginForm");
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to create account. Please try again.");
    }
  };

  return (
    <div className="create-account-container">
      <div className="create-account-box">
        <h2>Create Your Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <input
              type="text"
              name="parentFirstName"
              placeholder="Parent First Name"
              value={formData.parentFirstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="parentLastName"
              placeholder="Parent Last Name"
              value={formData.parentLastName}
              onChange={handleChange}
              required
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="studentName"
            placeholder="Student Name"
            value={formData.studentName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="studentClass"
            placeholder="Student Class"
            value={formData.studentClass}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="schoolName"
            placeholder="School Name"
            value={formData.schoolName}
            onChange={handleChange}
            required
          />
          <div className="checkbox">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              I agree to the <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>
            </label>
          </div>
          <button type="submit" className="create-btn">
            Create Account
          </button>
        </form>
        <p className="already-account">
          Already have an account?{" "}
          <a href="#" onClick={() => navigate("/LoginForm")}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default CreateAccount;
