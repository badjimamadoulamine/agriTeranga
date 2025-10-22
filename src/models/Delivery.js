const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  deliverer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['assigned', 'picked-up', 'in-transit', 'livreur', 'failed'],
    default: 'assigned'
  },
  pickupLocation: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  deliveryLocation: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  estimatedTime: Date,
  actualDeliveryTime: Date,
  distanceKm: Number,
  deliveryFee: {
    type: Number,
    default: 0
  },
  notes: String,
  proofOfDelivery: {
    signature: String,
    photo: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Delivery || mongoose.model('Delivery', deliverySchema);