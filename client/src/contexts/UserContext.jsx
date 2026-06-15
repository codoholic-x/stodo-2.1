// client/src/contexts/UserContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user) {
      setUserEmail(user.email || '');
      setUserId(user._id || '');
      setIsAuthenticated(true);
      console.log("🧠 User loaded from localStorage:", user);
    } else {
      setIsAuthenticated(false);
      console.log("🚫 No user found in localStorage");
    }
  }, []);

  return (
    <UserContext.Provider value={{
      userEmail,
      setUserEmail,
      userId,
      setUserId,
      isAuthenticated,
      setIsAuthenticated
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
