// client/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // base styles

import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { SocketProvider } from './contexts/SocketContext'; // ✅ import kiya

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <SocketProvider> {/* ✅ SocketProvider added */}
          <App />
        </SocketProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
