import React from "react";
import "./Services.css";

const Services = () => {
  return (
    <div className="services-section">
      <h1 className="section-title">Our Services</h1>
      <p className="section-subtitle">
        Discover our comprehensive range of AI automation solutions designed to transform your business operations
      </p>

      <div className="services-container">
        <div className="service-card">
          <div className="icon">📊</div>
          <h3>Machine Learning Solutions</h3>
          <p>
            Custom ML models tailored to your specific business needs. Leverage predictive analytics, pattern recognition, and data-driven insights to make informed decisions.
          </p>
          <ul>
            <li>Predictive Analytics</li>
            <li>Pattern Recognition</li>
            <li>Custom Model Development</li>
          </ul>
        </div>

        <div className="service-card">
          <div className="icon">💬</div>
          <h3>Natural Language Processing</h3>
          <p>
            Transform how your business handles text and communication with our advanced NLP solutions. From chatbots to document analysis, we've got you covered.
          </p>
          <ul>
            <li>Chatbot Development</li>
            <li>Text Analysis</li>
            <li>Sentiment Analysis</li>
          </ul>
        </div>

        <div className="service-card">
          <div className="icon">⚙️</div>
          <h3>Process Automation</h3>
          <p>
            Streamline your operations with intelligent automation solutions that reduce manual work and increase efficiency.
          </p>
          <ul>
            <li>Workflow Automation</li>
            <li>RPA Integration</li>
            <li>Business Process Optimization</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Services;
