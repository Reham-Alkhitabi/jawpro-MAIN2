import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TestProgressBar from '../components/TestProgressBar';
import QuestionHeader from '../components/QuestionHeader';
import QuestionCard from '../components/QuestionCard';
import LikertScaleOptions from '../components/LikertScaleOptions';
import questions from '../data/riasecQuestions';

function RiasecTestPage() {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = {
      ...currentQuestion,
      value,
    };
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      const scores = calculateRiasecScores(answers);
      localStorage.setItem('riasecScores', JSON.stringify(scores));
      navigate('/results', { state: { scores } });
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const calculateRiasecScores = (answers) => {
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    answers.forEach((answer) => {
      if (answer?.category != null && answer?.value != null) {
        scores[answer.category] += answer.value;
      }
    });
    return scores;
  };

  return (
    <div className="riasec-test-page">
      <TestProgressBar
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={questions.length}
      />
      <QuestionHeader
        current={currentQuestionIndex + 1}
        total={questions.length}
      />
      <QuestionCard question={currentQuestion.text} />
      <LikertScaleOptions
        selectedValue={answers[currentQuestionIndex]?.value ?? null}
        onSelect={handleAnswerSelect}
      />
      <div className="navigation-buttons">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={answers[currentQuestionIndex] == null}
        >
          {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
}

export default RiasecTestPage;
