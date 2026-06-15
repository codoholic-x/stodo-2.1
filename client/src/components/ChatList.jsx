//client/src/component/ChatList.jsx

import React from 'react';
import './ChatList.css';
import { useNavigate } from 'react-router-dom';

const ChatList = ({ chats, currentUserId }) => {
  const navigate = useNavigate();

  const openChat = (chat) => {
    // Navigate to chat with userId as param
    navigate(`/chat/${chat._id}`, {
  state: { chatId: chat._id, otherUser: chat.otherUser },
    });
  };

  return (
    <div className="chat-list">
      <h2>💬 Your Conversations</h2>
      {chats.length === 0 ? (
        <p className="no-chats">No previous chats</p>
      ) : (
        chats.map((chat, index) => (
          <div className="chat-user" key={index} onClick={() => openChat(chat)}>
            <img src={`http://localhost:5000/uploads/${chat.otherUser.profilePic}`} alt="user" />
            <div className="chat-info">
              <strong>{chat.otherUser.username}</strong>
              <p>{chat.lastMessage ? chat.lastMessage.slice(0, 25) + '...' : 'No messages yet'}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ChatList;
