// client/src/pages/OTP.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OTP.css';
import { useUser } from '../contexts/UserContext';

const OTP = () => {
  const { userEmail } = useUser();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('OTP Verified! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Server error. Try again later.');
    }
  };

  return (
    <div className="otp-container">
      <form className="otp-box" onSubmit={handleSubmit}>
        <h2>Email Verification</h2>
        <p className="info-text">OTP sent to <strong>{userEmail}</strong></p>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <input
          type="text"
          maxLength="6"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button type="submit">Verify OTP</button>
      </form>
    </div>
  );
};

export default OTP;
