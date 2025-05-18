import React, { useState, useEffect } from "react";
import "./PaymentPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import { markCourseAsPaid } from "../../utils/firebase.utils";
import {
  FaCreditCard,
  FaCalendarAlt,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [selectedMethod, setSelectedMethod] = useState("mada");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [errors, setErrors] = useState({});
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCvcInfo, setShowCvcInfo] = useState(false);

  useEffect(() => {
    if (isPaymentSuccess) {
      const timeout = setTimeout(() => {
        navigate(`/${state.courseId}`);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [isPaymentSuccess, navigate, state?.courseId]);

  const validate = () => {
    const newErrors = {};
    const rawCardNumber = cardNumber.replace(/\s/g, "");
    if (!/^\d{16}$/.test(rawCardNumber)) newErrors.cardNumber = "Card number must be 16 digits.";
    if (!/^\d{2}\/\d{2}$/.test(expiry)) newErrors.expiry = "Expiry must be in MM/YY format.";
    if (!/^\d{3}$/.test(cvc)) newErrors.cvc = "CVC must be 3 digits.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentSuccess = async () => {
    if (!validate()) return;
    setIsProcessing(true);
    try {
      await markCourseAsPaid(state.courseId, state.courseTitle);
      setIsPaymentSuccess(true);
    } catch (error) {
      console.error("Payment failed:", error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMethodChange = (method) => {
    setSelectedMethod(method);
    setCardNumber("");
    setExpiry("");
    setCvc("");
    setErrors({});
  };

  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const handleCardNumberChange = (e) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e) => {
    let input = e.target.value.replace(/[^\d]/g, "");
    if (input.length > 4) input = input.slice(0, 4);
    if (input.length >= 3) {
      input = `${input.slice(0, 2)}/${input.slice(2)}`;
    }
    setExpiry(input);
  };

  if (!state?.courseId || !state?.courseTitle) {
    return <p className="PaymentPagepra">Invalid payment link.</p>;
  }

  return (
    <div className="payment-container">
      <h2  className="PaymentPageh2">Payment:</h2>
      <div className="card-preview">
        <div className="card-top">
          <img src="/images/chip.png" alt="chip" className="chip" />
          <img
            src={
              selectedMethod === "mada"
                ? "/images/Mada_Logo.svg"
                : "/images/visa_logo.svg"
            }
            alt="logo"
            className="card-logo"
          />
        </div>
        <div className="card-number">
          {cardNumber || "•••• •••• •••• ••••"}
        </div>
        <div className="card-details">
          <div className="card-expiry">
            <label>Expiry</label>
            <span>{expiry || "MM/YY"}</span>
          </div>
          <div className="card-cvc">
            <label>CVC</label>
            <span>{cvc || "•••"}</span>
          </div>
        </div>
      </div>

      <h2 className="PaymentPageh2">Buy: {state.courseTitle}</h2>
      <p className="PaymentPagepra">One-time payment for full course access.</p>

      <div className="payment-methods">
        <label>
          <input
            type="radio"
            value="mada"
            checked={selectedMethod === "mada"}
            onChange={() => handleMethodChange("mada")}
          />
          <img src="/images/mada.png" alt="Mada" className="method-logo" />
        </label>
        <label>
          <input
            type="radio"
            value="visa mastercard"
            checked={selectedMethod === "visa mastercard"}
            onChange={() => handleMethodChange("visa mastercard")}
          />
          <img src="/images/visa_logo.svg" alt="Visa Mastercard" className="method-logo" />
        </label>
      </div>

      <form className="payment-form">
        <div className="payment-input-group">
          <FaCreditCard />
          <input
            type="text"
            placeholder="Card Number"
            value={cardNumber}
            onChange={handleCardNumberChange}
            maxLength={19}
          />
        </div>
        {errors.cardNumber && <p className="error">{errors.cardNumber}</p>}

        <div className="payment-input-group">
          <FaCalendarAlt />
          <input
            type="text"
            placeholder="MM/YY"
            value={expiry}
            onChange={handleExpiryChange}
            maxLength={5}
          />
        </div>
        {errors.expiry && <p className="error">{errors.expiry}</p>}

        <div className="payment-input-group">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="text"
              placeholder="CVC"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 3))}
              maxLength={3}
            />
            <FaInfoCircle
              title="What is CVC?"
              className="info-icon"
              onClick={() => setShowCvcInfo((prev) => !prev)}
            />
          </div>
        </div>
        {errors.cvc && <p className="error">{errors.cvc}</p>}

        {showCvcInfo && (
          <div className="cvc-popup">
            <img src="/images/cvc-info.png" alt="CVC info" className="cvc-image" />
          </div>
        )}
      </form>

      <button
        onClick={handlePaymentSuccess}
        className="PaymentPagebutton"
        disabled={isProcessing}
      >
        <FaCreditCard style={{ marginRight: "8px" }} />
        {isProcessing ? "Processing..." : "Pay & Access"}
      </button>

      {isPaymentSuccess && (
        <div className="payment-success">
          <FaCheckCircle size={40} color="green" />
          <p>Payment Successful! Redirecting...</p>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
