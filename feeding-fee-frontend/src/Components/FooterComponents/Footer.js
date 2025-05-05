// src/components/Footer.js
import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-text">
          Developed by: <strong>Mr. Odumgya David</strong>
        </div>
        <div className="footer-phone">
          <a href="tel:+233240550824" className="footer-phone-link">
            Tel/WhatsApp: +233 24 055 0824
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
