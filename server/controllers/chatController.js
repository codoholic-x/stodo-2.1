// server/controllers/chatController.js

const Chat = require('../models/Chat');
const Product = require('../models/Product');

const fixDealStatus = async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const chat = await Chat.findById(chatId);

    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    chat.fixDealClicks = (chat.fixDealClicks || 0) + 1;
    await chat.save();

    // ✅ If both users clicked "Fix Deal", delete the product
    if (chat.fixDealClicks >= 2 && chat.productId) {
      await Product.findByIdAndDelete(chat.productId);
      console.log("✅ Product deleted from DB:", chat.productId);
    }

    res.status(200).json({ message: 'Fix Deal updated', clicks: chat.fixDealClicks });
  } catch (err) {
    console.error("❌ Error in fixDealStatus:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  fixDealStatus,
};
