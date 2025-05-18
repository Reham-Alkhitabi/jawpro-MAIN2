import { useState, useRef } from "react";
import { Majors } from "./Majors";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import Lottie from "lottie-react";
import contactAnimation from "../../../src/animation/Majors.json";
import "./Discover.css";

const Discover = () => {
  const [arr, setArr] = useState(Majors);
  const [searchTerm, setSearchTerm] = useState("");
  const majorsRef = useRef(null);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const scrollToMajors = () => {
    majorsRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const filteredMajors = arr.filter((item) =>
    item.MajorTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Herodisdis Section */}
      <section className="discoverpage-herodis-section">
        <div className="discoverpage-herodis-container">
          {/* Left side: Text */}
          <motion.div
            className="discoverpage-herodis-content"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="discoverpage-herodis-title">Discover Your Future</h1>
            <p className="discoverpage-herodis-description">
              Begin your journey toward an exciting career by exploring diverse
              university majors across Saudi Arabia. Uncover insights, career
              prospects, and academic paths tailored to your aspirations.
            </p>
            <p className="discoverpage-herodis-sub-description">
              Let us help you navigate your options and choose a specialization
              that resonates with your personality and goals.
            </p>
            <button
              className="discoverpage-herodis-button"
              onClick={scrollToMajors}
            >
              Explore Majors
            </button>
          </motion.div>

          {/* Right side: Lottie Animation */}
          <motion.div
            className="discoverpage-herodis-animation"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <Lottie animationData={contactAnimation} loop={true} />
          </motion.div>
        </div>
      </section>

      {/* Majors Section */}
      <main className="discoverpage-discover-main flex" ref={majorsRef}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h2 className="discoverpage-herodis-title-s">
            Explore University Majors
          </h2>
          <p className="discoverpage-section-intro">
            Find the perfect fit for your talents and interests. Use the search
            bar below to navigate our comprehensive list of majors and unlock
            the path to your future success.
          </p>
        </motion.div>
        <input
          type="text"
          placeholder="Search for a major..."
          value={searchTerm}
          onChange={handleSearch}
          className="discoverpage-search-bar"
        />
        <section className="discoverpage-discover-right-section flex">
          <AnimatePresence>
            {filteredMajors.map((item) => (
              <motion.article
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", damping: 8, stiffness: 50 }}
                key={item.imgPath}
                className="discoverpage-discover-card"
              >
                <img src={item.imgPath} alt={item.MajorTitle} />
                <div className="discoverpage-discover-box">
                  <h1 className="discoverpage-discover-title">
                    {item.MajorTitle}
                  </h1>
                  <p className="discoverpage-discover-sub-title">
                    {item.description}
                  </p>
                </div>
                <div className="flex discoverpage-discover-icons">
                  <div style={{ gap: "11px" }} className="flex">
                  </div>
                  <Link
                    className="discoverpage-discover-link flex"
                    to={`/${item.MajorTitle.toLowerCase()
                      .replace(/ & /g, "-")
                      .replace(/ /g, "-")}`}
                  >
                    Learn More
                    <span
                      style={{ alignSelf: "end" }}
                      className="icon-arrow-right2"
                    ></span>
                  </Link>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
};

export default Discover;
