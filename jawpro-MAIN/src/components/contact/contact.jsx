import "./contact.css";
import { useForm, ValidationError } from "@formspree/react";
import Lottie from "lottie-react";
import doneAnimation from "../../../src/animation/done.json";
import contactAnimation from "../../../src/animation/cs.json";
import { useState, useEffect } from "react";

const Contact = () => {
  const [state, handleSubmit] = useForm("mwpoprkb"); 
  const [formData, setFormData] = useState({ email: "", message: "" });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await handleSubmit(e);
  };

  useEffect(() => {
    if (state.succeeded) {
      setFormData({ email: "", message: "" });
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [state.succeeded]);

  return (
    <section className="contact-us">
      <h1 className="contact-us-title">
        <span className="contact-us-icon-envelope"></span> Contact us
      </h1>
      <p className="contact-us-sub-title">
        Contact us for more information and get notified when we publish something new.
      </p>

      <div className="contact-container flex">
        <form onSubmit={handleFormSubmit} className="contact-us-contact-form">
          <div className="flex">
            <label htmlFor="email">Email Address:</label>
            <input
              autoComplete="off"
              required
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled={state.submitting}
            />
            <ValidationError prefix="Email" field="email" errors={state.errors} />
          </div>

          <div className="flex" style={{ marginTop: "24px" }}>
            <label htmlFor="message">Your Message:</label>
            <textarea
              required
              name="message"
              id="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message..."
              disabled={state.submitting}
            ></textarea>
            <ValidationError prefix="Message" field="message" errors={state.errors} />
          </div>

          <button type="submit" disabled={state.submitting} className="contact-us-submit">
            {state.submitting ? "Submitting..." : "Submit"}
          </button>

          {showSuccess && (
            <p className="contact-us-success-message">
              <Lottie loop={false} style={{ height: 37 }} animationData={doneAnimation} />
              Your message has been sent successfully! 👌
            </p>
          )}
        </form>

        <div className="contact-us-animation">
          <Lottie
            className="contact-us-contact-animation"
            style={{ height: 355 }}
            animationData={contactAnimation}
          />
        </div>
      </div>
    </section>
  );
};

export default Contact;
