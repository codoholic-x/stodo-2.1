// ✅ SocketContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';


const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000'); // 👈 server port 5000
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('🟢 Connected to socket:', newSocket.id);
    });

    return () => newSocket.close(); // cleanup on unmount
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
