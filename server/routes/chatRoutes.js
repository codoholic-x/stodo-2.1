// 📁 server/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Chat = require('../models/Chat');
const User = require('../models/User');
const Product = require('../models/Product');
const Message = require('../models/Message');

// 🧠 Global socket instance (set from server.js)
let io;
const setSocket = (socketInstance) => {
  io = socketInstance;
};

// ✅ Auth Middleware
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// ✅ Send new message
router.post('/send', async (req, res) => {
  const { chatId, senderId, text } = req.body;

  try {
    const msg = new Message({ chatId, senderId, text });
    await msg.save();
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// ✅ Get all messages between two users for a product (if needed)
router.post('/messages', async (req, res) => {
  const { senderId, receiverId, productId } = req.body;

  try {
    const messages = await Chat.find({
      $or: [
        { senderId, receiverId, productId },
        { senderId: receiverId, receiverId: senderId, productId }
      ]
    }).sort('timestamp');

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get chat details
router.get('/:chatId', authenticate, async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const user = req.user;

    const chat = await Chat.findById(chatId).populate('buyer seller');
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });

    const otherUser = chat.buyer._id.equals(user._id) ? chat.seller : chat.buyer;

    res.status(200).json({
      chat: {
        _id: chat._id,
        otherUser: {
          _id: otherUser._id,
          username: otherUser.username,
          profilePic: otherUser.profilePic
        }
      },
      messages,
      user
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get all chats of a user (with last message shown)
router.get('/user/:userId', authenticate, async (req, res) => {
  try {
    const currentId = req.params.userId;

    // Get all chats where current user is buyer or seller
    const chats = await Chat.find({
      $or: [{ buyer: currentId }, { seller: currentId }]
    })
      .populate('buyer seller productId')
      .lean();

    // For each chat, get the other user and latest message
    const formatted = await Promise.all(
      chats.map(async (c) => {
        const other = c.buyer._id.equals(currentId) ? c.seller : c.buyer;

        // 🔍 Fetch last message from Message model (sorted by createdAt descending)
        const lastMessageObj = await Message.findOne({ chatId: c._id })
          .sort({ createdAt: -1 })
          .lean();

        return {
          _id: c._id,
          product: c.productId,
          otherUser: {
            _id: other._id,
            username: other.username,
            profilePic: other.profilePic
          },
          lastMessage: lastMessageObj ? lastMessageObj.text : null
        };
      })
    );

    res.json({ chats: formatted });
  } catch (err) {
    console.error('❌ Error fetching user chats:', err);
    res.status(500).json({ message: 'Failed to get user chats' });
  }
});


// ✅ FIX DEAL Route
router.put('/fix/:chatId', authenticate, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId);
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    chat.fixDealClicks = (chat.fixDealClicks || 0) + 1;
    await chat.save();

    if (chat.fixDealClicks >= 2) {
  const deletedProduct = await Product.findByIdAndDelete(chat.productId);
  console.log("✅ Product deleted:", deletedProduct);

  // ✅ Also delete messages of this chat
  await Message.deleteMany({ chatId: chat._id });
  console.log("🧹 All messages of chat deleted");

  // ✅ Emit socket event
  if (io && deletedProduct?._id) {
    io.emit('product-deleted', String(deletedProduct._id));
    console.log('📢 Socket emitted: product-deleted:', deletedProduct._id);
  }
}


    res.status(200).json({ message: 'Fix Deal clicked', clicks: chat.fixDealClicks });
  } catch (err) {
    console.error('Fix Deal Error:', err);
    res.status(500).json({ message: 'Fix Deal failed' });
  }
});

// ✅ Delete a chat
// ✅ Delete a chat
router.delete('/:id', async (req, res) => {
  try {
    const deletedChat = await Chat.findByIdAndDelete(req.params.id);
    if (!deletedChat) return res.status(404).json({ message: 'Chat not found' });

    // ✅ Also delete all messages in that chat
    await Message.deleteMany({ chatId: req.params.id });
    console.log("🧹 Messages deleted for chat:", req.params.id);

    res.json({ message: 'Chat and messages deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// ✅ Initiate chat (create or reuse)
router.post('/initiate', authenticate, async (req, res) => {
  try {
    const { buyerId, sellerId, productId } = req.body;

    const existingChat = await Chat.findOne({
      productId,
      $or: [
        { buyer: buyerId, seller: sellerId },
        { buyer: sellerId, seller: buyerId }
      ]
    });

    if (existingChat) {
      return res.status(200).json({ chatId: existingChat._id });
    }

    const newChat = new Chat({ buyer: buyerId, seller: sellerId, productId });
    await newChat.save();

    res.status(201).json({ chatId: newChat._id });
  } catch (err) {
    res.status(500).json({ message: 'Failed to initiate chat' });
  }
});

// 🔁 Export router AND socket setter
module.exports = {
  router,
  setSocket,
};
