import React, { useEffect, useState } from 'react';
import ChatList from '../components/ChatList';
import { useNavigate } from 'react-router-dom';
import './ChatListPage.css';

const ChatListPage = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!user || !token) {
      navigate('/login');
      return;
    }

    const fetchChats = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/chat/user/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setChats(data.chats);
        } else {
          console.error('Failed to load chats:', data.message);
        }
      } catch (err) {
        console.error('❌ Error fetching chats:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  if (loading) return <p>🔄 Loading your chats...</p>;

  return <ChatList chats={chats} currentUserId={JSON.parse(localStorage.getItem('user'))._id} />;
};

export default ChatListPage;
