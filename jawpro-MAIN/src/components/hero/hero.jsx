import React from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
const Hero = () => {
  const navigate = useNavigate();

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to JAWALAN</h1>
          <div className="hero-image">
            <img src="./images/Jawlan.gif" alt="Hero" className="hero-img" />
          </div>
          <p className="hero-subtitle">
            Discover your strengths, passions, and the path that’s right for you
            with JAWALAN. Our AI-powered assessments guide you to the best-fit
            majors and career fields. Plus, get ready for success with our
            specialized courses and mock exams for GAT, AAT, STEP, and more.
          </p>
          <div className="hero-features">
            <div className="herofeature">
              <span className="heroicon">🤖</span>
              <p>AI-Powered Personality Test</p>
            </div>
            <div className="herofeature">
              <span className="heroicon">📚</span>
              <p>University Entrance Exam Prep</p>
            </div>
            <div className="herofeature">
              <span className="heroicon">🔍</span>
              <p>Major & Specialization Guidance</p>
            </div>
            <div className="herofeature">
              <span className="heroicon">🎯</span>
              <p>Personalized Learning Path</p>
            </div>
          </div>
          <div className="hero-buttons">
            <button
              className="hero-button-login"
              role="button"
              aria-label="Log In"
              onClick={() => navigate("/login-in")}
            >
              Log In
            </button>
            <button
              className="hero-button-create-account"
              role="button"
              aria-label="Create Account"
              onClick={() => navigate("/sign-in")}
            >
              Create Account
            </button>{" "}
          </div>
        </div>
      </section>

      <div className="section-gap"></div>

      {/* Slider Section */}
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop={true}
        className="heroSwiper"
      >
        <SwiperSlide>
          <article className="hero-test">
            <div className="hero-test-content">
              <h1 className="hero-test-title">
                Evaluate Your Level with Our Mock Tests
              </h1>
              <p className="hero-test-description">
                Take our mock tests to assess your level and get personalized
                course recommendations for Qudurat, Tahsili, STEP, IELTS, and
                TOEFL.
              </p>
              <div className="hero-test-button">
                <button
                  onClick={() => navigate("/mock-tests")}
                  className="hero-button choose-test"
                >
                  Choose a Mock Test
                </button>
              </div>
            </div>
          </article>
        </SwiperSlide>

        <SwiperSlide>
          <article className="hero-test">
            <div className="hero-test-content">
              <h1 className="hero-test-title">
                Evaluate Yourself with Our AI Tests
              </h1>
              <p className="hero-test-description">
                Take our AI-powered assessments to discover your strengths,
                preferences, and ideal career or academic path.
              </p>
              <div className="hero-test-button">
                <button
                  onClick={() => navigate("/AI-tests")}
                  className="hero-button choose-test"
                >
                  Try The AI Test
                </button>
              </div>
            </div>
          </article>
        </SwiperSlide>
      </Swiper>
    </>
  );
};

export default Hero;