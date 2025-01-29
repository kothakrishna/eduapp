import React, { useState, useRef } from 'react';
import './ChatOllama.css';

const ChatOllama = () => {
  const [userInput, setUserInput] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatLogRef = useRef(null);
  const currentlyPlayingAudio = useRef(null);

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
          { type: 'llama', message: `Llama: ${json.message}`, audio: json.audio },
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
    <div className="container">
      <h1>Chat with Your Mentor</h1>
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
      <textarea
        id="userInput"
        placeholder="Enter your question..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />
      <div className="buttons">
        <button id="voiceButton" onClick={startVoiceInput} disabled={isListening}>
          {isListening ? "Listening..." : "🎤 Speak"}
        </button>
        <button id="submitButton" onClick={sendRequest} disabled={isSubmitting}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default ChatOllama;