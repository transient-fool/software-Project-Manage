const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  specification: String,
  location: String,
  supplier: String,
  lastUpdate: {
    type: Date,
    default: Date.now
  },
  records: [{
    date: Date,
    type: {
      type: String,
      enum: ['入库', '出库']
    },
    quantity: Number,
    operator: String
  }],
  stockLevels: {
    current: Number,
    safe: Number,
    max: Number
  },
  priceHistory: [{
    date: Date,
    price: Number
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Material', materialSchema); 