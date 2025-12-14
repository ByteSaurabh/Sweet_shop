const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  sweetId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Sweet', 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true,
    min: 1
  },
  totalPrice: { 
    type: Number, 
    required: true,
    min: 0
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Transform for frontend compatibility
purchaseSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.user_id = ret.userId;
    ret.sweet_id = ret.sweetId;
    ret.total_price = ret.totalPrice;
    ret.created_at = ret.createdAt;
    delete ret._id;
    delete ret.__v;
    delete ret.userId;
    delete ret.sweetId;
    delete ret.totalPrice;
    delete ret.createdAt;
    return ret;
  }
});

module.exports = mongoose.model('Purchase', purchaseSchema);
