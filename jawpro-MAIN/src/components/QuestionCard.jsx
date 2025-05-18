import React from 'react';
import './QuestionCard.css';

function QuestionCard({ question }) {
  return (
    <div className="question-card">
      <p>{question}</p>
    </div>
  );
}

export default QuestionCard;
