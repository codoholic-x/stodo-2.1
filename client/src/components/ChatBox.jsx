import React from 'react';
import './ChatBox.css';

const ChatBox = ({ messages, currentUser }) => {
  return (
    <div className="chat-box">
      {messages.map((msg, index) => {
        const isBuyer = msg.sender === currentUser._id;
        return (
          <div
            key={index}
            className={`chat-message ${isBuyer ? 'buyer-msg' : 'seller-msg'}`}
          >
            <span className="msg-username">{msg.senderName}</span>
            <p className="msg-text">{msg.text}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ChatBox;
