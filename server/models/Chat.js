const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  dealFixed: { type: Boolean, default: false },
  fixDealClicks: { type: Number, default: 0 }, // ✅ ADD THIS
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
