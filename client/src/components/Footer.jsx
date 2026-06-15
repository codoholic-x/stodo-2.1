import React from 'react';
import './Footer.css';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-content">
        <span className="footer-left">© 2025 STODOX</span>
        <button className="contact-btn" onClick={() => navigate('/contact')}>
          Contact Us
        </button>
      </div>
    </footer>
  );
};

export default Footer;
