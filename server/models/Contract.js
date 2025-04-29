const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  contractNo: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  customer: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['进行中', '已完成', '已逾期', '已终止'],
    default: '进行中'
  },
  nodes: [{
    name: {
      type: String,
      required: true
    },
    plannedDate: {
      type: Date,
      required: true
    },
    actualDate: Date,
    status: {
      type: String,
      enum: ['未开始', '进行中', '已完成', '已逾期'],
      default: '未开始'
    },
    description: String,
    responsible: String,
    attachments: [{
      name: String,
      url: String,
      uploadDate: Date
    }],
    comments: [{
      content: String,
      author: String,
      date: Date
    }]
  }],
  documents: [{
    name: String,
    type: String,
    url: String,
    uploadDate: Date
  }],
  riskLevel: {
    type: String,
    enum: ['低风险', '中风险', '高风险'],
    default: '低风险'
  },
  remarks: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Contract', contractSchema); 