import React, { useRef, useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import Question from './Question';
import './Accordion.css';

const AccordionTask = ({ taskNumber, title, questions, onSubmit, passed, description, relatedTopics }) => {
  const questionRefs = useRef([]);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const unanswered = questionRefs.current.some(ref => !ref?.isAnswered?.());
    if (unanswered) {
      setError('Please answer all questions before submitting.');
      return;
    }

    const results = questionRefs.current.map(ref => ref?.validate?.());
    const allCorrect = results.every(r => r === true);

    if (!allCorrect) {
      setError('Some answers were incorrect. Try again.');
      onSubmit(false);
    } else {
      setError('');
      onSubmit(true);
    }
  };

  return (
    <div className={`accordion-item ${passed ? 'accordion-passed' : ''}`}>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="accordion-header">
              <div className="accordion-left">
                <span className="task-label">Task {taskNumber}</span>
                <span className="task-title">{title}</span>
              </div>
              <ChevronDownIcon
                className={`accordion-arrow ${open ? 'rotate' : ''}`}
              />
            </Disclosure.Button>

            <Disclosure.Panel className="accordion-panel">
              {description && (
                <div className="task-description">
                  <p>{description}</p>
                </div>
              )}

              {questions.map((q, idx) => (
                <Question
                  key={idx}
                  question={q.question}
                  options={q.options}
                  answer={q.answer}
                  ref={(el) => (questionRefs.current[idx] = el)}
                />
              ))}

              {error && (
                <p style={{ color: 'red', fontWeight: 500, marginTop: '0.75rem' }}>{error}</p>
              )}

              <div style={{ marginTop: '1rem' }}>
                <button
                  onClick={handleSubmit}
                  disabled={passed}
                  className={`submit-button ${passed ? 'disabled' : ''}`}
                >
                  {passed ? 'Completed' : 'Submit Section'}
                </button>
              </div>

              {passed && relatedTopics && (
                <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#555' }}>
                  <strong>Related Topics:</strong> {relatedTopics.join(', ')}
                </div>
              )}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default AccordionTask;
