import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  signInWithGooglePopup,
  createUserDocumentFromAuth,
  createAuthUserWithEmailAndPassword,
  checkIfUsernameExists,
} from "../utils/firebase.utils.js";
import API_BASE_URL from "../config/api"; // Your backend API base URL
import { updateProfile } from "firebase/auth"; // Add this at the top

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Firebase Sign-In with Google
  const signGoogleUser = async () => {
    try {
      const { user } = await signInWithGooglePopup();
      await createUserDocumentFromAuth(user); // Store user data in Firestore
      navigate("/home");
    } catch (error) {
      setError("⚠ Failed to sign in with Google.");
    }
  };

  // Handle form submit for Email/Password registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("⚠ Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      // Check if the username already exists in Firestore (Optional step)
      const usernameExists = await checkIfUsernameExists(username);
      if (usernameExists) {
        setError("⚠ This username is already taken. Please choose another.");
        setLoading(false);
        return;
      }

      // Create Firebase user with email and password
      const { user } = await createAuthUserWithEmailAndPassword(
        email,
        password
      );
      await updateProfile(user, {
        displayName: username,
      });
      // Create Firestore user document with extra fields (username, gender, phone)
      await createUserDocumentFromAuth(user, { username, gender, phone });

      // Optionally send data to backend
      const response = await fetch('${API_BASE_URL}/api/auth/register', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, gender, phone }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Store backend token in localStorage (if backend login successful)
      localStorage.setItem("token", data.token);

      // Redirect to home or login page after successful registration
      navigate("/home");
    } catch (err) {
      setError(err.message || "⚠ An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page" style={{ padding: "2rem" }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label htmlFor="username">Username:</label>
          <br />
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>

        <div style={{ marginTop: "1rem" }}>
          <label htmlFor="email">Email:</label>
          <br />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div style={{ marginTop: "1rem" }}>
          <label htmlFor="password">Password:</label>
          <br />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
        </div>

        <div style={{ marginTop: "1rem" }}>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <br />
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        <div style={{ marginTop: "1rem" }}>
          <label htmlFor="phone">Phone:</label>
          <br />
          <input
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            pattern="^\d{10}$" // Assuming you want a 10-digit phone number
            autoComplete="tel"
          />
        </div>

        <div style={{ marginTop: "1rem" }}>
          <label htmlFor="gender">Gender:</label>
          <br />
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {error && (
          <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>
        )}

        <button
          type="submit"
          style={{ marginTop: "1.5rem" }}
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p style={{ marginTop: "1rem" }}>
        Already have an account? <Link to="/">Login here</Link>
      </p>

      {/* Google Sign-In Button */}
      <div>
        <button
          onClick={signGoogleUser}
          style={{ marginTop: "1.5rem" }}
          disabled={loading}
        >
          {loading ? "Signing in with Google..." : "Sign In with Google"}
        </button>
      </div>
    </div>
  );
}

export default RegisterPage;