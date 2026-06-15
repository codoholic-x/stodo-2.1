// server/routes/profileRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');

const {
  getProfile,
  uploadProfileImage,
  getMyProducts,
  deleteMyProduct
} = require('../controllers/profileController');

const router = express.Router();

// (optional) auth middleware
// const auth = require('../middleware/auth');
// router.use(auth);

// Multer for profile image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Routes
router.get('/', getProfile);
router.post('/upload', upload.single('profileImage'), uploadProfileImage);

router.get('/my-products', getMyProducts);
router.delete('/delete/:id', deleteMyProduct);

module.exports = router;
