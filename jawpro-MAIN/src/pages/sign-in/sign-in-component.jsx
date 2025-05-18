import React, { useState,useEffect } from "react";
import "./sign-in-component.css";
import { useNavigate } from "react-router-dom";
import {
  signInWithGooglePopup,
  createUserDocumentFromAuth,
  createAuthUserWithEmailAndPassword,
  checkIfUsernameExists,
} from "../../utils/firebase.utils.js";
import { updateProfile } from "firebase/auth";

import {
  FaGoogle,
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaVenusMars,
  FaCheck,
} from "react-icons/fa";
import Lottie from "lottie-react";
import loginAnimation from "../../../src/animation/Registration.json";
import { motion } from "framer-motion"; 


const pageVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
};



const defaultFormFields = {
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
  gender: "",
  phone: "",
};

const SignUp = () => {
  const [formValues, setFormValues] = useState(defaultFormFields);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordHints, setShowPasswordHints] = useState(false);
  const navigate = useNavigate();

  const { displayName, email, password, confirmPassword, gender, phone } =
    formValues;

    const signGoogleuser = async () => {
  try {
    const { user } = await signInWithGooglePopup();
    await createUserDocumentFromAuth(user);
    navigate("/profile");
  } catch (error) {
    console.error("Google sign-in error:", error);
    setErrorMessage("⚠️ Failed to sign in with Google.");
  }
};
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });

    if (name === "password") {
      setShowPasswordHints(true);
      setPasswordRequirements({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        number: /\d/.test(value),
        specialChar: /[@$!%*?&]/.test(value),
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
  
    if (password !== confirmPassword) {
      setErrorMessage("⚠️ Passwords do not match.");
      return;
    }
  
    if (!Object.values(passwordRequirements).every(Boolean)) {
      setErrorMessage("⚠️ Password does not meet all security requirements.");
      return;
    }
  
    if (!gender) {
      setErrorMessage("⚠️ Please select your gender.");
      return;
    }
  
    if (!/^\d{10}$/.test(phone)) {
      setErrorMessage("⚠️ Phone number must be exactly 10 digits.");
      return;
    }
  
    const usernameExists = await checkIfUsernameExists(displayName);
    if (usernameExists) {
      setErrorMessage(
        "⚠️ This username is already taken. Please choose another."
      );
      return;
    }
  
    try {
      // 1. Create the user with email and password
      const { user } = await createAuthUserWithEmailAndPassword(email, password);
  
      // 2. Set the displayName on Firebase Authentication profile
      await updateProfile(user, { displayName });
  
      // 3. Create Firestore user document with extra fields
      await createUserDocumentFromAuth(user, { displayName, gender, phone });
  
      // 4. Reset form and redirect
      setFormValues(defaultFormFields);
      navigate("/profile");
    } catch (error) {
      setErrorMessage(formatFirebaseError(error.message));
    }
  };
  

  const formatFirebaseError = (message) => {
    if (message.includes("email-already-in-use"))
      return "⚠️ This email is already registered.";
    if (message.includes("weak-password")) return "⚠️ Password is too weak.";
    if (message.includes("invalid-email"))
      return "⚠️ Please enter a valid email address.";
    return `⚠️ ${message}`;
  };
  
  useEffect(() => {
    if (errorMessage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [errorMessage]);
  
  return (
    <motion.section
    className="signup-container"
    initial="hidden"
    animate="visible"
    exit="exit"
    variants={pageVariants}
  >      {/* Left Section: Lottie Animation */}
      <div className="signup-animation-section">
          <Lottie
            animationData={loginAnimation}
            className="signup-animation"
          />
      </div>

      {/* Right Section: Sign Up Form */}
      <div className="signup-form-section">

        <h2>Sign Up</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            {" "}
            <FaUser className="signup-input-icon" />
            <label className="input-label ">User Name:</label>
          </div>

          <input
            className="input-group"
            placeholder="Enter your username"
            type="text"
            value={displayName}
            onChange={handleChange}
            name="displayName"
            required
          />
          <div>
            {" "}
            <FaEnvelope className="signup-input-icon" />
            <label className="input-label">Email:</label>
          </div>

          <input
            className="input-group"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleChange}
            name="email"
            required
          />
          <div>
            <FaLock className="signup-input-icon" />
            <label className="input-label">Password:</label>
          </div>

          <input
            className="input-group"
            type={showPassword ? "text" : "password"}
            value={password}
            placeholder="Enter your password"
            onChange={handleChange}
            name="password"
            required
          />
          <div className="password-toggle">
            <input
              type="checkbox"
              id="showPassword"
              onChange={() => setShowPassword(!showPassword)}
            />
            <label className="password-toggle label" htmlFor="showPassword">
              {" "}
              Show Password
            </label>
          </div>
          {showPasswordHints && (
            <ul className="password-requirements">
              <li className={passwordRequirements.length ? "valid" : "invalid"}>
                 At least 8 characters
              </li>
              <li
                className={passwordRequirements.uppercase ? "valid" : "invalid"}
              >
                 At least one uppercase letter
              </li>
              <li className={passwordRequirements.number ? "valid" : "invalid"}>
                 At least one number
              </li>
              <li
                className={
                  passwordRequirements.specialChar ? "valid" : "invalid"
                }
              >
                 At least one special character (@$!%*?&)
              </li>
            </ul>
          )}

          <div>
            <FaCheck className="signup-input-icon" />
            <label className="input-label">Confirm Password:</label>
          </div>
          <input
            className="input-group"
            type={showPassword ? "text" : "password"}
            placeholder="Re-enter the password."
            value={confirmPassword}
            onChange={handleChange}
            name="confirmPassword"
            required
          />

          <div>
            <FaPhone className="signup-input-icon" />
            <label className="input-label">Phone:</label>
          </div>
          <input
            className="input-group"
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={handleChange}
            name="phone"
            required
          />

          <div className="styled-select">
            <div>
              {" "}
              <FaVenusMars className="signup-input-icon" />
              <label className="input-label">Gender:</label>
            </div>
            <select
              name="gender"
              value={gender}
              onChange={handleChange}
              required
              className="Gender-list"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <button type="submit" className="loginpage-login-btn">
            Sign Up
          </button>
        </form>
        {/* Sign Up with Google */}
        <p className="social-text">
          ---------- <span>Or Sign in with</span> ----------
        </p>
        <div className="social-login">
          <div onClick={signGoogleuser} className="google">
            <FaGoogle className="google-icon" />
            <span>Google</span>
          </div>
        </div>
        <hr className="separator" /> {/* Separator Line */}
        <p className="signinpage-login">Already have an account?</p>
        <button
          className="signinpage-login-btn"
          onClick={() => navigate("/login-in")}
        >
          Login NOW!
        </button>

      </div>
      
    </motion.section>

  );
};

export default SignUp;