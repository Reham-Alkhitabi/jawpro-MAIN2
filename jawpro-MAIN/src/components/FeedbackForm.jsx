import React from 'react';
import './FeedbackForm.css';

function FeedbackForm({ feedback, onFeedbackChange }) {
  return (
    <div className="feedback-form">
      <textarea
        value={feedback}
        onChange={(e) => onFeedbackChange(e.target.value)}
        placeholder="Tell us your thoughts about this level..."
        rows={5}
      />
    </div>
  );
}

export default FeedbackForm;
