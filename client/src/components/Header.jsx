import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const themes = ['light', 'dark', 'green', 'black', 'yellow', 'blue', 'purple'];

const Header = () => {
  const navigate = useNavigate();
  const [showThemes, setShowThemes] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(`theme-${selectedTheme}`);
    localStorage.setItem('theme', selectedTheme);
  }, [selectedTheme]);

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure to logout your account?');
    if (confirmLogout) {
      localStorage.removeItem('token');

      // Prevent going back to previous pages
      navigate('/login', { replace: true });

      // Clear full history (extra security)
      window.history.pushState(null, "", "/login");
    }
  };

  const toggleThemeDropdown = () => {
    setShowThemes(!showThemes);
  };

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme);
    setShowThemes(false);
  };

  return (
    <header className="main-header">
      <div className="header-left">
        <h2 className="site-name">STODOX</h2>
      </div>

      <div className="header-center">
        <input type="text" className="search-bar" placeholder="Search items..." />
      </div>

      <div className="header-right">
        <span className="header-icon" onClick={() => navigate('/profile')} title="Profile">👤</span>
        <span className="header-icon" onClick={() => navigate('/chat-list')} title="Chat">💬</span>

        <div className="theme-switcher-container">
          <span className="header-icon" onClick={toggleThemeDropdown} title="Theme">🎨</span>
          {showThemes && (
            <div className="theme-dropdown">
              {themes.map((theme, idx) => (
                <button
                  key={idx}
                  className={`theme-option ${theme}`}
                  onClick={() => handleThemeSelect(theme)}
                >
                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="header-icon" onClick={handleLogout} title="Logout">🚪</span>
      </div>
    </header>
  );
};

export default Header;
