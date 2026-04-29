import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaPinterest,
  FaTiktok,
  FaXTwitter,
} from "react-icons/fa6";
import "./Footer.css";

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__grid">
          <div>
            <h2 className="site-footer__logo">ABIB</h2>
            <p className="site-footer__copy">
              A cleaner storefront experience built around trusted checkout,
              visual merchandising, and simple customer flows.
            </p>
          </div>

          <div>
            <h3 className="site-footer__heading">Company</h3>
            <div className="site-footer__nav">
              <button
                type="button"
                className="site-footer__link"
                onClick={() => navigate("/about")}
              >
                About Us
              </button>
              <button
                type="button"
                className="site-footer__link"
                onClick={() => navigate("/services")}
              >
                Services
              </button>
              <button
                type="button"
                className="site-footer__link"
                onClick={() => navigate("/faq")}
              >
                FAQ
              </button>
            </div>
          </div>

          <div>
            <h3 className="site-footer__heading">Support</h3>
            <div className="site-footer__nav">
              <button
                type="button"
                className="site-footer__link"
                onClick={() => navigate("/contact")}
              >
                Contact Us
              </button>
              <button
                type="button"
                className="site-footer__link"
                onClick={() => navigate("/privacy")}
              >
                Privacy
              </button>
              <button
                type="button"
                className="site-footer__link"
                onClick={() => navigate("/terms")}
              >
                Terms
              </button>
            </div>
          </div>

          <div>
            <h3 className="site-footer__heading">Follow</h3>
            <p className="site-footer__copy">
              Keep the brand presence feeling alive across social touchpoints.
            </p>
            <div className="site-footer__socials">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="site-footer__social"
              >
                <FaFacebook />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="site-footer__social"
              >
                <FaXTwitter />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="site-footer__social"
              >
                <FaInstagram />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="site-footer__social"
              >
                <FaTiktok />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="site-footer__social"
              >
                <FaPinterest />
              </a>
            </div>
          </div>
        </div>

        <div className="site-footer__bottom">
          <span className="site-footer__meta">
            &copy; {new Date().getFullYear()} ABIB. All rights reserved.
          </span>
          <button
            type="button"
            className="site-footer__link"
            onClick={() => navigate("/login")}
          >
            Customer account access
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
