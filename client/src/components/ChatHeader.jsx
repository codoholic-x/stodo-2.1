// src/components/ChatHeader.jsx
import React from 'react';
import './ChatHeader.css';

const ChatHeader = ({ user }) => {
  return (
    <div className="chat-header">
      <img
        src={`http://localhost:5000/uploads/${user?.profilePic}`}
        alt="Profile"
        className="chat-header-img"
      />
      <h3 className="chat-header-name">{user?.username}</h3>
    </div>
  );
};

export default ChatHeader;
