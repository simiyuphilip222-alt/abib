import React, { useState } from "react";
import { API_URL } from "../config/api";
import "./Contact.css";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ message: "", type: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name || !form.email || !form.message) {
      setStatus({ message: "All fields are required.", type: "error" });
      return;
    }

    setLoading(true);
    setStatus({ message: "", type: "" });

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus({
          message: "Message sent successfully. Our team will be in touch soon.",
          type: "success",
        });
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus({
          message: data.message || "Failed to send message. Please try again.",
          type: "error",
        });
      }
    } catch (_error) {
      setStatus({
        message: "Server error. Please try again in a little while.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-page">
      <div className="contact-page__shell">
        <div className="contact-page__panel">
          <span className="contact-page__eyebrow">Contact ABIB</span>
          <h1>Let&apos;s help customers reach you with confidence.</h1>
          <p className="contact-page__lead">
            Whether you have a product question, need order support, or want to talk
            about partnerships, this page now matches the rest of the storefront and
            keeps the path to support simple.
          </p>

          <div className="contact-page__points">
            <div className="contact-page__point">
              <strong>Fast support</strong>
              <span>Use the form for order questions, delivery concerns, or product guidance.</span>
            </div>
            <div className="contact-page__point">
              <strong>Clear follow-up</strong>
              <span>We keep messages concise and route them to the right team quickly.</span>
            </div>
            <div className="contact-page__point">
              <strong>Brand-ready presentation</strong>
              <span>Your published site now carries the same bright, polished tone on support pages too.</span>
            </div>
          </div>
        </div>

        <div className="contact-page__form-card">
          <h2>Send a message</h2>
          <p>Share the details below and we&apos;ll respond as soon as possible.</p>

          <form className="contact-page__form" onSubmit={handleSubmit}>
            <div className="contact-page__field">
              <label htmlFor="contact-name">Full name</label>
              <input
                id="contact-name"
                type="text"
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="contact-page__field">
              <label htmlFor="contact-email">Email address</label>
              <input
                id="contact-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="contact-page__field">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                placeholder="Tell us how we can help."
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>

            <button className="contact-page__submit" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>

            {status.message ? (
              <p
                className={`contact-page__status contact-page__status--${status.type}`}
              >
                {status.message}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
