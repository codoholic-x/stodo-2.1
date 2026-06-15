// server/routes/productRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product');
const { getDistance } = require('geolib');
const { fixDeal } = require('../controllers/productController');


const router = express.Router();

// 📦 Setup Multer storage for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
});

// ✅ ROUTE: Upload Product
// @route   POST /api/products/upload
router.post('/upload', upload.single('image'), async (req, res) => {
  const { itemType, itemName, price, condition, location } = req.body;
  const seller = req.headers['x-user-id']; // ✅ Get from custom header

  // ✅ Validate location format
  const [lat, lng] = location.split(',').map(s => Number(s.trim()));
  if (isNaN(lat) || isNaN(lng)) {
    return res.status(400).json({ message: 'Invalid location format' });
  }

  // 🔒 Validate inputs
  if (!itemType || !itemName || !price || !condition || !location) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'Image upload failed' });
  }

  if (!seller) {
    return res.status(401).json({ message: 'User not logged in!' });
  }

  try {
    const product = new Product({
      itemType,
      itemName,
      price: Number(price),
      condition,
      location, // format: "latitude,longitude"
      imageUrl: req.file.filename,
      seller, // ✅ Seller's MongoDB user ID
    });

    await product.save();
    res.status(201).json({ message: 'Product uploaded successfully' });
  } catch (err) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ ROUTE: Get Products Nearby (within 20km)
// @route   POST /api/products/nearby
router.post('/nearby', async (req, res) => {
  try {
    const { userLocation } = req.body;

    if (!userLocation) {
      return res.status(400).json({ message: 'User location is required' });
    }

    const [userLat, userLng] = userLocation.split(',').map(s => Number(s.trim()));
    const allProducts = await Product.find().populate('seller', 'username email _id');

    const nearbyProducts = allProducts.filter((product) => {
      if (!product.location) return false;

      const [prodLat, prodLng] = product.location.split(',').map(s => Number(s.trim()));
      const distance = getDistance(
        { latitude: userLat, longitude: userLng },
        { latitude: prodLat, longitude: prodLng }
      );

      return distance <= 20000; // Only include if within 20 km
    });

    res.status(200).json(nearbyProducts);
  } catch (err) {
    console.error('❌ Nearby Products Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/fix-deal/:productId', fixDeal);


module.exports = router;
