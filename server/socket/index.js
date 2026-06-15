// server/socket/index.js

const socketio = require('socket.io');
const Message = require('../models/Message'); // ✅ import model

let io;

module.exports = {
  init: (server) => {
    io = socketio(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    io.on('connection', (socket) => {
      console.log('🟢 User connected:', socket.id);

      // ✅ joinRoom event
      socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`📥 User joined room: ${roomId}`);
      });

      // ✅ sendMessage + save to DB + broadcast
      socket.on('sendMessage', async (msg) => {
  console.log('📨 Message received at server:', msg);

  if (!msg.chatId || !msg.senderId || !msg.text) {
    console.log('❌ Missing fields in message:', msg);
    return;
  }

  try {
    const newMessage = new Message({
      chatId: msg.chatId,
      senderId: msg.senderId,
      text: msg.text,
    });

    const saved = await newMessage.save();
    console.log('✅ Message saved to DB:', saved);

    io.to(msg.chatId).emit('chatMessage', saved);
  } catch (err) {
    console.error('❌ DB save failed:', err.message);
  }
});


      socket.on('disconnect', () => {
        console.log('🔴 User disconnected:', socket.id);
      });
    });

    return io;
  },

  getIO: () => {
    if (!io) throw new Error('Socket.io not initialized!');
    return io;
  }
};
