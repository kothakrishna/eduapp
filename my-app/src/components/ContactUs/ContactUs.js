import React from "react";
import "./ContactUs.css";

const ContactUs = () => {
  return (
    <div className="contact-section">
      <h1 className="section-title">Contact Us</h1>
      <div className="contact-container">
        {/* Left Side: Contact Form */}
        <form className="contact-form">
          <input type="text" placeholder="Name" className="form-input" />
          <input type="email" placeholder="Email" className="form-input" />
          <textarea placeholder="Message" className="form-textarea"></textarea>
          <button type="submit" className="send-button">Send Message</button>
        </form>

        {/* Right Side: Contact Info */}
        <div className="contact-info">
          <p><i className="fa fa-map-marker"></i> 123 AI Street, Tech City, TC 12345</p>
          <p><i className="fa fa-phone"></i> +1 (555) 123-4567</p>
          <p><i className="fa fa-envelope"></i> contact@aiautomation.com</p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
