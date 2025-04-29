const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');
const Risk = require('./models/Risk');
const Material = require('./models/Material');
const Contract = require('./models/Contract');
const aiRoutes = require('./routes/ai');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/ai', aiRoutes);

// 连接MongoDB
mongoose.connect(config.db.url, config.db.options)
  .then(() => {
    console.log('MongoDB连接成功');
    
    // 创建示例数据
    createInitialData();
  })
  .catch(err => {
    console.error('MongoDB连接失败:', err);
  });

// 创建初始数据
async function createInitialData() {
  try {
    // 检查是否已有数据
    const riskCount = await Risk.countDocuments();
    const materialCount = await Material.countDocuments();
    const contractCount = await Contract.countDocuments();

    if (riskCount === 0) {
      // 插入风险示例数据
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
        }
      ];

      await Risk.insertMany(initialRisks);
      console.log('风险初始数据创建成功');
    }

    if (materialCount === 0) {
      // 插入物料示例数据
      const initialMaterials = [
        {
          name: '钢板',
          category: '钢材',
          quantity: 500,
          unit: '吨',
          specification: 'AH36 10mm',
          location: 'A区-01库',
          supplier: '宝钢股份',
          lastUpdate: new Date('2024-03-20'),
          records: [
            { date: new Date('2024-03-20'), type: '入库', quantity: 100, operator: '张三' },
            { date: new Date('2024-03-15'), type: '出库', quantity: 50, operator: '李四' },
            { date: new Date('2024-03-10'), type: '入库', quantity: 200, operator: '张三' }
          ],
          stockLevels: {
            current: 500,
            safe: 300,
            max: 1000
          },
          priceHistory: [
            { date: new Date('2024-01-01'), price: 5000 },
            { date: new Date('2024-02-01'), price: 5200 },
            { date: new Date('2024-03-01'), price: 5500 }
          ]
        },
        {
          name: '焊条',
          category: '焊接材料',
          quantity: 10000,
          unit: '根',
          specification: 'E7018 4.0mm',
          location: 'B区-02库',
          supplier: '天津大桥',
          lastUpdate: new Date('2024-03-20'),
          records: [
            { date: new Date('2024-03-20'), type: '入库', quantity: 5000, operator: '张三' },
            { date: new Date('2024-03-18'), type: '出库', quantity: 2000, operator: '王五' }
          ],
          stockLevels: {
            current: 10000,
            safe: 8000,
            max: 15000
          },
          priceHistory: [
            { date: new Date('2024-01-01'), price: 2.5 },
            { date: new Date('2024-02-01'), price: 2.8 },
            { date: new Date('2024-03-01'), price: 3.0 }
          ]
        }
      ];

      await Material.insertMany(initialMaterials);
      console.log('物料初始数据创建成功');
    }

    if (contractCount === 0) {
      // 插入合同示例数据
      const initialContracts = [
        {
          contractNo: 'HT2024001',
          name: '远洋货轮建造合同',
          customer: '中国远洋海运集团',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          amount: 50000000,
          status: '进行中',
          nodes: [
            {
              name: '合同签订',
              plannedDate: new Date('2024-01-15'),
              actualDate: new Date('2024-01-15'),
              status: '已完成',
              description: '完成合同签订和盖章',
              responsible: '张三',
              attachments: [
                {
                  name: '合同文件.pdf',
                  url: '/uploads/contracts/HT2024001/contract.pdf',
                  uploadDate: new Date('2024-01-15')
                }
              ],
              comments: [
                {
                  content: '合同已签署完成',
                  author: '张三',
                  date: new Date('2024-01-15')
                }
              ]
            },
            {
              name: '设计评审',
              plannedDate: new Date('2024-02-15'),
              actualDate: new Date('2024-02-20'),
              status: '已完成',
              description: '完成船舶设计图纸评审',
              responsible: '李四',
              attachments: [
                {
                  name: '设计评审报告.pdf',
                  url: '/uploads/contracts/HT2024001/design_review.pdf',
                  uploadDate: new Date('2024-02-20')
                }
              ],
              comments: [
                {
                  content: '设计评审通过，部分细节需要调整',
                  author: '李四',
                  date: new Date('2024-02-20')
                }
              ]
            },
            {
              name: '材料采购',
              plannedDate: new Date('2024-03-15'),
              actualDate: null,
              status: '进行中',
              description: '采购主要建造材料',
              responsible: '王五',
              attachments: [],
              comments: [
                {
                  content: '已开始采购流程',
                  author: '王五',
                  date: new Date('2024-03-10')
                }
              ]
            },
            {
              name: '开工建造',
              plannedDate: new Date('2024-04-01'),
              actualDate: null,
              status: '未开始',
              description: '开始船舶建造工作',
              responsible: '赵六',
              attachments: [],
              comments: []
            }
          ],
          documents: [
            {
              name: '技术规格书.pdf',
              type: '技术文件',
              url: '/uploads/contracts/HT2024001/specs.pdf',
              uploadDate: new Date('2024-01-20')
            }
          ],
          riskLevel: '中风险',
          remarks: '需要重点关注材料采购进度'
        }
      ];

      await Contract.insertMany(initialContracts);
      console.log('合同初始数据创建成功');
    }
  } catch (error) {
    console.error('创建初始数据失败:', error);
  }
}

// 风险相关API
// 获取所有风险
app.get('/api/risks', async (req, res) => {
  try {
    const risks = await Risk.find();
    res.json(risks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 获取单个风险详情
app.get('/api/risks/:id', async (req, res) => {
  try {
    const risk = await Risk.findById(req.params.id);
    if (!risk) {
      return res.status(404).json({ message: '风险不存在' });
    }
    res.json(risk);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 创建新风险
app.post('/api/risks', async (req, res) => {
  const risk = new Risk(req.body);
  try {
    const newRisk = await risk.save();
    res.status(201).json(newRisk);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 更新风险
app.put('/api/risks/:id', async (req, res) => {
  try {
    const risk = await Risk.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!risk) {
      return res.status(404).json({ message: '风险不存在' });
    }
    res.json(risk);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 删除风险
app.delete('/api/risks/:id', async (req, res) => {
  try {
    const risk = await Risk.findByIdAndDelete(req.params.id);
    if (!risk) {
      return res.status(404).json({ message: '风险不存在' });
    }
    res.json({ message: '风险已删除' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 获取风险统计数据
app.get('/api/risks/stats/summary', async (req, res) => {
  try {
    const stats = await Risk.aggregate([
      {
        $group: {
          _id: '$level',
          count: { $sum: 1 }
        }
      }
    ]);
    res.json({ levels: stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 物料相关API
// 获取所有物料
app.get('/api/materials', async (req, res) => {
  try {
    const materials = await Material.find();
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 获取单个物料详情
app.get('/api/materials/:id', async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: '物料不存在' });
    }
    res.json(material);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 创建新物料
app.post('/api/materials', async (req, res) => {
  const material = new Material(req.body);
  try {
    const newMaterial = await material.save();
    res.status(201).json(newMaterial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 更新物料
app.put('/api/materials/:id', async (req, res) => {
  try {
    const material = await Material.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!material) {
      return res.status(404).json({ message: '物料不存在' });
    }
    res.json(material);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 删除物料
app.delete('/api/materials/:id', async (req, res) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);
    if (!material) {
      return res.status(404).json({ message: '物料不存在' });
    }
    res.json({ message: '物料已删除' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 获取物料统计数据
app.get('/api/materials/stats/summary', async (req, res) => {
  try {
    // 获取库存概览数据
    const stockOverview = await Material.aggregate([
      {
        $group: {
          _id: '$category',
          totalQuantity: { $sum: '$quantity' }
        }
      }
    ]);

    // 获取物料类别分布
    const categoryDistribution = await Material.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // 获取库存预警数据
    const stockWarnings = await Material.find({
      $expr: {
        $lt: ['$quantity', '$stockLevels.safe']
      }
    });

    res.json({
      stockOverview,
      categoryDistribution,
      stockWarnings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 合同相关API
// 获取所有合同
app.get('/api/contracts', async (req, res) => {
  try {
    const contracts = await Contract.find();
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 获取单个合同详情
app.get('/api/contracts/:id', async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({ message: '合同不存在' });
    }
    res.json(contract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 创建新合同
app.post('/api/contracts', async (req, res) => {
  const contract = new Contract(req.body);
  try {
    const newContract = await contract.save();
    res.status(201).json(newContract);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 更新合同
app.put('/api/contracts/:id', async (req, res) => {
  try {
    const contract = await Contract.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!contract) {
      return res.status(404).json({ message: '合同不存在' });
    }
    res.json(contract);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 删除合同
app.delete('/api/contracts/:id', async (req, res) => {
  try {
    const contract = await Contract.findByIdAndDelete(req.params.id);
    if (!contract) {
      return res.status(404).json({ message: '合同不存在' });
    }
    res.json({ message: '合同已删除' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 获取合同统计数据
app.get('/api/contracts/stats/summary', async (req, res) => {
  try {
    // 获取合同状态分布
    const statusDistribution = await Contract.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // 获取风险等级分布
    const riskDistribution = await Contract.aggregate([
      {
        $group: {
          _id: '$riskLevel',
          count: { $sum: 1 }
        }
      }
    ]);

    // 获取节点完成情况
    const nodeCompletion = await Contract.aggregate([
      {
        $unwind: '$nodes'
      },
      {
        $group: {
          _id: '$nodes.status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      statusDistribution,
      riskDistribution,
      nodeCompletion
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(config.server.port, config.server.host, () => {
  console.log(`服务器运行在 http://${config.server.host}:${config.server.port}`);
}); 