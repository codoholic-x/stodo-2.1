// server/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.IO Setup
const socketServer = require('./socket');
const io = socketServer.init(server);

// Chat Route Socket Injection
const { router: chatRoutes, setSocket } = require('./routes/chatRoutes');
setSocket(io);

// Middlewares
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/chat', chatRoutes);

// ================================
// React Build Serve (Vite)
// ================================

if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, '../client/dist');

  app.use(express.static(clientPath));

  app.use((req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'));
  });
}

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(
      '❌ MongoDB Connection Error:',
      err
    );
  });