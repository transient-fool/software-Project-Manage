const express = require('express');
const router = express.Router();

// 系统提示词
const SYSTEM_PROMPT = `你是一个船舶物料管理系统的AI助手，可以回答关于物料管理、风险管理和合同管理的问题。
系统主要功能包括：
1. 物料管理：管理船舶建造所需的各类物料
2. 风险管理：监控和管理各类风险
3. 合同管理：跟踪合同履约节点

请根据用户的问题提供相关帮助。`;

// 简单的响应生成函数
function generateResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // 根据关键词生成更智能的响应
  if (lowerMessage.includes('物料') || lowerMessage.includes('库存')) {
    return `关于物料管理，我可以为您提供以下信息：
1. 当前库存情况：您可以在物料管理页面查看实时库存数据
2. 物料分类：系统支持按类别查看物料分布
3. 库存预警：当库存低于安全水平时会自动预警
4. 出入库记录：可以查看详细的物料流转记录

您想了解哪方面的具体信息？`;
  } 
  
  if (lowerMessage.includes('风险') || lowerMessage.includes('预警')) {
    return `关于风险管理，系统提供以下功能：
1. 风险等级：分为高、中、低三个等级
2. 风险类型：包括库存风险、价格风险、质量风险等
3. 风险预警：系统会自动监控并发出预警
4. 处理流程：包含发现、评估、处理、跟踪等环节

需要我为您详细说明某个方面吗？`;
  }
  
  if (lowerMessage.includes('合同') || lowerMessage.includes('履约')) {
    return `关于合同管理，您可以：
1. 查看合同列表：包括所有进行中的合同
2. 跟踪履约节点：实时监控合同执行进度
3. 管理合同文档：上传和管理相关文件
4. 记录重要事件：记录合同执行过程中的关键事件

您需要了解哪个具体功能？`;
  }
  
  if (lowerMessage.includes('帮助') || lowerMessage.includes('怎么用')) {
    return `欢迎使用船舶物料管理系统！我是您的AI助手，可以帮您：
1. 解答系统使用问题
2. 提供数据查询帮助
3. 解释功能操作步骤
4. 提供业务建议

您可以直接问我任何关于系统使用的问题。`;
  }
  
  // 默认响应
  return `我理解您的问题是关于"${message}"。作为船舶物料管理系统的AI助手，我可以帮您：
1. 查询物料库存信息
2. 了解风险预警情况
3. 跟踪合同履约进度
4. 解答系统使用问题

请告诉我您具体需要了解哪方面的信息？`;
}

// AI助手对话接口
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: '消息不能为空' });
    }

    // 生成响应
    const response = generateResponse(message);
    res.json({ response });
  } catch (error) {
    console.error('AI助手处理错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router; 