import { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  auth,
  createUserDocumentFromAuth,
  signInWithGooglePopup,
} from "../../utils/firebase.utils.js";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import loginAnimation from "../../../src/animation/loginn.json";
import "./Login.css";
import { FaEnvelope, FaLock, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";

const pageVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
};

const signGoogleUser = async (navigate, setError, setMessage) => {
  try {
    const { user } = await signInWithGooglePopup();
    await createUserDocumentFromAuth(user);
    setMessage("Login successful! Redirecting...");
    setTimeout(() => navigate("/profile"), 2000);
  } catch (error) {
    setError("An error occurred during Google login. Please try again.");
  }
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false); // For Google login loading state

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
  
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("Login successful! Redirecting...");
      setTimeout(() => navigate("/profile"), 2000);
    } catch (error) {
      // Log the full error object for debugging
      console.error("Login error:", error);
      
      if (error.code === "auth/invalid-credential") {
        setError("");
      } else if (error.code === "auth/invalid-credential") {
        setError("No account found with this email. or Incorrect email/password.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  
    setLoading(false);
  };
  

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email first.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent!");
    } catch (error) {
      setError("Error sending password reset email.");
    }
  };

  // Email validation regex pattern
  const isValidEmail = email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageVariants}
    >
      <div className="loginpage-container">
        {/* Left: Lottie Animation */}
        <div className="loginpage-animation-section">
          <Lottie animationData={loginAnimation} className="loginpage-animation" />
        </div>

        {/* Right: Login Form */}
        <div className="loginpage-form-section">
          <h2>Welcome Back!</h2>
          <p className="loginpage-welcome">Please log in to continue</p>
          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <FaEnvelope className="loginpage-input-icon" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email"
                className={!isValidEmail && email ? "input-error" : ""}
              />
              {!isValidEmail && email && (
                <span className="error-message">Please enter a valid email.</span>
              )}
            </div>

            {/* Password Input with Show/Hide Toggle */}
            <div className="input-group password-group">
              <FaLock className="loginpage-input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Password"
              />
              <button
                type="button"
                className="show-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              className="loginpage-login-btn"
              disabled={loading || !isValidEmail}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="loginpage-extra-options forgot">
            <span onClick={handleForgotPassword}>Forgot Password?</span>
          </p>

          {/* Sign Up with Google */}
          <p className="social-text">
            ---------- <span>Or Sign up with</span> ----------
          </p>
          <div className="social-login">
            <div
              onClick={() => {
                setGoogleLoading(true);
                signGoogleUser(navigate, setError, setMessage);
              }}
              className="google"
              aria-label="Sign in with Google"
            >
              {googleLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  <FaGoogle className="google-icon" />
                  <span>Google</span>
                </>
              )}
            </div>
          </div>

          <div className="separator" />

          <p className="loginpage-register">Don't have an account?</p>
          <button className="loginpage-register-btn" onClick={() => navigate("/sign-in")}>
            Sign Up NOW!
          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default Login;
