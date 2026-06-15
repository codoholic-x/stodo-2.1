// client/src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ResetPassword.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');

    if (!password || !confirmPassword) {
      setError('Please fill both password fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMsg('Password reset successful! Redirecting...');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(data.message || 'Reset failed');
      }
    } catch (err) {
      setError('Server error. Try again later.');
    }
  };

  return (
    <div className="reset-container">
      <form className="reset-box" onSubmit={handleReset}>
        <h2>Reset Password</h2>

        {error && <p className="error">{error}</p>}
        {msg && <p className="success">{msg}</p>}

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit">Update Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
