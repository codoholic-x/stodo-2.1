// src/components/ChatHeader.jsx
import React from 'react';
import './ChatHeader.css';

const ChatHeader = ({ user }) => {
  return (
    <div className="chat-header">
      <img
        src={`${import.meta.env.VITE_API_URL}/uploads/${user?.profilePic}`}
        alt="Profile"
        className="chat-header-img"
      />
      <h3 className="chat-header-name">{user?.username}</h3>
    </div>
  );
};

export default ChatHeader;
