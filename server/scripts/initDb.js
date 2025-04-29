const mongoose = require('mongoose');
const Risk = require('../models/Risk');

// 连接MongoDB
mongoose.connect('mongodb://localhost:27017/ship_material', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB连接成功'))
.catch(err => console.error('MongoDB连接失败:', err));

// 示例数据
const initialRisks = [
  {
    material: '钢板',
    type: '库存预警',
    level: '高风险',
    description: '钢板库存低于安全库存水平，可能影响生产进度',
    date: new Date('2024-03-20'),
    impact: '可能导致船舶建造进度延迟，影响交付时间',
    suggestion: '建议立即联系供应商补充库存，同时考虑寻找备选供应商',
    progress: {
      active: 1,
      steps: [
        { title: '发现风险', description: '2024-03-20 系统自动预警' },
        { title: '制定方案', description: '2024-03-21 采购部门制定补货计划' },
        { title: '执行方案', description: '待执行' },
        { title: '完成处理', description: '待完成' }
      ]
    },
    trendData: {
      dates: ['2024-01', '2024-02', '2024-03'],
      values: [800, 600, 300]
    }
  },
  {
    material: '焊条',
    type: '价格波动',
    level: '中风险',
    description: '焊条价格持续上涨，可能增加采购成本',
    date: new Date('2024-03-19'),
    impact: '预计将增加约15%的采购成本',
    suggestion: '建议与供应商协商长期价格，或考虑批量采购',
    progress: {
      active: 2,
      steps: [
        { title: '发现风险', description: '2024-03-19 市场部报告' },
        { title: '制定方案', description: '2024-03-20 采购部门制定应对策略' },
        { title: '执行方案', description: '2024-03-21 与供应商谈判中' },
        { title: '完成处理', description: '待完成' }
      ]
    },
    trendData: {
      dates: ['2024-01', '2024-02', '2024-03'],
      values: [100, 110, 125]
    }
  },
  {
    material: '船用发动机',
    type: '供应商风险',
    level: '高风险',
    description: '主要供应商生产设备故障，可能影响发动机交付',
    date: new Date('2024-03-18'),
    impact: '可能导致发动机交付延迟2-3周',
    suggestion: '建议启动备选供应商，同时与现有供应商保持沟通',
    progress: {
      active: 0,
      steps: [
        { title: '发现风险', description: '2024-03-18 供应商通知' },
        { title: '制定方案', description: '待制定' },
        { title: '执行方案', description: '待执行' },
        { title: '完成处理', description: '待完成' }
      ]
    },
    trendData: {
      dates: ['2024-01', '2024-02', '2024-03'],
      values: [10, 8, 5]
    }
  },
  {
    material: '船用油漆',
    type: '质量风险',
    level: '低风险',
    description: '新批次油漆质量检测指标略有波动',
    date: new Date('2024-03-17'),
    impact: '可能影响涂装效果，但不影响使用安全',
    suggestion: '建议加强质量检测，必要时调整涂装工艺参数',
    progress: {
      active: 3,
      steps: [
        { title: '发现风险', description: '2024-03-17 质检部门报告' },
        { title: '制定方案', description: '2024-03-18 技术部门制定应对方案' },
        { title: '执行方案', description: '2024-03-19 调整涂装工艺' },
        { title: '完成处理', description: '2024-03-20 质量达标' }
      ]
    },
    trendData: {
      dates: ['2024-01', '2024-02', '2024-03'],
      values: [95, 92, 88]
    }
  },
  {
    material: '船用电缆',
    type: '库存预警',
    level: '中风险',
    description: '船用电缆库存接近安全库存线',
    date: new Date('2024-03-16'),
    impact: '可能影响电气系统安装进度',
    suggestion: '建议提前采购，确保库存充足',
    progress: {
      active: 2,
      steps: [
        { title: '发现风险', description: '2024-03-16 库存系统预警' },
        { title: '制定方案', description: '2024-03-17 采购部门制定采购计划' },
        { title: '执行方案', description: '2024-03-18 已发出采购订单' },
        { title: '完成处理', description: '待完成' }
      ]
    },
    trendData: {
      dates: ['2024-01', '2024-02', '2024-03'],
      values: [2000, 1800, 1500]
    }
  }
];

// 初始化数据库
async function initializeDatabase() {
  try {
    // 清空现有数据
    await Risk.deleteMany({});
    console.log('已清空现有数据');

    // 插入新数据
    await Risk.insertMany(initialRisks);
    console.log('数据初始化成功');

    // 关闭数据库连接
    await mongoose.connection.close();
    console.log('数据库连接已关闭');
  } catch (error) {
    console.error('初始化数据库失败:', error);
    process.exit(1);
  }
}

// 执行初始化
initializeDatabase(); 