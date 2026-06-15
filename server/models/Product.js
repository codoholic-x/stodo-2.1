//server/models/product.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  itemType: String,                  // e.g., "books"
  itemName: String,                  // e.g., "Math Notes"
  price: Number,                     // between 10 - 2000
  condition: String,                 // description by seller
  imageUrl: String,                  // saved image filename
  location: String,                  // format: "latitude,longitude"
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',                     // optional for tracking seller
    required: true, 
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
