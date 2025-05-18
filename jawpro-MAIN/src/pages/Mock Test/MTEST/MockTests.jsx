import { useState, useRef } from "react";
import { Tests } from "./Tests"; 
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./MockTests.css";

const MockTests = () => {
  const [tests, setTests] = useState(Tests);
  const [searchTerm, setSearchTerm] = useState("");
  const testsRef = useRef(null);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTests = tests.filter((test) =>
    test.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Hero Section */}
      <div className="mock-tests-hero-container">
        <h1 className="mock-tests-hero-title">Test Your Knowledge</h1>
        <p className="mock-tests-hero-description">
          Evaluate your level in Qudurat, Tahsili, STEP, IELTS, and TOEFL with
          our mock tests. Get personalized course recommendations based on your
          results.
        </p>

        <p className="mock-tests-section-intro">
          Search and select a test to evaluate your skills and get course
          recommendations.
        </p>
      </div>
      {/* Tests Section */}
      <main className="mock-tests-main-flex" ref={testsRef}>
        <input
          type="text"
          placeholder="Search for a test..."
          value={searchTerm}
          onChange={handleSearch}
          className="mock-tests-search-bar"
        />

        <section className="mock-tests-list">
          <AnimatePresence>
            {filteredTests.map((test) => (
              <motion.article
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", damping: 8, stiffness: 50 }}
                key={test.imgPath}
                className="mock-tests-card"
              >
                <img src={test.imgPath} alt={test.title} />
                <div className="mock-tests-box">
                  <h1 className="mock-tests-title">{test.title}</h1>
                  <p className="mock-tests-sub-title">{test.description}</p>
                </div>
                <div className="mock-tests-icons">
                  <Link
                    className="mock-tests-link"
                    to={`/${test.title.toLowerCase().replace(/ /g, "-")}`}
                  >
                    Start Test
                    <span className="mock-tests-icon-arrow-right">➡</span>
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

export default MockTests;
