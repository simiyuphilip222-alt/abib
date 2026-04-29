import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { verifyEmail } from "../api/auth";
import "./Auth.css";

export default function Verify() {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying your account...");

  useEffect(() => {
    const verify = async () => {
      try {
        await verifyEmail(token);
        setMessage("Email verified successfully. You can sign in now.");
      } catch (_error) {
        setMessage("This verification link is invalid or has expired.");
      }
    };

    verify();
  }, [token]);

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <p className="auth-eyebrow">Email Verification</p>
        <h1>Account confirmation</h1>
        <p className="auth-message">{message}</p>
      </div>
    </section>
  );
}
