import React from "react";
import "./about.css";
import Lottie from "lottie-react";
import teamAnimation from "../../../src/animation/team.json";
import { motion } from "framer-motion";

const pageVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
};
const teamMembers = [
  {
    name: "Lena Saad Al-Garni",
    email: "s443006531@uqu.edu.sa",
    role: "Team Member",
  },
  {
    name: "Norh Sahel Allehyani",
    email: "s443002493@uqu.edu.sa",
    role: "Project Leader",
  },
  {
    name: "Haifa Mohammed Alsulami",
    email: "s443001840@uqu.edu.sa",
    role: "Team Member",
  },
  {
    name: "Reham Abdullah Al-khitabi",
    email: "s443001677@uqu.edu.sa",
    role: "Team Member",
  },
];

const About = () => {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageVariants}
      className="aboutpage-us"
    >
      <h1 className="aboutpage-title">About Us</h1>
      <p className="aboutpage-sub-title">
        Welcome to the JAWALAN platform! This project is a culmination of hard
        work, innovation, and a shared vision to support high school students in
        shaping their academic and professional futures. As female computer
        science students, we recognized the challenges students face when
        deciding on their career paths and excelling academically. With this in
        mind, we created JAWALAN—a platform designed to provide personalized
        guidance and resources to help students confidently navigate their
        educational journey.
      </p>

      <div className="aboutpage-card">
        <h2 className="aboutpage-section-title">Vision:</h2>
        <p className="aboutpage-pra">
          JAWALAN was born out of a vision to empower high school students by
          bridging the gap between academic success and career exploration. We
          aim to provide a comprehensive platform that integrates learning
          tools, interest assessments, and career guidance, all tailored to the
          individual needs of each student. The project also serves as a
          testament to the creativity and innovation of women in tech,
          showcasing how technology can solve real-world problems. By using
          Artificial Intelligence, JAWALAN aims to inspire students to dream
          bigger, explore opportunities, and make informed decisions about their
          futures.
        </p>
      </div>

      <div className="aboutpage-card">
        <h2 className="aboutpage-section-title">Why We Created JAWALAN ?</h2>
        <p className="aboutpage-pra">
          As students ourselves, we understood the overwhelming task high
          schoolers face in choosing a major or career path without sufficient
          guidance. Often, existing platforms focus solely on either academic
          support or career guidance but rarely offer both in a seamless,
          integrated manner. We created JAWALAN to address this gap and provide:
        </p>
        <ul className="aboutpage-list">
          <li>
            <strong>Tailored Recommendations:</strong>Through AI-powered
            assessments, students can explore majors and careers that align with
            their interests, skills, and goals.
          </li>
          <li>
            <strong>Comprehensive Learning Paths:</strong>Personalized roadmaps
            for academic success, combining diagnostic tests, course
            recommendations, and soft skill development.
          </li>
          <li>
            <strong>Ease of Access to Information:</strong>Detailed descriptions
            of various academic majors, required skills, and career
            opportunities help students make well-informed decisions.
          </li>
          <li>
            <strong>Engagement and Interactivity:</strong>Features like quizzes,
            preparation exams, and a visually engaging interface make learning
            enjoyable and effective.
          </li>
        </ul>
      </div>

      <div className="aboutpage-card">
        <h2 className="aboutpage-section-title">Advantages of JAWALAN:</h2>
        <ul className="aboutpage-list">
          <li>
            <strong>Dual Focus:</strong>Combines academic support with career
            guidance, helping students excel in their studies while exploring
            future opportunities.
          </li>
          <li>
            <strong>AI-Driven Personalization:</strong>Offers individualized
            recommendations for courses, careers, and learning paths based on
            students' strengths and preferences.
          </li>
          <li>
            <strong>User-Friendly Experience:</strong>Designed with
            accessibility and simplicity in mind, ensuring that even students
            with limited technical skills can benefit.
          </li>
          <li>
            <strong>Resource Hub:</strong>Includes detailed insights into
            majors, preparatory tools for high school exams, and soft skills
            training to prepare students for higher education and beyond.
          </li>
          <li>
            <strong>Time Management Tools:</strong>Scheduling features and task
            reminders help students stay organized and focused on their goals.
          </li>
        </ul>
      </div>

      <div className="aboutpage-card">
        <h2 className="aboutpage-section-title">Student Showcase:</h2>
        <div className="aboutpage-team-cards">
          {teamMembers.map((member) => (
            <div key={member.email} className="aboutpage-team-member">
              <Lottie
                className="aboutpage-team-animation"
                animationData={teamAnimation}
                loop
              />
              <div className="aboutpage-team-info">
                <h3 className="aboutpage-team-name">{member.name}</h3>
                <p className="aboutpage-team-role">{member.role}</p>
                <p className="aboutpage-team-email">{member.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default About;
