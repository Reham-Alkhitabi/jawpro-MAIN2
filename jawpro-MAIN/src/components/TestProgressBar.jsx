import React from 'react';
import './TestProgressBar.css';

function TestProgressBar({ currentQuestion, totalQuestions }) {
  const progressPercentage = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="test-progress-bar">
      <div
        className="test-progress-bar-fill"
        style={{ width: `${progressPercentage}%` }}
      ></div>
    </div>
  );
}

export default TestProgressBar;
