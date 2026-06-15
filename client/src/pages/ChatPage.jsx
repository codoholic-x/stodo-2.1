import axios from 'axios'; // ✅ Add this line
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import ChatInput from '../components/ChatInput';
import './ChatPage.css';

const ChatPage = () => {
  const socket = useSocket();
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [chatInfo, setChatInfo] = useState(null);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);

  // 🔐 Get user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      navigate('/login');
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  // 📩 Fetch chat data
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/chat/${chatId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = await res.json();
        if (res.status !== 200) {
          throw new Error(data.message || 'Failed to fetch chat');
        }

        setChatInfo(data.chat);
        setMessages(data.messages);
        setUser(data.user);
      } catch (err) {
        console.error('Fetch chat error:', err.message);
        navigate('/main-page');
      }
    };

    if (chatId) fetchChat();
  }, [chatId, navigate]);

  // 🔌 Setup socket join and listen for messages
  useEffect(() => {
    if (!chatId || !socket) return;

    socket.emit('joinRoom', chatId);
    //console.log("📤 Joining room:", chatId);

    const handleIncomingMessage = (msg) => {
      console.log('📩 Received message from socket:', msg);
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('chatMessage', handleIncomingMessage);

    return () => {
      socket.off('chatMessage', handleIncomingMessage);
    };
  }, [chatId, socket]);

  // ⬇️ Scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 📨 Handle send
  const handleSend = (text) => {
  if (!text || !chatId || !user || !socket) {
    console.warn('🔴 Missing something before sending:', { text, chatId, user, socket });
    return;
  }

  const message = {
    chatId,
    senderId: user._id,
    text,
  };

  console.log('📤 Emitting message to socket:', message);
  socket.emit('sendMessage', message);
};


  // ✅ Fix deal
  const handleFixDealClick = async () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  try {
    const res = await fetch(`http://localhost:5000/api/chat/fix/${chatId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId: user._id })
    });

    const data = await res.json();
    if (res.ok) {
      alert('✅ Fix Deal status updated.');

       // ✅ After both clicks, go back and refresh
  if (data.clicks >= 2) {
    navigate('/main-page'); // or force reload: window.location.reload();
  }
    } else {
      console.error(data.message);
    }
  } catch (err) {
    console.error('Error fixing deal:', err);
  }
};


  const handleDeleteChat = async () => {
  try {
    await axios.delete(`http://localhost:5000/api/chat/${chatId}`);
    alert('Chat deleted successfully');
    navigate('/main-page', { state: { deletedChatId: chatId } }); // go back with info
  } catch (error) {
    console.error('Error deleting chat:', error);
    alert('Failed to delete chat');
  }
};


  return (
    <div className="chat-container">
      {chatInfo && (
        <div className="chat-header">
          <img
            src={`http://localhost:5000/uploads/${chatInfo.otherUser.profilePic}`}
            alt="User"
          />
          <h3>{chatInfo.otherUser.username}</h3>
        </div>
      )}

      <div className="chat-box">
        {Array.isArray(messages) &&
          messages.map((msg, i) => (
            <div
              key={i}
              className={`chat-bubble ${
                String(msg.senderId) === String(user?._id) ? 'buyer' : 'seller'
              }`}
            >
              <span>{msg.text}</span>
            </div>
          ))}
        <div ref={messagesEndRef}></div>
      </div>

      <ChatInput onSend={handleSend} />

      <div className="chat-buttons">
        <button onClick={handleFixDealClick} className="fix-btn">Fix Deal 🤝</button>
        <button onClick={handleDeleteChat} className="delete-btn">🗑 Delete Chat</button>
      </div>
    </div>
  );
};

export default ChatPage;
