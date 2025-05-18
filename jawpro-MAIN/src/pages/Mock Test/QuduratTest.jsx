import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { questions as originalQuestions } from "./questions";
import "./QuduratTest.css";
import { auth, db } from "../../utils/firebase.utils.js";
import { doc, getDoc, collection, serverTimestamp } from "firebase/firestore";
import { addDoc } from "firebase/firestore";

import alarmTimeUp from "/sounds/alarm-timeup.mp3";
import alarmFiveMinutes from "/sounds/alarm-5min.mp3";
import alarmOneMinute from "/sounds/alarm-1min.mp3";

const QuduratTest = () => {
  const navigate = useNavigate();
  const [showUnansweredModal, setShowUnansweredModal] = useState(false);
  const [unansweredIndex, setUnansweredIndex] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const [username, setUsername] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1 * 60);
  const [showModal, setShowModal] = useState(false);

  const timeAlerts = [
    { time: 300, sound: alarmFiveMinutes },
    { time: 60, sound: alarmOneMinute },
  ];

  //  Randomize questions on mount
  useEffect(() => {
    const shuffled = [...originalQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
  }, []);
  useEffect(() => {
    if (timeLeft === 0 && !isSubmitted) {
      playSound(alarmTimeUp);
      setShowModal(true); // or set a dedicated `showTimeUpModal` if needed
      handleSubmit(); // ✅ Now it's safe
      setIsSubmitted(true); // prevent re-triggering
    }
  }, [timeLeft, isSubmitted]);
  
  // ⏰ Timer + Alerts
  useEffect(() => {
    if (showIntro) return; //  Don't start timer while on intro screen

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        

        timeAlerts.forEach((alert) => {
          if (prev === alert.time) playSound(alert.sound);
        });

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showIntro, selectedAnswers]);

  //  Keyboard nav
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") handleNext();
      else if (e.key === "ArrowLeft") handlePrevious();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  //  Safe sound playback
  const playSound = (sound) => {
    const audio = new Audio(sound);
    audio.play().catch((e) => console.warn("Failed to play sound:", e.message));
  };

  const saveTestResultsToFirestore = async () => {
    if (!auth.currentUser) return;

    const userTestRef = collection(
      db,
      "users",
      auth.currentUser.uid,
      "quduratTests"
    );

    const mappedAnswers = questions.map((q, i) => ({
      question: q.question,
      selectedAnswer: selectedAnswers[i] || null,
    }));

    const testData = {
      answers: mappedAnswers,
      submittedAt: serverTimestamp(),
      totalQuestions: questions.length,
      completed: mappedAnswers.every((a) => a.selectedAnswer !== null),
    };

    try {
      await addDoc(userTestRef, testData);
      console.log("Test results saved.");
    } catch (error) {
      console.error("Error saving test results:", error.message);
    }
  };

  const handleAnswerSelection = (option) => {
    setSelectedAnswers((prev) => {
      const updatedAnswers = { ...prev, [currentQuestion]: option };
      return updatedAnswers;
    });
  };

  const handleNext = () => {
    if (currentQuestion === questions.length - 1) {
      const unanswered = questions.findIndex((_, i) => !selectedAnswers[i]);
      if (unanswered !== -1) {
        setUnansweredIndex(unanswered);
        setShowUnansweredModal(true);
        return;
      }
      setShowModal(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  useEffect(() => {
    const fetchUsername = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUsername(userSnap.data().displayName);
        }
      }
    };

    fetchUsername();
  }, []);
  const handlePrevious = () => {
    if (currentQuestion === 0) {
      setShowIntro(true);
    } else {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleExit = () => {
    setShowIntro(true);
  };

  const handleSubmit = () => {
    navigate("/qudurat-results", {
      state: { selectedAnswers, questions },
    });
  };

  const handleConfirmSubmission = async () => {
    await saveTestResultsToFirestore();
    navigate("/qudurat-results", { state: { selectedAnswers, questions } });
  };

  const handleCancelSubmission = () => {
    setShowModal(false);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const progress = (currentQuestion / questions.length) * 100;

  if (questions.length === 0) return <p>Loading test...</p>;

  return (
    <div className="qudurat-test-container">
      {showIntro ? (
        <div className="qudurat-content-Welcome">
          <h1 className="qudurat-title-Welcome">
            🚀 Welcome, {username?.toUpperCase()}, to the Qudurat Trial Test
            Mission!
          </h1>

          <p className="qudurat-Welcomepra">
            Strap in, Astronaut — you're about to launch into a journey across
            the galaxy of knowledge! This trial test is your personal mission to
            chart your strengths and navigate the stars of your potential. 🌌
          </p>

          <h3 className="qudurat-Welcome3">🪐 Mission Briefing:</h3>
          <ul>
            <li>🛰️ 16 questions stand between you and your destination.</li>
            <li>
              🌠 Each question has 4 possible answers, but only one is correct —
              stay sharp!
            </li>
            <li>⏳ You have 16 minutes to complete your mission.</li>
            <li>
              🛎️ You’ll receive alerts when 5 minutes and 1 minute remain on the
              clock.
            </li>
            <li>
              🚨 If time runs out, your answers will be automatically
              transmitted to Mission Control.
            </li>
          </ul>

          <h3 className="qudurat-Welcome3">🌟 Astronaut’s Guide to Success:</h3>
          <ul>
            <li>
              Breathe deep, stay focused — even stars shine brightest in the
              dark.
            </li>
            <li>
              Trust your instincts — your training has prepared you for this.
            </li>
            <li>
              Each answer is a step across the cosmos. Stay curious, stay
              confident.
            </li>
          </ul>

          <p className="qudurat-Welcomepra">
            ☄️ <strong>Magnitude of the Moment:</strong> This is more than just
            a test — it's a launchpad. The data gathered here will guide you
            toward the courses that match your talents, your mindset, and your
            future.
          </p>

          <p className="qudurat-Welcomepra">
            You’re not just answering questions — you’re piloting your future
            through the galaxy of possibility.
          </p>

          <h3 className="qudurat-Welcome3">
            Now, brave explorer… Are you ready to ignite the engines and begin
            your mission?
          </h3>

          <div className="qudurat-welcome-buttons">
            <button
              className="qudurat-button-Welcome"
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>
            <button
              className="qudurat-button-Welcome"
              onClick={() => setShowIntro(false)}
            >
              🚀 Begin the Mission
            </button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="qudurat-title">Qudurat Mock Test</h1>

          <div className="qudurat-content">
            <div className="qudurat-test-header">
              <button className="qudurat-end-test" onClick={handleExit}>
                End Test
              </button>
              <div className="qudurat-timer">{formatTime(timeLeft)}</div>
            </div>

            <div className="qudurat-question-section">
              <p className="qudurat-question-number">
                Question {currentQuestion + 1} of {questions.length}
              </p>
              <div className="divider-pro"></div>
              <h2 className="qudurat-question">
                {/* Display question with proper superscript formatting */}
                <span
                  dangerouslySetInnerHTML={{
                    __html: questions[currentQuestion].question,
                  }}
                />
              </h2>
              <div className="qudurat-options">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    className={`qudurat-option ${
                      selectedAnswers[currentQuestion] === option
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleAnswerSelection(option)}
                  >
                    {/* Render options with proper superscript formatting */}
                    <span dangerouslySetInnerHTML={{ __html: option }} />
                  </button>
                ))}
              </div>
            </div>

            <div className="qudurat-navigation">
              <button onClick={handlePrevious}>Previous</button>

              <button onClick={handleNext}>
                {currentQuestion === questions.length - 1
                  ? "Submit Test"
                  : "Next"}
              </button>
            </div>
          </div>

          <div className="qudurat-progress-bar-container">
            <div
              className="qudurat-progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </>
      )}

      {/* Unanswered modal */}
      {showUnansweredModal && (
        <div className="qudurat-modal-overlay">
          <div className="qudurat-modal-content">
            <h3>You have unanswered questions!</h3>
            <p>
              Question {unansweredIndex + 1} is still unanswered. Would you like
              to go there?
            </p>
            <div className="qudurat-modal-buttons">
              <button
                className="qudurat-modal-button"
                onClick={() => {
                  setCurrentQuestion(unansweredIndex);
                  setShowUnansweredModal(false);
                }}
              >
                Go to Question
              </button>
              <button
                className="qudurat-modal-button"
                onClick={() => setShowUnansweredModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Final submission modal */}
      {showModal && (
        <div className="qudurat-modal-overlay">
          <div className="qudurat-modal-content">
            <h3>Are you sure you want to submit the test?</h3>
            <div className="qudurat-modal-buttons">
              <button
                className="qudurat-modal-button"
                onClick={handleConfirmSubmission}
              >
                Yes
              </button>
              <button
                className="qudurat-modal-button"
                onClick={handleCancelSubmission}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuduratTest;
