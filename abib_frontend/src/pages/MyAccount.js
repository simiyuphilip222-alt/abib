import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../api/auth";
import { logout } from "../utils/auth";
import "./Auth.css";

function MyAccount({ setUserId }) {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    const loadUser = async () => {
      try {
        const { data } = await getCurrentUser(token);
        setUser(data.user);
      } catch (_error) {
        setMessage("Your session has expired. Please sign in again.");
      }
    };

    loadUser();
  }, []);

  if (!localStorage.getItem("token")) {
    return (
      <section className="auth-shell">
        <div className="auth-card">
          <p className="auth-eyebrow">My Account</p>
          <h1>Sign in to view your account.</h1>
          <div className="auth-links">
            <Link to="/login">Sign in</Link>
            <Link to="/register">Create account</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <p className="auth-eyebrow">My Account</p>
        <h1>{user?.name || "Your account"}</h1>
        <p className="auth-copy">
          Manage your active session and keep your orders tied to a verified account.
        </p>

        {message ? <p className="auth-message">{message}</p> : null}

        <div className="auth-summary">
          <div>
            <span>Email</span>
            <strong>{user?.email || "Loading..."}</strong>
          </div>
          <div>
            <span>Role</span>
            <strong>{user?.role || "customer"}</strong>
          </div>
          <div>
            <span>Status</span>
            <strong>{user?.isVerified ? "Verified" : "Pending verification"}</strong>
          </div>
        </div>

        <div className="auth-links">
          <Link to="/cart">Return to cart</Link>
          <button
            type="button"
            className="auth-submit"
            onClick={() => {
              logout();
              if (setUserId) {
                setUserId(null);
              }
              navigate("/login");
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    </section>
  );
}

export default MyAccount;
