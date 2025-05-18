import React from 'react';
import Hero from '../components/hero/Hero';
import Main from '../components/main/Main';
import Contact from '../components/contact/Contact';
import { motion } from "framer-motion";

const pageVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
};
const HomePage = () => {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageVariants}
    >
    <div >
      <Hero />
      <div className="divider" />
      <Main />
      <div className="divider" />
      <Contact />
      </div>
      </motion.section>
    );
};

export default HomePage;