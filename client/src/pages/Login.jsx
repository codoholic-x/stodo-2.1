// client/src/pages/Login.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { useUser } from '../contexts/UserContext';

const Login = () => {
  const { setIsAuthenticated } = useUser();
  const navigate = useNavigate();

  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.identifier || !form.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Set authentication
        setIsAuthenticated(true);

        // ✅ Save token and user to localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // ✅ Navigate to main choice page
        navigate('/choice-page');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('❌ Login Error:', err);
      setError('Server error. Try again later.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleLogin}>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}

        <input
          type="text"
          name="identifier"
          placeholder="Email or Username"
          value={form.identifier}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit">Login</button>

        <div className="login-links">
          <Link to="/register">Don't have an account? Register</Link>
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
