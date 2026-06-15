// client/src/pages/Home.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      
      {/* LEFT CONTENT SECTION */}
      <div className="home-content">
        <h1 className="home-title">
          Welcome to <span>STODO</span>
        </h1>

        <p className="home-subtitle">
          Buy & Sell Used Academic Items Within 20km.  
          Smart, Fast & Secure Marketplace for Students.
        </p>

        <Link to="/register">
          <button className="home-btn">User Register</button>
        </Link>
      </div>

      {/* RIGHT SIDE LOGIN BUTTON */}
      <div className="home-login-btn-container">
        <Link to="/login">
          <button className="home-login-btn">Login</button>
        </Link>
      </div>

    </div>
  );
};

export default Home;
