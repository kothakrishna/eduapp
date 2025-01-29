import React, { useState } from 'react';
import './QuestionForm.css';

const QuestionForm = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setAnswer(null);

    try {
      const response = await fetch('http://127.0.0.1:5000/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      if (data.answer) {
        setAnswer(data);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('An error occurred while fetching the answer. Please try again later.');
    }
  };

  return (
    <div className="question-form-container">
      <h2>Ask a Question</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="question"
          placeholder="Enter your question"
          value={question}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Submit</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {answer && (
        <div className="answer-container">
          <h3>Answer:</h3>
          <p>{answer.answer}</p>
          <h4>Confidence: {answer.confidence.toFixed(2)}</h4>
          <pre>{answer.context}</pre>
        </div>
      )}
    </div>
  );
};

export default QuestionForm;