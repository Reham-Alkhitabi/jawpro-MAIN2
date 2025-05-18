import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./main.css";
import { ourCourses } from "./proimage";
import { AnimatePresence, motion } from "framer-motion";
import {
  bookmarkCourse,
  removeBookmark,
  auth,
  db,
} from "../../utils/firebase.utils.js";
import { doc, getDoc } from "firebase/firestore";

const Main = () => {
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notification, setNotification] = useState("");

  const [currentActive, setCurrentActive] = useState("all");
  const [filteredCourses, setFilteredCourses] = useState(ourCourses);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookmarked, setBookmarked] = useState([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      filterCourses(currentActive, searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, currentActive]);
  const handleBookmark = async (course) => {
    if (!auth.currentUser) {
      setNotification("🔒 Please log in to bookmark courses.");
      setShowNotificationModal(true);
      return;
    }

    const isBookmarked = bookmarked.some(
      (b) => b.CoursesTitle === course.CoursesTitle
    );

    try {
      if (isBookmarked) {
        await removeBookmark(course);
        setBookmarked(
          bookmarked.filter((b) => b.CoursesTitle !== course.CoursesTitle)
        );
        setNotification("❌ Removed from bookmarks.");
      } else {
        await bookmarkCourse(course);
        setBookmarked([...bookmarked, course]);
        setNotification("✅ Course bookmarked!");
      }

      setShowNotificationModal(true);
      setTimeout(() => {
        setNotification("");
        setShowNotificationModal(false);
      }, 3000);
    } catch (error) {
      console.error("Bookmarking failed:", error);
      setNotification("⚠️ Failed to update bookmark. Please try again.");
      setShowNotificationModal(true);
    }
  };

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!auth.currentUser) return;

      const userRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        setBookmarked(docSnap.data().bookmarkedCourses || []);
      }
    };

    fetchBookmarks();
  }, []);

  const filterCourses = (category, search) => {
    setCurrentActive(category);

    const filtered = ourCourses.filter((course) => {
      const matchesCategory =
        category === "all" || course.category.includes(category);
      const matchesSearch =
        !search ||
        course.CoursesTitle.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    setFilteredCourses(filtered);
  };

  return (
    <main className="maincom-main flex">
      {showNotificationModal && (
        <div className="notification-modal-overlay">
          <div className="notification-modal-content">
            <h2>📌 Notification</h2>
            <p>{notification}</p>
            <div className="notification-modal-buttons">
              {!auth.currentUser && (
                <button
                  className="notification-ok-btn"
                  onClick={() => {
                    setShowNotificationModal(false);
                    window.location.href = "/login-in";
                  }}
                >
                  Login!
                </button>
              )}
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

      <section className="maincom-left-section flex">
        <div className="maincom-search-bar">
          <input
            type="text"
            placeholder="Search Courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {[
          "all",
          "Soft Skills",
          "Test Preparation",
          "STEM",
          "Humanities & Social Sciences",
          "Business & Economics",
          "Career Exploration",
        ].map((category) => (
          <button
            key={category}
            onClick={() => setCurrentActive(category)}
            className={currentActive === category ? "active" : ""}
          >
            {category.replace(" & ", " &\n")}
          </button>
        ))}
      </section>

      <section className="maincom-right-section flex">
        {filteredCourses.length === 0 ? (
          <p className="no-results">No results found</p>
        ) : (
          <AnimatePresence>
            {filteredCourses.map((course) => (
              <motion.article
                layout
                initial={{ scale: 0.4 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 8, stiffness: 50 }}
                key={course.id}
                className="maincom-card"
              >
                <img src={course.imgPath} alt={course.CoursesTitle} />
                <div className="maincom-box">
                  <h1 className="maincom-title">{course.CoursesTitle}</h1>
                  <p className="maincom-sub-title">{course.description}</p>
                  <p className="maincom-price">
                    <img
                      src="https://www.sama.gov.sa/ar-sa/Currency/Documents/Saudi_Riyal_Symbol-2.svg"
                      alt="SAR"
                      className="riyal-symbol"
                    />
                    {course.price}
                  </p>
                  <div className="maincom-icons flex">
                    <button
                      onClick={() => handleBookmark(course)}
                      className={
                        bookmarked.some(
                          (b) => b.CoursesTitle === course.CoursesTitle
                        )
                          ? "bookmarked"
                          : ""
                      }
                    >
                      {bookmarked.some(
                        (b) => b.CoursesTitle === course.CoursesTitle
                      )
                        ? "★ Bookmarked"
                        : "☆ Bookmark"}
                    </button>

                    <Link
                      className="maincom-link flex"
                      to={`/${course.CoursesTitle.toLowerCase()
                        .replace(/ & /g, "-")
                        .replace(/ /g, "-")}`}
                    >
                      More
                      <span className="icon-arrow-right2"></span>
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        )}
      </section>
    </main>
  );
};

export default Main;
