import React from "react";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-us-section">
      <h1 className="section-title">About Us</h1>
      <p className="section-description">
        We are pioneers in AI automation, dedicated to transforming businesses
        through innovative solutions. With over a decade of experience, our
        team of experts combines deep technical knowledge with practical
        business acumen to deliver cutting-edge AI solutions that drive real
        results. Our mission is to democratize AI technology, making it
        accessible and practical for businesses of all sizes. We believe in
        creating sustainable, scalable solutions that grow with your business.
      </p>

      <div className="info-cards-container">
        <div className="info-card">
          <h3>Our Vision</h3>
          <p>
            To be the global leader in AI automation solutions, empowering
            businesses to achieve their full potential through intelligent
            technology.
          </p>
        </div>
        <div className="info-card">
          <h3>Our Mission</h3>
          <p>
            To deliver innovative AI solutions that transform businesses,
            enhance productivity, and create lasting value for our clients.
          </p>
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-box">
          <h2>500+</h2>
          <p>Projects Completed</p>
        </div>
        <div className="stat-box">
          <h2>98%</h2>
          <p>Client Satisfaction</p>
        </div>
        <div className="stat-box">
          <h2>50+</h2>
          <p>AI Experts</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
