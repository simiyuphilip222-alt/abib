import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { register } from "../api/auth";
import GoogleLoginButton from "../components/GoogleLoginButton";
import "./Auth.css";

const PASSWORD_RULE =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

export default function Register({ setUserId }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const passwordIsValid = useMemo(
    () => PASSWORD_RULE.test(form.password),
    [form.password]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    if (!passwordIsValid) {
      setMessage(
        "Password must be at least 8 characters and include uppercase, lowercase, and a special character."
      );
      setBusy(false);
      return;
    }

    try {
      const { data } = await register(form);
      setMessage(
        data.verificationUrl
          ? `Account created. Verification link: ${data.verificationUrl}`
          : "Account created. Check your email to verify your account."
      );
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to create account.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <p className="auth-eyebrow">New Account</p>
        <h1>Create an account for order tracking and recovery.</h1>
        <p className="auth-copy">
          Registration is now aligned with verification and password recovery on the backend.
        </p>

        <div className="auth-socials">
          <div className="auth-google">
            <GoogleLoginButton setUserId={setUserId} onError={setMessage} />
          </div>
        </div>
        <p className="auth-helper">
          Continue with Google if your production Google OAuth client is already configured.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input
              type="text"
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm({ ...form, email: event.target.value })
              }
              required
            />
          </label>

          <label>
            Password
            <div className="auth-password-field">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(event) =>
                  setForm({ ...form, password: event.target.value })
                }
                minLength={8}
                required
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </label>

          <p className={`auth-helper ${form.password && !passwordIsValid ? "is-invalid" : ""}`}>
            Use at least 8 characters with uppercase, lowercase, and a special character.
          </p>

          {message ? <p className="auth-message">{message}</p> : null}

          <button type="submit" className="auth-submit" disabled={busy}>
            {busy ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login">Already have an account?</Link>
        </div>
      </div>
    </section>
  );
}
