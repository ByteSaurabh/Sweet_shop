const express = require('express');
const Sweet = require('../models/Sweet');
const Purchase = require('../models/Purchase');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// GET /api/sweets - Get all sweets (PUBLIC - no auth required)
router.get('/', async (req, res) => {
  try {
    const sweets = await Sweet.find().sort({ createdAt: -1 });
    console.log(`📦 Fetched ${sweets.length} sweets`);
    res.json(sweets);
  } catch (error) {
    console.error('Get sweets error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/sweets/search - Search sweets (PUBLIC - no auth required)
router.get('/search', async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const query = {};
    
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }

    const sweets = await Sweet.find(query).sort({ createdAt: -1 });
    console.log(`🔍 Search found ${sweets.length} sweets`);
    res.json(sweets);
  } catch (error) {
    console.error('Search sweets error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/sweets/categories - Get unique categories (PUBLIC - no auth required)
router.get('/categories', async (req, res) => {
  try {
    const categories = await Sweet.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/sweets - Create a new sweet
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, category, price, quantity, image_url } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({ 
        error: 'Name, category, and price are required' 
      });
    }

    const sweet = await Sweet.create({
      name,
      description: description || '',
      category,
      price: Number(price),
      quantity: quantity || 0,
      imageUrl: image_url || '',
      createdBy: req.user._id
    });

    console.log(`🍬 Created sweet: ${name}`);
    res.status(201).json(sweet);
  } catch (error) {
    console.error('Create sweet error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/sweets/:id - Update a sweet
router.put('/:id', protect, async (req, res) => {
  try {
    const { name, description, category, price, quantity, image_url } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (price !== undefined) updateData.price = Number(price);
    if (quantity !== undefined) updateData.quantity = quantity;
    if (image_url !== undefined) updateData.imageUrl = image_url;
    updateData.updatedAt = Date.now();

    const sweet = await Sweet.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    console.log(`✏️ Updated sweet: ${sweet.name}`);
    res.json(sweet);
  } catch (error) {
    console.error('Update sweet error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/sweets/:id - Delete a sweet (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndDelete(req.params.id);

    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    console.log(`🗑️ Deleted sweet: ${sweet.name}`);
    res.json({ message: 'Sweet deleted successfully' });
  } catch (error) {
    console.error('Delete sweet error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/sweets/:id/purchase - Purchase a sweet
router.post('/:id/purchase', protect, async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }

    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    if (sweet.quantity < quantity) {
      return res.status(400).json({ error: 'Not enough stock available' });
    }

    const totalPrice = sweet.price * quantity;

    // Create purchase record
    await Purchase.create({
      userId: req.user._id,
      sweetId: sweet._id,
      quantity,
      totalPrice
    });

    // Decrease stock
    sweet.quantity -= quantity;
    await sweet.save();

    console.log(`🛒 Purchase: ${quantity}x ${sweet.name} for $${totalPrice.toFixed(2)}`);
    res.json({ 
      message: 'Purchase successful', 
      totalPrice,
      remainingStock: sweet.quantity
    });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/sweets/:id/restock - Restock a sweet (Admin only)
router.post('/:id/restock', protect, adminOnly, async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }

    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    sweet.quantity += quantity;
    await sweet.save();

    console.log(`📦 Restocked: +${quantity} ${sweet.name} (new total: ${sweet.quantity})`);
    res.json({ 
      message: 'Restock successful', 
      newQuantity: sweet.quantity 
    });
  } catch (error) {
    console.error('Restock error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
