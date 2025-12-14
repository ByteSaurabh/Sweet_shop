const mongoose = require('mongoose');

const sweetSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String, 
    default: '' 
  },
  category: { 
    type: String, 
    required: true,
    trim: true
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  quantity: { 
    type: Number, 
    default: 0,
    min: 0
  },
  imageUrl: { 
    type: String, 
    default: '' 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update timestamp on save
sweetSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Transform _id to id for frontend compatibility
sweetSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.image_url = ret.imageUrl;
    ret.created_by = ret.createdBy;
    ret.created_at = ret.createdAt;
    ret.updated_at = ret.updatedAt;
    delete ret._id;
    delete ret.__v;
    delete ret.imageUrl;
    delete ret.createdBy;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  }
});

module.exports = mongoose.model('Sweet', sweetSchema);
