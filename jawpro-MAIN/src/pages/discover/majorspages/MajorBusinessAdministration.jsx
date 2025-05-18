import React, { useEffect, useState } from "react";
import "./majorspages.css";
import { bookmarkCourse } from "../../../utils/firebase.utils.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { FaArrowLeft, FaTwitter, FaWhatsapp, FaLink } from "react-icons/fa";

const MajorBusinessAdministration = () => {
  const [bookmarked, setBookmarked] = useState(false);
  const [notification, setNotification] = useState("");
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const checkBookmark = async (user) => {
      try {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const bookmarkedCourses = data.bookmarkedCourses || [];
          const isBookmarked = bookmarkedCourses.some(
            (item) =>
              item.CoursesTitle === "Business Administration" &&
              item.type === "specialization"
          );
          setBookmarked(isBookmarked);
        }
      } catch (err) {
        console.error("Error checking bookmark:", err);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        checkBookmark(user);
      }
    });

    return () => unsubscribe();
  }, []);

  const shareOnSocialMedia = (platform) => {
    const url = window.location.href;
    const text =
      "Explore Bachelor of Business Administration (BBA) programs in Saudi Arabia!";
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

  const handleBookmark = async () => {
    const user = auth.currentUser;
    if (!user) {
      setNotification("🔒 Please log in to bookmark this specialization.");
      setShowNotificationModal(true);
      return;
    }

    try {
      await bookmarkCourse({
        CoursesTitle: "Business Administration",
        imgPath: "/images/Business Administration.png",
        description:
          "Explore BBA programs in Saudi Arabia and kickstart your business career.",
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
      setTimeout(() => setNotification(""), 3000);
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
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="Majorpage-major-card">
        <h1>Bachelor of Business Administration (BBA)</h1>
        <p>
          A Bachelor of Business Administration (BBA) is a popular undergraduate
          degree program that equips students with the knowledge and skills
          needed to succeed in the business world. In Saudi Arabia, BBA programs
          are offered by numerous universities, both public and private.
        </p>

        <div className="Majorpage-major-card">
          <h2>Universities Offering BBA Programs:</h2>
          <ul>
            <li>King Saud University</li>
            <li>King Abdulaziz University</li>
            <li>Prince Mohammad Bin Fahd University</li>
            <li>King Fahd University of Petroleum and Minerals</li>
          </ul>
        </div>

        <div className="Majorpage-major-card">
          <h2>Core Subjects:</h2>
          <ul>
            <li>Accounting</li>
            <li>Statistics</li>
            <li>Marketing</li>
            <li>Finance</li>
            <li>Organizational Behavior</li>
            <li>Business Law</li>
          </ul>
        </div>

        <div className="Majorpage-major-card">
          <h2>Potential Career Paths:</h2>
          <ul>
            <li>General Manager</li>
            <li>Marketing Manager</li>
            <li>Financial Manager</li>
            <li>Human Resources Manager</li>
            <li>Management Consultant</li>
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
            src="/images/Business Administration info.png"
            alt="Business administration concept with financial charts and a laptop"
            className="Majorpage-major-image"
          />
        </div>

        <div className="Majorpage-major-card">
          <h2>Required Skills:</h2>
          <ul>
            <li>
              <strong>Leadership skills:</strong> Lead and motivate others.
            </li>
            <li>
              <strong>Decision-making skills:</strong> Make sound decisions
              under pressure.
            </li>
            <li>
              <strong>Critical thinking skills:</strong> Analyze and judge
              effectively.
            </li>
            <li>
              <strong>Communication skills:</strong> Speak and write clearly.
            </li>
            <li>
              <strong>Teamwork skills:</strong> Work collaboratively with teams.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MajorBusinessAdministration;
