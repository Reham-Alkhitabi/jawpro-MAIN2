import React, { useEffect, useState } from "react";
import "./majorspages.css";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { bookmarkCourse } from "../../../utils/firebase.utils.js";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { FaArrowLeft, FaTwitter, FaWhatsapp, FaLink } from "react-icons/fa";

const MajorIslamicHistory = () => {
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notification, setNotification] = useState("");
  const [bookmarked, setBookmarked] = useState(false);
  const db = getFirestore();
  const navigate = useNavigate();

  const courseDetails = {
    CoursesTitle: "Islamic History",
    imgPath: "/images/Islamic History.png",
    description:
      "Explore the rich Islamic history and its impact on modern civilization.",
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
      await bookmarkCourse(courseDetails);
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
    const text = "Check out this amazing Islamic History program!";
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

  const sections = [
    {
      title: "Universities Offering Islamic History Programs:",
      items: [
        "Islamic University of Madinah",
        "Umm Al-Qura University (Makkah)",
        "King Saud University (Riyadh)",
        "Imam Muhammad Ibn Saud Islamic University",
        "King Abdulaziz University (Jeddah)",
      ],
    },
    {
      title: "Key Subjects:",
      items: [
        "History of the Prophet Muhammad (PBUH)",
        "The Four Rightly Guided Caliphs",
        "Islamic Civilization during the Umayyad and Abbasid Eras",
        "Islamic Art and Architecture",
        "History of Islamic Sciences and Scholarship",
        "Contemporary Islamic World",
      ],
    },
    {
      title: "Potential Career Paths:",
      items: [
        "Historian: Research and write about Islamic history.",
        "Academic Lecturer: Teach Islamic history at educational institutions.",
        "Museum Curator: Manage Islamic historical collections and exhibitions.",
        "Cultural Consultant: Advise organizations on Islamic culture and history.",
        "Author or Content Creator: Produce educational content about Islamic heritage.",
      ],
    },
  ];

  const skills = [
    "Research Skills: Ability to gather and interpret historical data.",
    "Critical Thinking: Analyzing historical narratives and understanding context.",
    "Writing and Communication: Presenting historical findings clearly and effectively.",
    "Attention to Detail: Identifying key historical events and implications.",
    "Cultural Awareness: Understanding and respecting diverse Islamic traditions.",
  ];

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
      )}{" "}
      <div className="Majorpage-major-card">
        <h1>Bachelor of Arts in Islamic History</h1>
        <p>
          The Islamic History program offers deep insight into the development
          and contributions of Islamic civilization. Students explore
          significant events, figures, and institutions from the early Islamic
          period to the modern era.
        </p>
        {sections.map((section, index) => (
          <div className="Majorpage-major-card" key={index}>
            <h2>{section.title}</h2>
            <ul>
              {section.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
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
            src="/images/Islamic History.jpg"
            alt="Islamic architecture and historical texts"
            className="Majorpage-major-image"
          />
        </div>
        <div className="Majorpage-major-card">
          <h2>Required Skills:</h2>
          <ul>
            {skills.map((skill, index) => (
              <li key={index}>
                <strong>{skill.split(":")[0]}:</strong> {skill.split(":")[1]}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MajorIslamicHistory;
