import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { resetPassword } from "../api/auth";
import "./Auth.css";

const PASSWORD_RULE =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const passwordIsValid = useMemo(
    () => PASSWORD_RULE.test(password),
    [password]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);

    if (!passwordIsValid) {
      setMessage(
        "Password must be at least 8 characters and include uppercase, lowercase, and a special character."
      );
      setBusy(false);
      return;
    }

    try {
      const { data } = await resetPassword(token, { password });
      setMessage(data.message || "Password updated.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to reset password.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <p className="auth-eyebrow">Reset Password</p>
        <h1>Set a fresh password for your account.</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            New password
            <div className="auth-password-field">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
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

          <p className={`auth-helper ${password && !passwordIsValid ? "is-invalid" : ""}`}>
            Use at least 8 characters with uppercase, lowercase, and a special character.
          </p>

          {message ? <p className="auth-message">{message}</p> : null}

          <button type="submit" className="auth-submit" disabled={busy}>
            {busy ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </section>
  );
}
