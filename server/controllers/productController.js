exports.fixDeal = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  const product = await Product.findById(productId);

  if (!product) return res.status(404).json({ message: 'Product not found' });

  // Make sure the user is buyer or seller
  if (product.sellerId.toString() !== userId && product.buyerId.toString() !== userId) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  // Fix the deal
  product.isDealFixed = true;
  await product.save();

  res.json({ message: 'Deal fixed successfully' });
};
