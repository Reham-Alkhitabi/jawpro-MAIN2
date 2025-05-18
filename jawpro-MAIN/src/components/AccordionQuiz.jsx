import React, { useRef, useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import Question from './Question';
import './Accordion.css';

const AccordionQuiz = ({ questions, onSubmit, passed }) => {
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
                <span className="task-label quiz">Final Quiz</span>
                <span className="task-title">Test Your Knowledge</span>
              </div>
              <ChevronDownIcon
                className={`accordion-arrow ${open ? 'rotate' : ''}`}
              />
            </Disclosure.Button>

            <Disclosure.Panel className="accordion-panel">
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

              <button
                onClick={handleSubmit}
                disabled={passed}
                className={`submit-button ${passed ? 'disabled' : ''}`}
                style={{ marginTop: '1rem' }}
              >
                {passed ? 'Quiz Completed' : 'Submit Quiz'}
              </button>

              <div className="section" style={{ marginTop: '2rem' }}>
                <h3 className="section-title">Recommended Next Topics</h3>
                <ul style={{ paddingLeft: '1.25rem', listStyleType: 'disc' }}>
                  <li>Probability distributions</li>
                  <li>Insurance mathematics</li>
                  <li>Intro to financial mathematics</li>
                  <li>Time value of money</li>
                  <li>Risk pooling principles</li>
                </ul>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default AccordionQuiz;
