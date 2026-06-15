// client/src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleSendLink = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMsg('Password reset link sent! Check your inbox.');
      } else {
        setError(data.message || 'Email not found');
      }
    } catch (err) {
      setError('Server error. Try again later.');
    }
  };

  return (
    <div className="forgot-container">
      <form className="forgot-box" onSubmit={handleSendLink}>
        <h2>Forgot Password</h2>

        {error && <p className="error">{error}</p>}
        {msg && <p className="success">{msg}</p>}

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
