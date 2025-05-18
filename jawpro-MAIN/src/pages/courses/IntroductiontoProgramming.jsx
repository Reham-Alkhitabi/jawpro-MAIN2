import React, { useEffect, useState } from "react";
import "./coursepage.css";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getAverageRating, bookmarkCourse } from "../../utils/firebase.utils.js";
import BuyButton from "../../components/BuyButton";
import {
  FaTwitter,
  FaWhatsapp,
  FaLink,
  FaCheckCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";

const pageVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
};
const IntroductionToProgramming = () => {
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notification, setNotification] = useState("");
  const [bookmarked, setBookmarked] = useState(false);
  const [average, setAverage] = useState(null);
  const db = getFirestore();

  const courseDetails = {
    CoursesTitle: "Introduction to Programming",
    imgPath: "/images/intro to programming.jpg",
    description:
      "This course provides an introduction to programming using Python. It covers fundamental concepts and techniques for writing simple programs.",
    duration: "8 weeks",
    instructor: "Dr. Olivia wilson",
    price: "100",
    prerequisites: "None",
    type: "course",
  };

  const courseCurriculum = [
    "Week 1: Introduction to Python",
    "Week 2: Variables and Data Types",
    "Week 3: Control Structures",
    "Week 4: Functions and Scope",
    "Week 5: Lists and loop",
    "Week 6: Lists and loop",
    "Week 6: Dictionaries and Sets",
    "Week 7: File Input/Output",
    "Week 8: Error Handling (try/except)",
  ];

  const courseLearningOutcomes = [
    "Understand basic programming concepts",
    "Write simple programs in Python",
    "Use control structures and functions",
    "Work with lists and dictionaries",
    "Handle files and errors",
  ];

  const courseName = "Intro to Programming";

  useEffect(() => {
    const fetchAverage = async () => {
      const avg = await getAverageRating(courseName);
      setAverage(avg.toFixed(1));
    };
    fetchAverage();
  }, [courseName]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          const bookmarks = data.bookmarkedCourses || [];
          const isBookmarked = bookmarks.some(
            (b) =>
              b.CoursesTitle === courseDetails.CoursesTitle &&
              b.type === "course"
          );
          setBookmarked(isBookmarked);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleBookmark = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setNotification("🔒 Please log in to bookmark this course.");
      setShowNotificationModal(true);
      return;
    }

    try {
      await bookmarkCourse(courseDetails);
      setBookmarked(true);
      setNotification("✅ Course bookmarked!");
      setShowNotificationModal(true);
      setTimeout(() => {
        setNotification("");
        setShowNotificationModal(false);
      }, 3000);
    } catch (error) {
      console.error("Bookmark failed:", error);
      setNotification("❌ Failed to bookmark. Please try again.");
      setShowNotificationModal(true);
      setTimeout(() => {
        setNotification("");
        setShowNotificationModal(false);
      }, 3000);
    }
  };

  const shareOnSocialMedia = (platform) => {
    const url = window.location.href;
    const text = "Check out this amazing Introduction to Programming course!";
    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(text)}`;
        window.open(shareUrl, "_blank");
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}%20${encodeURIComponent(url)}`;
        window.open(shareUrl, "_blank");
        break;
      case "copy":
        navigator.clipboard.writeText(`${text} ${url}`).then(() => {
          setNotification("🔗 Link copied to clipboard!");
          setShowNotificationModal(true);
          setTimeout(() => {
            setShowNotificationModal(false);
            setNotification("");
          }, 3000);
        });
        break;
      default:
        break;
    }
  };

  return (
            <motion.section
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={pageVariants}
            >
    <div className="coursepage-course-container">
      {showNotificationModal && (
        <div className="notification-modal-overlay">
          <div className="notification-modal-content">
            <h2>📌 Notification</h2>
            <p>{notification}</p>
            <div className="notification-modal-buttons">
              <button
                className="notification-ok-btn"
                onClick={() => setShowNotificationModal(false)}
              >
                ok
              </button>
            </div>
          </div>
        </div>
      )}

      <h1>{courseDetails.CoursesTitle}</h1>

      <div className="coursepage-course-card">
        <div className="coursepage-course-info">
          <p>{courseDetails.description}</p>
          <ul>
            <li><strong>Duration:</strong> {courseDetails.duration}</li>
            <li><strong>Instructor:</strong> {courseDetails.instructor}</li>
            <li>
              <strong>Price:</strong>{" "}
              <span className="coursepage-price">
                <img
                  src="https://www.sama.gov.sa/ar-sa/Currency/Documents/Saudi_Riyal_Symbol-2.svg"
                  alt="SAR"
                  className="riyal-symbol"
                  style={{
                    width: "16px",
                    verticalAlign: "middle",
                    marginRight: "4px",
                  }}
                />
                {courseDetails.price}
              </span>
            </li>
            <li><strong>Prerequisites:</strong> {courseDetails.prerequisites}</li>
            <li>
              <strong>Curriculum:</strong>
              <ol>
                {courseCurriculum.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
            </li>
            <li>
              <strong>Learning Outcomes:</strong>
              <ol>
                {courseLearningOutcomes.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
            </li>
          </ul>

          <div className="coursepage-icons">
            <span
              className="icon-bookmarks"
              onClick={handleBookmark}
              title="Bookmark this course"
              style={{ cursor: "pointer" }}
            >
              {bookmarked ? (
                <><FaCheckCircle color="green" /> Bookmarked</>
              ) : (
                <> Bookmark</>
              )}
            </span>
              <span
                className="share-icon"
                title="Share on Twitter"
                onClick={() => shareOnSocialMedia("twitter")}
              >
                <FaTwitter />
              </span>
              <span
                className="share-icon"
                title="Share on WhatsApp"
                onClick={() => shareOnSocialMedia("whatsapp")}
              >
                <FaWhatsapp />
              </span>
              <span
                className="share-icon"
                title="Copy link"
                onClick={() => shareOnSocialMedia("copy")}
              >
                <FaLink />
              </span>
          </div>
        </div>

        <div className="coursepage-course-left">
          <div className="coursepage-course-image">
            <img src={courseDetails.imgPath} alt="Course visual" />
          </div>
          <div className="coursepage-course-actions">
            <h3 className="course-Average-Rating">
              Average Rating: {average ? `⭐ ${average} / 5` : "No ratings yet"}
            </h3>

            <button className="coursepage-preview-button">
              <Link to="/preview-Introduction-to-Programming">Preview</Link>
            </button>
            <div className="coursepage-buy-button">
              <BuyButton
                courseId="intro-to-programming"
                courseTitle="Introduction to Programming"
              />
            </div>
          </div>
        </div>
      </div>

      <button className="coursepage-back-button">
        <span className="icon-arrow-left2"> </span>
        <Link to="/">BACK</Link>
      </button>
    </div>
    </motion.section>
  );
};

export default IntroductionToProgramming;
