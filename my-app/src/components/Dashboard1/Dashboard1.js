/*import React, { useEffect, useState } from 'react';
import './Dashboard1.css';

const Dashboard1 = () => {
    const [gender, setGender] = useState("");
    useEffect(() => {
        // Simulate fetching gender from login data
        const storedGender = localStorage.getItem("gender") || "Boy"; // Default to "boy"
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
    <div style={{ backgroundColor: backgroundColor }}>
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

export default Dashboard1;*/

import React, { useEffect, useState, useRef } from 'react';
import './Dashboard1.css';

const Dashboard1 = () => {
  const [gender, setGender] = useState("");
  const [userInput, setUserInput] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatLogRef = useRef(null);
  const currentlyPlayingAudio = useRef(null);

  useEffect(() => {
    // Simulate fetching gender from login data
    const storedGender = localStorage.getItem("gender") || "Boy"; // Default to "boy"
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

  const sendRequest = async () => {
    if (!userInput) {
      alert("Please enter a question.");
      return;
    }

    setIsSubmitting(true);

    // Append user input to chat log
    setChatLog((prevChatLog) => [
      ...prevChatLog,
      { type: 'user', message: `You: ${userInput}` },
    ]);

    // Clear the input field
    setUserInput('');

    try {
      console.log("Sending request to http://localhost:5000/chat with content:", userInput);
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: userInput }),
      });

      console.log("Received response:", response);

      if (response.ok) {
        const json = await response.json();
        console.log("Response JSON:", json);

        // Append Llama's response to chat log
        setChatLog((prevChatLog) => [
          ...prevChatLog,
          { type: 'llama', message: `mentor: ${json.message}`, audio: json.audio },
        ]);

        // Scroll to the bottom of the chat log
        chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
      } else {
        const error = await response.json();
        console.error("Server Error:", error);
        alert("Error: " + error.error);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("A network error occurred. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserInput(transcript);
    };

    recognition.onerror = (event) => {
      alert("Voice input error: " + event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div style={{ backgroundColor: backgroundColor }}>
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
          <input
            type="text"
            className="message-input"
            placeholder="Ask me anything..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <div className="message-icons">
            <div className="message-icon" title="Image upload">🖼️</div>
            <div className="message-icon" title="Voice input" onClick={startVoiceInput}>
              {isListening ? "Listening..." : "🎤"}
            </div>
          </div>
          <button className="send-button" onClick={sendRequest} disabled={isSubmitting}>
            <span className="send-icon">➜</span>
          </button>
        </div>

        <div id="chatLog" className="chat-log" ref={chatLogRef}>
          {chatLog.map((entry, index) => (
            <div key={index} className={`message ${entry.type}-message`}>
              {entry.message}
              {entry.audio && (
                <audio
                  src={`data:audio/wav;base64,${entry.audio}`}
                  controls
                  onPlay={(e) => {
                    if (currentlyPlayingAudio.current && currentlyPlayingAudio.current !== e.target) {
                      currentlyPlayingAudio.current.pause();
                      currentlyPlayingAudio.current.currentTime = 0;
                    }
                    currentlyPlayingAudio.current = e.target;
                  }}
                />
              )}
            </div>
          ))}
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