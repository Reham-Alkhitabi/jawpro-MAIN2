import React, { useEffect, useState } from "react";
import "./majorspages.css";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { bookmarkCourse } from "../../../utils/firebase.utils.js";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { FaArrowLeft, FaTwitter, FaWhatsapp, FaLink } from "react-icons/fa";

const MajorGraphicDesign = () => {
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notification, setNotification] = useState("");
  const [bookmarked, setBookmarked] = useState(false);
  const db = getFirestore();
  const navigate = useNavigate();

  const courseDetails = {
    CoursesTitle: "Graphic Design",
    imgPath: "/images/Graphic Design.png",
    description:
      "Explore Graphic Design programs in Saudi Arabia and develop creative visual communication skills for the digital age.",
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
    const text = "Check out this amazing Graphic Design Programs!";
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
      title: "Universities Offering Graphic Design Programs:",
      items: [
        "Princess Nourah Bint Abdulrahman University",
        "King Abdulaziz University",
        "Dar Al-Hekma University",
        "Effat University",
        "University of Jeddah",
        "Imam Abdulrahman Bin Faisal University",
        "University of Hail",
        "Various private art and design institutes",
      ],
    },
    {
      title: "Key Subjects:",
      items: [
        "Design Principles",
        "Typography",
        "Digital Illustration",
        "Brand Identity Design",
        "User Interface (UI) Design",
        "Motion Graphics",
      ],
    },
    {
      title: "Potential Career Paths:",
      items: [
        "Graphic Designer: Creating visual concepts for branding, advertising, and media.",
        "UI/UX Designer: Designing user-friendly digital interfaces for websites and apps.",
        "Art Director: Leading creative teams and overseeing visual projects.",
        "Illustrator: Producing original illustrations for books, advertisements, and multimedia.",
        "Multimedia Designer: Working on animation, video, and interactive content.",
      ],
    },
  ];

  const skills = [
    "Creativity: Generating original and visually compelling ideas.",
    "Technical Proficiency: Mastery of design software like Adobe Creative Suite.",
    "Visual Communication: Translating messages into clear visual formats.",
    "Attention to Detail: Ensuring design accuracy and consistency.",
    "Time Management: Handling multiple projects under deadlines.",
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
        <h1>Bachelor of Arts in Graphic Design</h1>
        <p>
          Graphic Design is a dynamic field that combines art, technology, and
          communication. In Saudi Arabia, pursuing a degree in Graphic Design
          equips students with the creative and technical skills needed to excel
          in advertising, digital media, branding, and visual storytelling.
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
            src="/images/graphic-design.png"
            alt="Economics concept with financial charts and data"
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

export default MajorGraphicDesign;
