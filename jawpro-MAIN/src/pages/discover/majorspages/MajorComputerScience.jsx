import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { bookmarkCourse } from "../../../utils/firebase.utils.js";
import { FaArrowLeft, FaTwitter, FaWhatsapp, FaLink } from "react-icons/fa";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";

import "./majorspages.css";

const MajorComputerScience = () => {
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notification, setNotification] = useState("");
  const navigate = useNavigate();
  const [bookmarked, setBookmarked] = useState(false);
  const db = getFirestore();

  const courseDetails = {
    CoursesTitle: "Computer Science",
    imgPath: "/images/Computer Science.png",
    description:
      "Explore Computer Science programs in Saudi Arabia and power up your tech future.",
    price: "Free",
    type: "specialization",
  };

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
              b.type === "specialization"
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
      setNotification("🔒 Please log in to bookmark this specialization.");
      setShowNotificationModal(true);
      return;
    }

    try {
      await bookmarkCourse({
        CoursesTitle: "Computer Science",
        imgPath: "/images/Computer Science.png",
        description:
          "Explore Computer Science programs in Saudi Arabia and power up your tech future.",
        price: "Free",
        type: "specialization",
      });

      setBookmarked(true);
      setNotification("✅ Specialization bookmarked!");
      setShowNotificationModal(true);
      setTimeout(() => setNotification(""), 3000);
    } catch (error) {
      console.error("Bookmark failed:", error);
      setNotification("❌ Failed to bookmark. Please try again.");
      setShowNotificationModal(true);
      setTimeout(() => setNotification(""), 3000);
    }
  };

  const shareOnSocialMedia = (platform) => {
    const url = window.location.href;
    const text = "Explore Computer Science programs in Saudi Arabia!";

    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(
          text
        )}`;
        window.open(shareUrl, "_blank");
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          text
        )}%20${encodeURIComponent(url)}`;
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
    <div className="Majorpage-major-container">
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
              </button>{" "}
            </div>
          </div>
        </div>
      )}

      <div className="Majorpage-major-card">
        <h1>Bachelor of Science in Computer Science</h1>
        <p>
          Computer science is a rapidly growing field in Saudi Arabia, driven by
          the country's Vision 2030 and the increasing demand for skilled IT
          professionals. Numerous universities across the Kingdom offer
          high-quality computer science programs.
        </p>

        <div className="Majorpage-major-card">
          <h2>Universities Offering Computer Science Programs:</h2>
          <ul>
            <li>King Saud University</li>
            <li>King Abdulaziz University</li>
            <li>King Fahd University of Petroleum and Minerals</li>
            <li>Alfaisal University</li>
            <li>Effat University</li>
            <li>Umm Al-Qura University</li>
            <li>Imam Abdulrahman Bin Faisal University</li>
            <li>Various private universities</li>
          </ul>
        </div>

        <div className="Majorpage-major-card">
          <h2>Key Subjects:</h2>
          <ul>
            <li>Programming Languages: C, C++, Java, Python, and more</li>
            <li>Data Structures and Algorithms</li>
            <li>Computer Architecture</li>
            <li>Operating Systems</li>
            <li>Database Systems</li>
            <li>Computer Networks</li>
            <li>Artificial Intelligence</li>
          </ul>
        </div>

        <div className="Majorpage-major-card">
          <h2>Potential Career Paths:</h2>
          <ul>
            <li>Software Developer</li>
            <li>Data Scientist</li>
            <li>Cybersecurity Analyst</li>
            <li>Database Administrator</li>
            <li>Network Engineer</li>
            <li>IT Consultant</li>
            <li>Entrepreneur</li>
          </ul>
        </div>

        <div className="Majorpage-icons">
          <span
            onClick={!bookmarked ? handleBookmark : null}
            style={{
              cursor: bookmarked ? "default" : "pointer",
              opacity: bookmarked ? 0.6 : 1,
              marginRight: "12px",
              fontSize: "1.5rem",
            }}
            title="Bookmark this specialization"
          >
            {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
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

        <button className="Majorpage-back-button" onClick={() => navigate(-1)}>
          <FaArrowLeft /> BACK
        </button>
      </div>

      <div className="Majorpage-major-content">
        <div className="Majorpage-major-card">
          <img
            src="/images/Computer Science.jpg"
            alt="Programmer coding on a computer"
            className="Majorpage-major-image"
          />
        </div>

        <div className="Majorpage-major-card">
          <h2>Required Skills:</h2>
          <ul>
            <li>
              <strong>Problem-solving:</strong> Break down complex problems into
              manageable ones.
            </li>
            <li>
              <strong>Critical thinking:</strong> Evaluate and make informed
              decisions.
            </li>
            <li>
              <strong>Creativity:</strong> Develop innovative tech solutions.
            </li>
            <li>
              <strong>Attention to detail:</strong> Ensure precision in code.
            </li>
            <li>
              <strong>Teamwork:</strong> Collaborate effectively on software
              projects.
            </li>
            <li>
              <strong>Adaptability:</strong> Keep up with evolving tech trends.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MajorComputerScience;
