import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import courseQuestions from "../../questions/index.js";
import { db, auth } from "../../utils/firebase.utils.js";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import alarmTimeUp from "/sounds/alarm-timeup.mp3";
import alarmOneMinute from "/sounds/alarm-1min.mp3";
import "./CourseTest.css";

const CourseTest = () => {
  const { courseId } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [markedQuestions, setMarkedQuestions] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(600);
  const [showResults, setShowResults] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [user] = useAuthState(auth);
  const alarmAudio = new Audio(alarmTimeUp);
  const oneMinuteAudio = new Audio(alarmOneMinute);

  const questions = courseQuestions[courseId] || [];

  useEffect(() => {
    if (timeLeft <= 0 && !showResults) {
      handleSubmit(); // Auto-submit when timer hits 0
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResults]);
  useEffect(() => {
    if (timeLeft === 60) {
      oneMinuteAudio.play();
    }

    if (timeLeft === 0 && !showResults) {
      alarmAudio.play();
      handleSubmit(); // Auto-submit with sound
    }
  }, [timeLeft]);

  const handleAnswerSelect = (index) => {
    setSelectedAnswers({ ...selectedAnswers, [currentIndex]: index });
  };

  const handleSubmit = async () => {
    const score = calculateScore();
    setShowResults(true);
  
    if (!user) return;
  
    const userResultsRef = doc(
      db,
      "users",
      auth.currentUser.uid,
      "testResults",
      courseId // one document per course
    );
  
    await setDoc(userResultsRef, {
      courseId,
      score,
      totalQuestions: questions.length,
      percentage: ((score / questions.length) * 100).toFixed(2),
      answers: selectedAnswers,
      durationTaken: 600 - timeLeft,
      timestamp: serverTimestamp(),
    });
  };
  
  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        score += 1;
      }
    });
    return score;
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowReviewModal(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleGoToQuestion = (index) => {
    setCurrentIndex(index);
  };

  const handleRetest = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setMarkedQuestions(new Set());
    setTimeLeft(600);
    setShowResults(false);
    setShowReviewModal(false);
  };

  if (!questions.length)
    return (
      <p className="CourseTest-P">No test available for this course.</p>
    );

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="CourseTest-results">
        <h1 className="CourseTest-h1">Test Results</h1>
        <p className="CourseTest-scored">
          You scored {score} out of {questions.length}
        </p>
        <p className="CourseTest-Percentage">
          Percentage: {((score / questions.length) * 100).toFixed(2)}%
        </p>
        <button
          onClick={handleRetest}
          className="CourseTest-button-retake"
        >
          Retake Test
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="CourseTest-container">
      {/* Header */}
      <div className="CourseTest-layout">
        <div>
          <h1 className="CourseTest-h1">Course Test</h1>
          <p className="CourseTest-Course">
            Course: {courseId.replaceAll("-", " ")}
          </p>
        </div>
        <div className="CourseTest-text-right">
          <p className="CourseTest-Time">
            Time Left: {minutes}:{seconds < 10 ? "0" : ""}
            {seconds}
          </p>
        </div>
      </div>

      {/* Question Panel */}
      <div className="CourseTest-Question-Panel">
        {questions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleGoToQuestion(idx)}
            className={`w-8 h-8 rounded-full text-sm font-bold ${
              currentIndex === idx
                ? "bg-yellow-400"
                : markedQuestions.has(idx)
                ? "bg-purple-400"
                : selectedAnswers[idx] !== undefined
                ? "bg-green-400"
                : "bg-gray-300"
            }`}
            title={`Question ${idx + 1}`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Question Block */}
      <div className="CourseTest-Question-block">
        <p className="CourseTest-Question">{currentQuestion.question}</p>
        <ul>
          {currentQuestion.options.map((option, idx) => (
            <li key={idx}>
              <button
                className={`my-1 p-2 w-full border rounded ${
                  selectedAnswers[currentIndex] === idx
                    ? "bg-blue-300"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleAnswerSelect(idx)}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Controls */}
      <div className="CourseTest-Controls">
        <button
          onClick={handlePrevious}
          className="CourseTest-button"
          disabled={currentIndex === 0}
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          className="CourseTest-button"
          disabled={selectedAnswers[currentIndex] === undefined}
        >
          {currentIndex < questions.length - 1 ? "Next" : "Submit"}
        </button>

        <button
          onClick={() => {
            const newSet = new Set(markedQuestions);
            if (newSet.has(currentIndex)) {
              newSet.delete(currentIndex);
            } else {
              newSet.add(currentIndex);
            }
            setMarkedQuestions(newSet);
          }}
          className="CourseTest-button"
        >
          {markedQuestions.has(currentIndex) ? "Unmark" : "Mark"} for Review
        </button>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="CourseTest-Review">
          <div className="CourseTest-Review-Modal">
            <h2 className="CourseTest-h2">Review Before Submitting</h2>
            <ul className="CourseTest-list">
              <li>Total Questions: {questions.length}</li>
              <li>Answered: {Object.keys(selectedAnswers).length}</li>
              <li>Marked for Review: {markedQuestions.size}</li>
              <li>
                Unanswered:{" "}
                {questions.length - Object.keys(selectedAnswers).length}
              </li>
            </ul>
            <div className="CourseTest-btn">
              <button
                onClick={() => setShowReviewModal(false)}
                className="CourseTest-button"
                >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="CourseTest-button"
                >
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseTest;
