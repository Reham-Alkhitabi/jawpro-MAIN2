import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import {
  isCoursePaid,
  removeBookmark,
  getAllUserProgress,
  getLatestRecommendationsFromFirestore,
} from "../../utils/firebase.utils.js";

import "./CourseDiscovery.css";
import { motion } from "framer-motion";

const pageVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
};
const CourseDiscovery = () => {
  const [bookmarkedSpecializations, setBookmarkedSpecializations] = useState(
    []
  );
  const [bookmarkedOnlyCourses, setBookmarkedOnlyCourses] = useState([]);
  const [quduratResults, setQuduratResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseProgress, setCourseProgress] = useState({});
  const [hasPurchasedInterestTest, setHasPurchasedInterestTest] =
    useState(false);

  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();
  const handleLaunchTest = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        console.warn("User not authenticated");
        return;
      }

      const latest = await getLatestRecommendationsFromFirestore(user.uid);

      if (latest && latest.scores) {
        navigate("/results", { state: { scores: latest.scores } });
      } else {
        console.warn("No previous data found. Starting fresh.");
        navigate("/results"); // fallback if nothing found
      }
    } catch (err) {
      console.error("Error fetching latest recommendations:", err);
      navigate("/results"); // fallback
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    const fetchUserData = async (user) => {
      if (!user) {
        setError("🚀 Please login to view your bookmarks");
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          const allBookmarks = userData.bookmarkedCourses || [];

          setBookmarkedSpecializations(
            allBookmarks.filter((item) => item.type === "specialization")
          );
          setBookmarkedOnlyCourses(
            allBookmarks.filter((item) => !item.type || item.type === "course")
          );
          setQuduratResults(userData.quduratResults || null);
          const progress = await getAllUserProgress(user.uid);
          setCourseProgress(progress);
        } else {
          setError("🛸 No user data found in our galaxy");
        }
      } catch (err) {
        setError("☄️ Cosmic error: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      await fetchUserData(user);

      // Check if user purchased "interest-results"
      if (user) {
        const purchased = await isCoursePaid("interest-results");
        setHasPurchasedInterestTest(purchased);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const handleRemoveBookmark = async (item) => {
    try {
      await removeBookmark(item);
      if (item.type === "specialization") {
        setBookmarkedSpecializations((prev) =>
          prev.filter((s) => s.CoursesTitle !== item.CoursesTitle)
        );
      } else {
        setBookmarkedOnlyCourses((prev) =>
          prev.filter((c) => c.CoursesTitle !== item.CoursesTitle)
        );
      }
    } catch (err) {
      setError("🌌 Failed to remove bookmark: " + err.message);
    }
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageVariants}
    >
      <div className="course-discovery-container">
        {loading ? (
          <div className="course-discovery-loading">
            <div className="cosmic-spinner"></div>
            <p>Scanning the cosmos for your Planets ☆⋆｡𖦹°‧★</p>
          </div>
        ) : error ? (
          <p className="course-discovery-error">{error}</p>
        ) : (
          <>
            {/* Qudurat Results Section */}
            {quduratResults ? (
              <div className="course-discovery-results cosmic-panel">
                <h2 className="cosmic-heading">
                  <span className="cosmic-icon">📊</span> Your Qudurat Score:{" "}
                  <span className="cosmic-highlight">
                    {quduratResults.score}%
                  </span>
                </h2>
                <div className="cosmic-progress-bar">
                  <div
                    className="cosmic-progress-fill"
                    style={{ width: `${quduratResults.score}%` }}
                  ></div>
                </div>
                <h3 className="cosmic-subheading">
                  <span className="cosmic-icon">🚀</span> Level:{" "}
                  <span className="cosmic-highlight">
                    {quduratResults.level}
                  </span>
                </h3>
                <h3 className="cosmic-subheading">
                  <span className="cosmic-icon">🎯</span> Suggested Learning
                  Paths:
                </h3>
                <ul className="cosmic-suggestion-list">
                  {quduratResults.suggestedCourses.map((course, index) => (
                    <li
                      key={index}
                      className="cosmic-suggestion-item"
                      onClick={() => navigate(courseLinks[course] || "/")}
                    >
                      <span className="cosmic-bullet">✦</span> {course}
                    </li>
                  ))}
                </ul>
                <button
                  className="button-retake"
                  onClick={() => navigate("/qudurat-mock-test")}
                >
                  <span className="cosmic-icon">➔</span> RETAKE
                </button>
              </div>
            ) : (
              <div className="cosmic-test-prompt">
                <h2>
                  <span className="cosmic-icon">🔭</span> Discover Your Learning
                  Galaxy!
                </h2>
                <p>
                  Take the Qudurat test to map your perfect learning
                  constellation
                </p>
                <button
                  className="cosmic-button primary"
                  onClick={() => navigate("/qudurat-mock-test")}
                >
                  <span className="cosmic-icon">🚀</span> Launch Qudurat Test
                </button>
              </div>
            )}

            {/* Learning Path Based on the Interest Test */}
            <div className="course-discovery-results cosmic-panel">
              <h2 className="cosmic-section-title">
                <span className="cosmic-icon">🧭</span> Learning Path Based on
                the Interest Test
              </h2>

              {hasPurchasedInterestTest ? (
                <div className="cosmic-test-prompt">
                  <p>
                    We've decoded your interests! Explore your personalized
                    learning journey.
                  </p>
                  <button
                    className="cosmic-button primary"
                    onClick={handleLaunchTest}
                    disabled={loading}
                  >
                    View Your Interest Results{" "}
                  </button>
                </div>
              ) : (
                <div className="cosmic-test-prompt">
                  <p>
                    You haven't taken the Interest Test yet. Start now to unlock
                    your learning potential!
                  </p>
                  <button
                    className="cosmic-button secondary"
                    onClick={() => navigate("/AI-tests")}
                  >
                    <span className="cosmic-icon">🚀</span> Take the Interest
                    Test
                  </button>
                </div>
              )}
            </div>

            {/* Specializations Section */}
            <div className="course-discovery-results cosmic-panel">
              <h2 className="cosmic-section-title">
                <span className="cosmic-icon">🌟</span> Your Starred
                Specializations
              </h2>
              {bookmarkedSpecializations.length > 0 ? (
                <div className="cosmic-grid">
                  {bookmarkedSpecializations.map((item, index) => (
                    <article key={index} className="cosmic-card">
                      <div className="cosmic-card-image-container">
                        <img
                          src={item.imgPath}
                          alt={item.CoursesTitle}
                          className="cosmic-card-image"
                        />
                        <div className="cosmic-card-badge">Specialization</div>
                      </div>
                      <div className="cosmic-card-content">
                        <h3 className="cosmic-card-title">
                          {item.CoursesTitle}
                        </h3>
                        <p className="cosmic-card-description">
                          {item.description}
                        </p>
                        <div className="cosmic-card-actions">
                          <button
                            className="cosmic-button danger"
                            onClick={() => handleRemoveBookmark(item)}
                          >
                            <span className="cosmic-icon">✕</span> Remove
                          </button>
                          <Link
                            className="cosmic-button primary"
                            to={`/${item.CoursesTitle.toLowerCase()
                              .replace(/ & /g, "-")
                              .replace(/ /g, "-")}`}
                          >
                            <span className="cosmic-icon">➔</span> Explore
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="cosmic-empty-state">
                  <p>
                    No specializations bookmarked yet. Start exploring the
                    learning universe!
                  </p>
                  <button
                    className="cosmic-button secondary"
                    onClick={() => navigate("/discover")}
                  >
                    <span className="cosmic-icon">🌌</span> Browse
                    Specializations
                  </button>
                </div>
              )}
            </div>

            {/* Courses Section */}
            <div className="course-discovery-results cosmic-panel">
              <h2 className="cosmic-section-title">
                <span className="cosmic-icon">🪐</span> Your Saved Courses
              </h2>
              {bookmarkedOnlyCourses.length > 0 ? (
                <div className="cosmic-grid">
                  {bookmarkedOnlyCourses.map((course, index) => (
                    <article key={index} className="cosmic-card">
                      <div className="cosmic-card-image-container">
                        <img
                          src={course.imgPath}
                          alt={course.CoursesTitle}
                          className="cosmic-card-image"
                        />
                        <div className="cosmic-card-price">
                          <img
                            src="./images/riyal-icon.png"
                            alt="SAR"
                            className="riyal-symbol"
                          />
                          {course.price || "Free"}
                        </div>
                      </div>
                      <div className="cosmic-card-content">
                        <h3 className="cosmic-card-title">
                          {course.CoursesTitle}
                        </h3>
                        <p className="cosmic-card-description">
                          {course.description}
                        </p>
                        <div className="cosmic-card-actions">
                          <button
                            className="cosmic-button danger"
                            onClick={() => handleRemoveBookmark(course)}
                          >
                            <span className="cosmic-icon">✕</span> Remove
                          </button>
                          <Link
                            className="cosmic-button primary"
                            to={`/${course.CoursesTitle.toLowerCase()
                              .replace(/ & /g, "-")
                              .replace(/ /g, "-")}`}
                          >
                            <span className="cosmic-icon">➔</span> Enroll
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="cosmic-empty-state">
                  <p>
                    Your course galaxy is empty. Discover new worlds of
                    knowledge!
                  </p>
                  <button
                    className="cosmic-button secondary"
                    onClick={() => navigate("/main")}
                  >
                    <span className="cosmic-icon">🔭</span> Explore Courses
                  </button>
                </div>
              )}
            </div>

            {/* 🌠 Journey Progress Section */}
            <div className="course-discovery-results cosmic-panel">
              <h2 className="cosmic-section-title">
                <span className="cosmic-icon">🌠</span> Your Journey Progress
              </h2>
              {Object.keys(courseProgress).length > 0 ? (
                <div className="cosmic-grid">
                  {Object.entries(courseProgress).map(
                    ([courseName, percent], index) => (
                      <article key={index} className="cosmic-card">
                        <div className="cosmic-card-image-container">
                          <img
                            src={`/images/${courseName.toLowerCase()}.jpg`}
                            alt={courseName}
                            className="cosmic-card-image"
                          />
                        </div>
                        <div className="cosmic-card-content">
                          <h3 className="cosmic-card-title">{courseName}</h3>
                          <div className="cosmic-progress-bar">
                            <div
                              className="cosmic-progress-fill"
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                          <p className="cosmic-card-progress">
                            {percent}% completed
                          </p>
                          <Link
                            className="cosmic-button progress"
                            to={`/${courseName
                              .toLowerCase()
                              .replace(/ & /g, "-")
                              .replace(/ /g, "-")}`}
                          >
                            <span className="cosmic-icon">🎓</span> Continue
                            Course
                          </Link>
                        </div>
                      </article>
                    )
                  )}
                </div>
              ) : (
                <div className="cosmic-empty-state">
                  <p>
                    No progress tracked yet. Start a course and begin your
                    journey!
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </motion.section>
  );
};

export default CourseDiscovery;
