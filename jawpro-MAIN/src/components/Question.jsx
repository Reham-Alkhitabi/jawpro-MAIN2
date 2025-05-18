import React, { useState, forwardRef, useImperativeHandle } from 'react';

const Question = forwardRef(({ question, options, answer }, ref) => {
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  useImperativeHandle(ref, () => ({
    isAnswered: () => selected !== null,
    validate: () => {
      if (selected === null) return 'unanswered';

      const correct = selected === answer;
      setIsCorrect(correct);
      setShowFeedback(true);

      // Clear incorrect after brief delay
      if (!correct) {
        setTimeout(() => {
          setSelected(null);
          setShowFeedback(false);
        }, 1000);
      }

      return correct;
    },
  }));

  return (
    <div style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
      <p style={{ fontWeight: '600' }}>{question}</p>
      {options.map((opt, i) => (
        <div key={i}>
          <label>
            <input
              type="radio"
              name={question}
              value={opt}
              checked={selected === opt}
              onChange={() => setSelected(opt)}
              disabled={showFeedback && isCorrect}
            />
            {' '}{opt}
          </label>
        </div>
      ))}
      {showFeedback && (
        <p style={{
          marginTop: '0.5rem',
          color: isCorrect ? 'green' : 'red',
          fontWeight: 500
        }}>
          {isCorrect ? 'Correct' : 'Incorrect'}
        </p>
      )}
    </div>
  );
});

export default Question;
