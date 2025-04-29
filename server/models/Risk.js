const mongoose = require('mongoose');

const riskSchema = new mongoose.Schema({
  material: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['库存预警', '价格波动', '供应商风险', '质量风险']
  },
  level: {
    type: String,
    required: true,
    enum: ['高风险', '中风险', '低风险']
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  impact: {
    type: String,
    required: true
  },
  suggestion: {
    type: String,
    required: true
  },
  progress: {
    active: {
      type: Number,
      required: true,
      min: 0,
      max: 3
    },
    steps: [{
      title: String,
      description: String
    }]
  },
  trendData: {
    dates: [String],
    values: [Number]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Risk', riskSchema); 