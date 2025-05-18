import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./previewpro.css";
import BuyButton from "../../components/BuyButton";
import { motion } from "framer-motion";

const pageVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
};

const PreviewPro = () => {
  const [userInput, setUserInput] = useState("");

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const checkAnswer = () => {
    // Sanitize the input by removing any extra spaces and ensuring it's case-insensitive
    const cleanedInput = userInput.trim().toLowerCase();

    if (cleanedInput === 'print("hello, world!")') {
      alert("Great job! You nailed it! 🎉");
    } else {
      alert("Oops, try again! 😊");
    }
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageVariants}
    >
      <div className="preview-pro-container">
        <div className="preview-pro-nebula-overlay"></div>
        <div className="preview-pro-content">
          <div className="preview-pro-header">
            <h1 className="preview-pro-title">
              <span className="preview-pro-title-glow">
                Welcome to Your First Lesson!
              </span>
              <div className="preview-pro-divider"></div>
            </h1>
            <p className="preview-pro-description">
              Congratulations! You’re about to dive into your first programming lesson. 🎉
              Let’s start simple. Today, you’ll write your very first Python program! This is where your journey begins.
            </p>
          </div>

          {/* Sample Lesson */}
          <div className="preview-pro-text-preview">
            <h2 className="preview-pro-text-h2">Lesson 1: Writing Your First Program</h2>
            <p className="preview-pro-text-p">
              In this lesson, we’ll start with a simple program that displays a message on the screen. 
              This is the foundation of all programming!
            </p>
            <p className="preview-pro-text-p">
              To get started, type the following into your Python editor:
            </p>
            <pre className="preview-pro-code-example">print("Hello, world!")</pre>
            <p className="preview-pro-text-p">
              This line of code will display the message <strong>"Hello, world!"</strong> when you run it. It’s that simple!
            </p>

            <h3  className="preview-pro-text-h3">Your Challenge:</h3>
            <p className="preview-pro-text-p">Now, try this:</p>
            <p className="preview-pro-text-p">
              In the text box below, type the program exactly as shown, and hit the "Check Answer" button to see if you’re on the right track.
            </p>

            <div className="preview-pro-input">
              <input
                type="text"
                placeholder='Type: print("Hello, world!")'
                value={userInput}
                onChange={handleInputChange}
                className="preview-pro-user-input"
              />
              <button onClick={checkAnswer} className="preview-pro-check-button">
                Check Answer
              </button>
            </div>

            <p  className="preview-pro-text-p">Don't worry if it takes a few tries! The most important thing is to keep learning and experimenting. 💡</p>

            <h3 className="preview-pro-text-h3">Why This Matters:</h3>
            <p className="preview-pro-text-p">
              Writing this simple line of code is your first step towards understanding how computers execute instructions. It’s the beginning of creating anything—from websites to apps to games!
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="preview-pro-button-group">
          <button className="preview-pro-nav-button preview-pro-back">
            <span className="preview-pro-icon">←</span>
            <Link to="/IntroductionToProgramming">Back to Courses</Link>
          </button>

            <div className="preview-pro-nav-button preview-pro-buy">
              <BuyButton
                courseId="intro-to-programming"
                courseTitle="Introduction to Programming"
              />
              <span className="preview-pro-icon">→</span>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default PreviewPro;