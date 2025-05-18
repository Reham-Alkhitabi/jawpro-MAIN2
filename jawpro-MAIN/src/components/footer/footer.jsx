import React from "react";
import { Link } from "react-router-dom";

import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <ul className="footer">
        <li>
          <a href="/CourseDiscovery">Explore Courses</a>
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

      <p className="footer">© 2024 JAWALAN. All rights reserved.</p>

    </footer>
  );
};

export default Footer;
