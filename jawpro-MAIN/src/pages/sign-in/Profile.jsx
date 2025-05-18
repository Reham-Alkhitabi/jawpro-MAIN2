import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../utils/firebase.utils";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { updatePassword, signOut, deleteUser } from "firebase/auth";
import { checkIfUsernameExists } from "../../utils/firebase.utils";
import { FaUser, FaLock, FaCheck } from "react-icons/fa";
import { motion } from "framer-motion";

const pageVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
};

import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formValues, setFormValues] = useState({
    displayName: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordHints, setPasswordHints] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordHints, setShowPasswordHints] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) return;
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUser(userSnap.data());
        setFormValues((prev) => ({
          ...prev,
          displayName: userSnap.data().displayName,
        }));
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });

    if (name === "newPassword") {
      setShowPasswordHints(value.length > 0); // Show hints only when typing starts
      setPasswordHints({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        number: /\d/.test(value),
        specialChar: /[@$!%*?&]/.test(value),
      });
    }
  };

  // Update username
  const handleUpdateUsername = async () => {
    if (!auth.currentUser) return;

    const { displayName } = formValues;
    if (displayName === user?.displayName) {
      setErrorMessage(
        "⚠️ New username must be different from the current one."
      );
      return;
    }

    const usernameExists = await checkIfUsernameExists(displayName);
    if (usernameExists) {
      setErrorMessage("⚠️ This username is already taken.");
      return;
    }

    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, { displayName });
      setUser((prev) => ({ ...prev, displayName }));
      setSuccessMessage("✅ Username updated successfully!");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(`⚠️ Error updating username: ${error.message}`);
    }
  };

  // Update password
  const handleUpdatePassword = async () => {
    if (!auth.currentUser) return;

    const { newPassword, confirmPassword } = formValues;

    if (!newPassword || !confirmPassword) {
      setErrorMessage("⚠️ Both password fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("⚠️ Passwords do not match.");
      return;
    }

    if (!Object.values(passwordHints).every(Boolean)) {
      setErrorMessage("⚠️ Password does not meet all security requirements.");
      return;
    }
    if (errorMessage === "auth/weak-password") {
      setErrorMessage(
        "⚠️ The password is too weak. Please choose a stronger password."
      );
    } else if (errorMessage === "auth/requires-recent-login") {
      setErrorMessage("⚠️ You need to sign in again to change your password.");
    } else if (errorMessage === "auth/invalid-email") {
      setErrorMessage("⚠️ Invalid email address.");
    } else {
      setErrorMessage(`⚠️ Error updating password: ${errorMessage}`);
    }
    try {
      await updatePassword(auth.currentUser, newPassword);
      setSuccessMessage("✅ Password updated successfully!");
      setErrorMessage("");
      setFormValues((prev) => ({
        ...prev,
        newPassword: "",
        confirmPassword: "",
      }));
      setShowPasswordHints(false);
    } catch (error) {
      setErrorMessage(`⚠️ Error updating password: ${error.message}`);
    }
  };

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (!auth.currentUser) return;
    try {
      await deleteDoc(doc(db, "users", auth.currentUser.uid));
      await deleteUser(auth.currentUser);
      setShowDeleteModal(false); // Close modal after deletion
      navigate("/");
    } catch (error) {
      setErrorMessage(`⚠️ Error deleting account: ${error.message}`);
    }
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageVariants}
      className="profilepage-container"
    >
      <div className="profilepage-box">
        <h1 className="profilepage-title">Profile</h1>

        {user ? (
          <>
            <p className="profilepage-text">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="profilepage-text">
              <strong>Username:</strong> {user.displayName}
            </p>
            <hr className="separatorpor" />
            {/* Username Update */}
            <div className="profilepage-input-group">
              <div>
                <FaUser className="input-icon" />
                <label className="profilepage-label">New Username:</label>
              </div>

              <input
                type="text"
                className="profilepage-input"
                value={formValues.displayName}
                onChange={handleChange}
                name="displayName"
              />
              <button
                className="profilepage-button"
                onClick={handleUpdateUsername}
              >
                Update Username
              </button>
            </div>
            {/* Password Update */}
            <div className="profilepage-input-group">
              <div>
                <FaLock className="input-icon" />
                <label className="profilepage-label">New Password:</label>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="profilepage-input"
                value={formValues.newPassword}
                onChange={handleChange}
                name="newPassword"
              />
            </div>
            {/* Confirm Password */}
            <div className="profilepage-input-group">
              <div>
                <FaCheck className="input-icon" />
                <label className="profilepage-label">
                  Confirm Password:
                </label>{" "}
              </div>

              <input
                type={showPassword ? "text" : "password"}
                className="profilepage-input"
                value={formValues.confirmPassword}
                onChange={handleChange}
                name="confirmPassword"
              />
            </div>
            {/* Show Password Checkbox */}
            <div className="password-toggle label">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label className="password-toggle label" htmlFor="showPassword">
                Show Password
              </label>
            </div>
            {/* Password Requirements */}
            {showPasswordHints && (
              <ul className="password-requirements">
                <li className={passwordHints.length ? "valid" : "invalid"}>
                  At least 8 characters
                </li>
                <li className={passwordHints.uppercase ? "valid" : "invalid"}>
                  At least one uppercase letter
                </li>
                <li className={passwordHints.number ? "valid" : "invalid"}>
                  At least one number
                </li>
                <li className={passwordHints.specialChar ? "valid" : "invalid"}>
                  At least one special character (@$!%*?&)
                </li>
              </ul>
            )}
            <button
              className="profilepage-button"
              onClick={handleUpdatePassword}
            >
              Update Password
            </button>
            {errorMessage && (
              <p className="profilepage-error">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="profilepage-success">{successMessage}</p>
            )}
            <hr className="separatorpor" />

            <div className="profilepage-btn-group">
              <button className="profilepage-logout" onClick={handleLogout}>
                Log out
              </button>
              <button
                className="profilepage-delete"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Account
              </button>
            </div>
          </>
        ) : (
          <p className="profilepage-text">Loading user data...</p>
        )}
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="profilepage-modal-overlay">
          <div className="profilepage-modal-content">
            <h2>⚠️ Warning</h2>
            <p>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="profilepage-modal-buttons">
              <button
                className="profilepage-cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="profilepage-delete-btn"
                onClick={handleDeleteAccount}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
};

export default Profile;
