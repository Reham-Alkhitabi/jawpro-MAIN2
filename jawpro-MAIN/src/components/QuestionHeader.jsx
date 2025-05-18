import React from 'react';

function QuestionHeader({ current, total }) {
  return (
    <div className="question-header">
      <h2  className="question-header-h2">
        Question {current} of {total}
      </h2>
    </div>
  );
}

export default QuestionHeader;