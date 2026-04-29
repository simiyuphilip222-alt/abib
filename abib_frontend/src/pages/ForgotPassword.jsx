import React, { useState } from "react";
import { forgotPassword } from "../api/auth";
import "./Auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);

    try {
      const { data } = await forgotPassword({ email });
      setMessage(
        data.resetUrl
          ? `Reset link: ${data.resetUrl}`
          : data.message || "If the account exists, a reset link has been sent."
      );
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to send reset email.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <p className="auth-eyebrow">Password Recovery</p>
        <h1>Reset access without losing your account.</h1>
        <p className="auth-copy">
          Enter your email address and we will send a reset link if the account exists.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          {message ? <p className="auth-message">{message}</p> : null}

          <button type="submit" className="auth-submit" disabled={busy}>
            {busy ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </section>
  );
}
