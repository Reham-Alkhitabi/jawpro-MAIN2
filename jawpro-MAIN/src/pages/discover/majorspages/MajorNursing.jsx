import React, { useEffect, useState } from "react";
import "./majorspages.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { bookmarkCourse } from "../../../utils/firebase.utils.js";
import { useNavigate } from "react-router-dom";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { FaArrowLeft, FaTwitter, FaWhatsapp, FaLink } from "react-icons/fa";

const MajorNursing = () => {
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notification, setNotification] = useState("");
    const navigate = useNavigate();
  
  const [bookmarked, setBookmarked] = useState(false);
  const db = getFirestore();
  const courseDetails = {
    CoursesTitle: "Nursing",
    imgPath: "/images/Nursing.png",
    description:
      "Explore Nursing programs in Saudi Arabia and understand global Nursing systems.",
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
    const text = "Explore Nursing programs in Saudi Arabia!";
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
      title: "Universities Offering Nursing Programs in Saudi Arabia:",
      items: [
        "King Abdulaziz University (Jeddah)",
        "King Saud University (Riyadh)",
        "Alfaisal University (Riyadh)",
        "Imam Abdulrahman Bin Faisal University (Dammam)",
        "King Saud Bin Abdulaziz University for Health Sciences (Riyadh)",
        "Umm Al-Qura University (Makkah)",
      ],
    },
    {
      title: "Key Subjects:",
      items: [
        "Anatomy and Physiology",
        "Pharmacology",
        "Medical-Surgical Nursing",
        "Pediatric Nursing",
        "Maternity Nursing",
        "Psychiatric Nursing",
        "Community Health Nursing",
        "Nursing Research",
        "Leadership and Management in Nursing",
        "Fundamentals of Nursing",
        "Health Assessment",
      ],
    },
    {
      title: "Potential Career Paths:",
      items: [
        "Staff Nurse",
        "Nursing Supervisor",
        "Nurse Educator",
        "Nurse Researcher",
        "Public Health Nurse",
        "Nurse Administrator",
        "Nurse Practitioner",
        "Midwife",
      ],
    },
  ];

  const skills = [
    "Compassion and Empathy: Understanding and responding to patients' emotional and physical needs.",
    "Communication and Interpersonal Skills: Effectively communicating with patients, families, and healthcare professionals.",
    "Critical Thinking and Problem-Solving: Analyzing patient situations, identifying problems, and developing appropriate solutions.",
    "Strong Organizational and Time-Management Skills: Prioritizing tasks, managing time effectively, and maintaining accurate records.",
    "Attention to Detail: Ensuring accurate medication administration, patient care, and documentation.",
    "Ability to Work Independently and as Part of a Team: Collaborating effectively with other healthcare professionals while also being able to work independently when necessary.",
    "Physical Stamina and Endurance: Withstanding the physical demands of the profession, such as long hours and lifting patients.",
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
        <h1>Bachelor of Science in Nursing</h1>
        <p>
          The Bachelor of Science in Nursing (BSN) program in Saudi Arabia is a
          rigorous academic and clinical training program that prepares
          graduates to become registered nurses. The curriculum focuses on
          providing students with the knowledge, skills, and values necessary to
          deliver high-quality, compassionate, and evidence-based patient care.
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
            src="./images/nurseinfo.jpg"
            alt="Nurse caring for a patient in a hospital setting"
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

export default MajorNursing;
