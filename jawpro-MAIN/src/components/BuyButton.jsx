import React, { useEffect, useState } from "react";
import { isCoursePaid, auth } from "../utils/firebase.utils";
import { useNavigate } from "react-router-dom";

const BuyButton = ({ courseId, courseTitle }) => {
  const [hasPaid, setHasPaid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkPayment = async () => {
      if (auth.currentUser && courseId) {
        const paid = await isCoursePaid(courseId);
        setHasPaid(paid);
      }
    };
    checkPayment();
  }, [courseId]);

  const handleClick = () => {
    if (!courseId || !courseTitle) {
      console.error("Invalid courseId or courseTitle in BuyButton");
      return;
    }

    if (hasPaid) {
      navigate(`/${courseId}`);
    } else {
      console.log("Navigating to payment with:", courseId, courseTitle);
      navigate(`/payment/${courseId}`, {
        state: { courseId, courseTitle },
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 rounded-xl shadow-md font-medium ${
        hasPaid ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
      } text-white`}
    >
      {hasPaid ? "Access Course" : "Enroll Now"}
    </button>
  );
};

export default BuyButton;