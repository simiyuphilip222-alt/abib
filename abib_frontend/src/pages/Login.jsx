import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { login } from "../api/auth";
import GoogleLoginButton from "../components/GoogleLoginButton";
import "./Auth.css";

export default function Login({ setUserId }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const { data } = await login(form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      window.dispatchEvent(new Event("authChange"));

      if (setUserId) {
        setUserId(data.user.id);
      }

      navigate("/account");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <p className="auth-eyebrow">Account Access</p>
        <h1>Sign in to continue checkout securely.</h1>
        <p className="auth-copy">
          Use your ABIB account to review orders, recover access, and complete PayPal checkout.
        </p>

        <div className="auth-socials">
          <div className="auth-google">
            <GoogleLoginButton
              setUserId={setUserId}
              onError={setMessage}
              onSuccess={() => navigate("/account")}
            />
          </div>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
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

          {message ? <p className="auth-message">{message}</p> : null}

          <button type="submit" className="auth-submit" disabled={busy}>
            {busy ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/forgot">Forgot password?</Link>
          <Link to="/register">Create account</Link>
        </div>
      </div>
    </section>
  );
}
