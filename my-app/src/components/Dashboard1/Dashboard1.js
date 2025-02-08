import React, { useEffect, useState } from 'react';
import './Dashboard1.css';

const Dashboard1 = () => {
    const [gender, setGender] = useState("");
    useEffect(() => {
        // Simulate fetching gender from login data
        const storedGender = localStorage.getItem("gender") || "boy"; // Default to "boy"
        setGender(storedGender);
      }, []);
    
      // Set background color dynamically
      const backgroundColor = gender === "Boy" ? "#23a6d5" : "#f7b7d7";
  useEffect(() => {
    // Add click animations to buttons
    document.querySelectorAll('.menu-button').forEach(button => {
      button.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
          this.style.transform = 'translateY(-5px)';
        }, 100);
      });
    });

    // Scroll arrows functionality
    const scrollArrows = document.querySelector('.scroll-arrows');
    const scrollTopBtn = document.getElementById('scrollTop');
    let fadeTimeout;

    // Function to start fade-out timer
    function startFadeTimer() {
      clearTimeout(fadeTimeout); // Clear any existing timeout
      fadeTimeout = setTimeout(() => {
        scrollArrows.classList.add('fade-out');
      }, 3000); // 3 seconds before starting fade
    }

    document.getElementById('gameButton').addEventListener('click', function() {
      // First apply the button animation
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        // Then redirect to the game portal
        window.location.href = 'https://game-portal-e25k.onrender.com';
      }, 200); // Short delay for animation
    });

    // Reset fade timer on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 200) {
        scrollArrows.classList.remove('fade-out');
        scrollArrows.classList.add('visible');
        startFadeTimer();
      } else {
        scrollArrows.classList.remove('visible');
      }
    });

    // Reset fade timer on hover
    scrollArrows.addEventListener('mouseenter', () => {
      clearTimeout(fadeTimeout);
      scrollArrows.classList.remove('fade-out');
    });

    scrollArrows.addEventListener('mouseleave', () => {
      startFadeTimer();
    });

    // Keep existing scroll to top functionality
    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }, []);

  return (
    <div className={`dashboard-container ${backgroundColor}`}>
      <div className="header">
        <div className="logo-section">
          <div className="logo" style={{ display: 'inline-block', verticalAlign: 'middle' }}>NOVA</div>
          <div className="subtitle">My Personal Mentor</div>
        </div>
        <div className="nav-icons">
          <div className="nav-item">
            <div className="nav-icon">📚</div>
            Subjects
          </div>
          <div className="nav-item">
            <div className="nav-icon">👨‍👩‍👦</div>
            Parents
          </div>
          <div className="nav-item">
            <div className="nav-icon">👶</div>
            Kids
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="ai-assistant">
          🤖
          <div className="status-indicator"></div>
        </div>
        <div className="progress-section">
          <div className="progress-icon" title="My progress">📊</div>
        </div>

        <div className="menu-container">
          <button className="menu-button">
            <span className="button-icon">🎓</span>
            IIT PREP
          </button>
          <button className="menu-button">
            <span className="button-icon">🌍</span>
            EXPLORER
          </button>
          <button className="menu-button">
            <span className="button-icon">🎨</span>
            HOBBIES
          </button>
          <button className="menu-button" id="gameButton">
            <span className="button-icon">🎮</span>
            GAMES
          </button>
          <button className="menu-button">
            <span className="button-icon">💬</span>
            CHAT
          </button>
        </div>

        <div className="chat-container">
          <input type="text" className="message-input" placeholder="Ask me anything..." />
          <div className="message-icons">
            <div className="message-icon" title="Image upload">🖼️</div>
            <div className="message-icon" title="Voice input">🎙️</div>
          </div>
          <button className="send-button">
            <span className="send-icon">➜</span>
          </button>
        </div>
      </div>

      <div className="scroll-arrows">
        <button className="scroll-arrow" id="scrollTop" title="Scroll to top">⬆️</button>
      </div>

      <div className="company-tag">
        <span className="icon">💻</span>
        Product of RUBIX IT SOLUTION
      </div>
    </div>
  );
};

export default Dashboard1;