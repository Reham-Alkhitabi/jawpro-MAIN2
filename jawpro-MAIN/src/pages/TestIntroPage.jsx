import React from "react";
import { useNavigate } from "react-router-dom";
import "./TestIntroPage.css";
import { FaCheckCircle } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";

function TestIntroPage() {
  const navigate = useNavigate();

  const startTest = () => {
    navigate("/test");
  };

  return (
    <div className="intro-page-screen">
      <div className="intro-page-card">
        <Illustration />
        <Heading text="Test Guidelines" />
        <GuidelinesList />
        <StartButton onClick={startTest} />
        <button className="intro-course-button" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  );
}

function Illustration() {
  return (
    <div className="illustration">
      <FaClipboardList className="intro-page-icon" />
    </div>
  );
}

function Heading({ text }) {
  return <h2 className="intro-page-heading">{text}</h2>;
}

function GuidelinesList() {
  return (
    <ul className="intro-page-guidelines-list">
      <li>
        <FaCheckCircle className="intro-page-check-icon" /> Answer each
        statement based on your personal opinion
      </li>
      <li>
        <FaCheckCircle className="intro-page-check-icon" /> You cannot skip
        questions, but you can return to them later
      </li>
      <li>
        <FaCheckCircle className="intro-page-check-icon" /> Be honest — there
        are no right or wrong answers
      </li>
    </ul>
  );
}

function StartButton({ onClick }) {
  return (
    <button className="intro-page-start-test-button" onClick={onClick}>
      Start Test
    </button>
  );
}

export default TestIntroPage;