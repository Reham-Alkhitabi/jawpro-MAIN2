import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import { getAuth } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import "./QuduratResults.css";

const courseLinks = {
  "Advanced Logic & Critical Thinking": "/advanced-logic-critical-thinking",
  "Speed Math Techniques": "/speed-math-techniques",
  "Advanced Verbal Analogies": "/advanced-verbal-analogies",
  "Quantitative Reasoning Practice": "/quantitative-reasoning-practice",
  "Reading Speed & Comprehension": "/reading-speed-comprehension",
  "Verbal Reasoning Techniques": "/verbal-reasoning-techniques",
  "Basic Math Refresher": "/basic-math-refresher",
  "Step-by-Step Verbal Skills": "/step-by-step-verbal-skills",
  "Intro to Logic and Reasoning": "/intro-logic-reasoning",
  "GAT Crash Course (All Sections)": "/gat-crash-course",
  "Beginner Math Skills": "/beginner-math-skills",
  "Critical Reading Foundations": "/critical-reading-foundations",
  "GAT Prep Explained (Beginner Level)": "/gat-prep-beginner",
  "Basic Test-Taking Techniques": "/test-taking-techniques",
};


const QuduratResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedAnswers, questions } = location.state || {};
  const [width, height] = useWindowSize();

  const [showConfetti, setShowConfetti] = useState(false);

  let correctAnswers = 0;
  let totalQuestions = 0;
  let percentage = 0;
  let level = "";
  let courses = [];

  if (selectedAnswers && questions) {
    correctAnswers = questions.filter(
      (q, index) => selectedAnswers[index] === q.correctAnswer
    ).length;
    totalQuestions = questions.length;
    percentage = ((correctAnswers / totalQuestions) * 100).toFixed(1);

    if (percentage >= 85) {
      level = "Excellent";
      courses = [
        "Advanced Logic & Critical Thinking",
        "Speed Math Techniques",
        "Advanced Verbal Analogies",
      ];
    } else if (percentage >= 70) {
      level = "Very Good";
      courses = [
        "Quantitative Reasoning Practice",
        "Reading Speed & Comprehension",
        "Verbal Reasoning Techniques",
      ];
    } else if (percentage >= 50) {
      level = "Good";
      courses = [
        "Basic Math Refresher",
        "Step-by-Step Verbal Skills",
        "Intro to Logic and Reasoning",
        "GAT Crash Course (All Sections)",
      ];
    } else {
      level = "Needs Improvement";
      courses = [
        "Beginner Math Skills",
        "Critical Reading Foundations",
        "GAT Prep Explained (Beginner Level)",
        "Basic Test-Taking Techniques",
      ];
    }
    
  }

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    const db = getFirestore();

    const saveResults = async () => {
      if (user && selectedAnswers && questions) {
        try {
          await setDoc(
            doc(db, "users", user.uid),
            {
              quduratResults: {
                score: percentage,
                level,
                suggestedCourses: courses,
              },
            },
            { merge: true }
          );
        } catch (error) {
          console.error("Error saving Qudurat results:", error);
        }
      }
    };

    saveResults();

    if (level === "Excellent" || level === "Very Good") {
      setShowConfetti(true);
    }
  }, [percentage, level, courses, selectedAnswers, questions]);

  if (!selectedAnswers || !questions) {
    return <h2>Error: No test data available!</h2>;
  }

  return (
    <motion.div
      className="QR-results-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={500}
          gravity={0.3}
          recycle={false}
        />
      )}

      <h1 className="QR-results-title">Your Qudurat Test Results</h1>

      <div className="QR-results-grid">
        {/* Left Section */}
        <div className="QR-results-left">
          <div className="QR-score-box">
            <h2 className="QR-results-h2">
              {correctAnswers}/{totalQuestions} Correct
            </h2>
            <p className="QR-results-p">Score: {percentage}%</p>
          </div>

          <div className="QR-level-box">
            <h3 className="QR-results-h3">Level: <strong>{level}</strong></h3>
          </div>

          <motion.button
            className="QR-retake-btn"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate("/qudurat-mock-test")}
          >
            Retake Test
          </motion.button>
        </div>

        {/* Right Section */}
        <div className="QR-results-right">
          <h3 className="QR-results-h3">Recommended Courses:</h3>
          <ul className="QR-course-list">
            {courses.map((course, index) => (
              <motion.li
                key={index}
                whileHover={{ scale: 1.05 }}
                className="QR-course-item"
                onClick={() => navigate(courseLinks[course] || "/")}
              >
                {course}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default QuduratResults;
