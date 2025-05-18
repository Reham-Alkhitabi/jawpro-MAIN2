import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./header.css";

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const [theme, setTheme] = useState(
    localStorage.getItem("currentMode") ?? "dark"
  );
  const [logoAnimating, setLogoAnimating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Update body class and persist theme preference
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
    localStorage.setItem("currentMode", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Handle logo click: trigger animation then navigate home
  const handleLogoClick = (e) => {
    e.preventDefault();
    setLogoAnimating(true);
    setTimeout(() => {
      navigate("/");
      setLogoAnimating(false);
    }, 500); // Duration matches the CSS animation time
  };

  // Use absolute paths for images for better resolution on various environments
  const logoSrc =
    theme === "dark" ? "/images/logo-dark.png" : "/images/logo.png";

  return (
    <header className="header flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setShowModal(true)}
        className="menu icon-list2 flex"
        aria-label="Open menu"
      ></button>

      {/* Logo with Animation */}
      <div className="logo-container">
        <a href="/" onClick={handleLogoClick}>
          <img
            src={logoSrc}
            alt="Logo"
            className={`logo rounded-logo ${
              logoAnimating ? "animate-logo" : ""
            }`}
          />
        </a>
      </div>

      {/* Navigation Links (Desktop) */}
      <nav className="center-section">
        <ul className="nav-list flex">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/CourseDiscovery">Explore Courses</Link>
          </li>
          <li>
            <Link to="/discover">Discover Majors</Link>
          </li>
          <li>
            <Link to="/pomodoro">Calendar</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>

      {/* Action Buttons */}
      <div className="right-section flex">
        <button
          onClick={toggleTheme}
          className="mode flex"
          aria-label="Toggle dark/light mode"
        >
          {theme === "dark" ? (
            <span className="icon-moon-fill"></span>
          ) : (
            <span className="icon-sun"></span>
          )}
        </button>
        <button
          className="profile flex"
          aria-label="User profile"
          onClick={() => navigate("/profile")} 
        >
          <span className="icon-user"></span>
        </button>
      </div>

      {/* Modal Menu (Mobile) */}
      {showModal && (
        <div className="fixed" role="dialog" aria-modal="true">
          <ul className="modal">
            <li className="close-modal">
              <button
                className="icon-x"
                onClick={() => setShowModal(false)}
                aria-label="Close menu"
              />
            </li>
            <li>
              <Link to="/" onClick={() => setShowModal(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/CourseDiscovery" onClick={() => setShowModal(false)}>
                Explore Courses
              </Link>
            </li>
            <li>
              <Link to="/discover" onClick={() => setShowModal(false)}>
                Discover Majors
              </Link>
            </li>
            <li>
              <Link to="/pomodoro" onClick={() => setShowModal(false)}>
                Calendar
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={() => setShowModal(false)}>
                About
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
