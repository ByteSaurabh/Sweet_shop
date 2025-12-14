const express = require('express');
const Purchase = require('../models/Purchase');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// GET /api/purchases - Get user's purchases (or all for admin)
router.get('/', protect, async (req, res) => {
  try {
    let query = { userId: req.user._id };
    
    // Admins can see all purchases
    if (req.user.role === 'admin' && req.query.all === 'true') {
      query = {};
    }

    const purchases = await Purchase.find(query)
      .populate('sweetId', 'name category price imageUrl')
      .sort({ createdAt: -1 });

    // Transform for frontend compatibility
    const transformed = purchases.map(p => ({
      id: p._id.toString(),
      user_id: p.userId.toString(),
      sweet_id: p.sweetId._id.toString(),
      quantity: p.quantity,
      total_price: p.totalPrice,
      created_at: p.createdAt,
      sweets: p.sweetId ? {
        id: p.sweetId._id.toString(),
        name: p.sweetId.name,
        category: p.sweetId.category,
        price: p.sweetId.price,
        image_url: p.sweetId.imageUrl
      } : null
    }));

    console.log(`📋 Fetched ${purchases.length} purchases`);
    res.json(transformed);
  } catch (error) {
    console.error('Get purchases error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
