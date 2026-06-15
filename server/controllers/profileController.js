// server/controllers/profileController.js
const User = require('../models/User');
const Product = require('../models/Product');

// Helper: get logged-in user's id from JWT middleware or fallback header
function getUserId(req) {
  return req.user?.id || req.headers['x-user-id'];
}

exports.getProfile = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Not authenticated' });

    // buy/sell counts (optional — adjust fields as per your schema)
    const sellCount = await Product.countDocuments({ seller: userId, isDealFixed: true });
    const buyCount  = await Product.countDocuments({ buyerId: userId, isDealFixed: true });

    const user = await User.findById(userId).select('username email profileImage');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
      sellCount,
      buyCount
    });
  } catch (e) {
    console.error('getProfile error:', e);
    res.status(500).json({ message: 'Server error' });
  }
}; 

exports.uploadProfileImage = async (req, res) => {
  const userId = req.user.id;
  const imageUrl = `/uploads/${req.file.filename}`;

  await User.findByIdAndUpdate(userId, { profileImage: imageUrl });

  res.json({ imageUrl });
};

exports.getMyProducts = async (req, res) => {
  const userId = req.user.id;
  const myProducts = await Product.find({ sellerId: userId });
  res.json(myProducts);
};

exports.deleteMyProduct = async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.id;

  const product = await Product.findById(productId);
  if (!product || product.sellerId.toString() !== userId.toString()) {
    return res.status(403).json({ message: 'Unauthorized or Not Found' });
  }

  await Product.findByIdAndDelete(productId);
  res.json({ message: 'Product deleted' });
};
