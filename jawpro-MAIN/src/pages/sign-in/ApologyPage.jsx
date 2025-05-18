import React from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import "./ApologyPage.css"; 
import apologyAnimation from "../../animation/404.json"; 

const ApologyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="apology-container-pageeee">
      {/* Apology Message */}
      <div className="apology-content-pageeee">
        <h1 className="apology-title-pageeee">Oops! Access Denied 🚫</h1>
        <p className="apology-message-pageeee">
          We’re sorry, but this content is reserved for our <b> members</b>.
        </p>
        <p className="apology-message-pageeee">
          Don't miss out! <b>Join now</b> and unlock all the benefits.
        </p>

        {/* Lottie Animation */}
        <div className="apology-animation-pageeee">
          <Lottie
            animationData={apologyAnimation}
            className="apology-lottie-pageeee"
          />
        </div>
        {/* Buttons */}
        <div className="apology-buttons-pageeee">
          <button
            className="apology-login-btn-pageeee"
            onClick={() => navigate("/login-in")}
          >
            Login
          </button>
          <button
            className="apology-signup-btn-pageeee"
            onClick={() => navigate("/sign-in")}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApologyPage;
