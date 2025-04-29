<template>
  <div class="risk-management">
    <el-row :gutter="20" class="mb-20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>物料库存风险预警</span>
            </div>
          </template>
          <v-chart class="chart" :option="stockRiskOption" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>物料价格波动趋势</span>
            </div>
          </template>
          <v-chart class="chart" :option="priceOption" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>供应商评估</span>
            </div>
          </template>
          <v-chart class="chart" :option="supplierOption" />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>风险等级分布</span>
            </div>
          </template>
          <v-chart class="chart" :option="riskLevelOption" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 风险预警列表 -->
    <el-card class="mt-20">
      <template #header>
        <div class="card-header">
          <span>风险预警列表</span>
        </div>
      </template>
      <el-table :data="riskWarnings" style="width: 100%" @row-click="handleRiskClick">
        <el-table-column prop="material" label="物料名称" />
        <el-table-column prop="type" label="风险类型">
          <template #default="{ row }">
            <el-tag :type="getTagType(row.type)">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="风险等级">
          <template #default="{ row }">
            <el-tag :type="getRiskLevelType(row.level)">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="风险描述" />
        <el-table-column prop="date" label="预警时间" />
      </el-table>
    </el-card>

    <!-- 风险详情对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="selectedRisk ? `${selectedRisk.material} - ${selectedRisk.type}详情` : ''"
      width="60%">
      <template v-if="selectedRisk">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="物料名称">{{ selectedRisk.material }}</el-descriptions-item>
          <el-descriptions-item label="风险类型">
            <el-tag :type="getTagType(selectedRisk.type)">{{ selectedRisk.type }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="风险等级">
            <el-tag :type="getRiskLevelType(selectedRisk.level)">{{ selectedRisk.level }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="预警时间">{{ selectedRisk.date }}</el-descriptions-item>
          <el-descriptions-item label="风险描述" :span="2">{{ selectedRisk.description }}</el-descriptions-item>
          <el-descriptions-item label="影响范围" :span="2">{{ selectedRisk.impact }}</el-descriptions-item>
          <el-descriptions-item label="处理建议" :span="2">{{ selectedRisk.suggestion }}</el-descriptions-item>
        </el-descriptions>

        <el-divider>相关指标趋势</el-divider>
        <v-chart class="detail-chart" :option="getDetailChartOption(selectedRisk)" />

        <el-divider>处理进度</el-divider>
        <el-steps :active="selectedRisk.progress.active" finish-status="success">
          <el-step 
            v-for="(step, index) in selectedRisk.progress.steps" 
            :key="index"
            :title="step.title"
            :description="step.description" />
        </el-steps>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { riskApi } from '../api/risk'
import { ElMessage } from 'element-plus'

// 库存风险预警图表
const stockRiskOption = ref({
  title: {
    text: '物料库存预警状态'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: ['当前库存', '安全库存', '最大库存']
  },
  xAxis: {
    type: 'category',
    data: ['钢板', '焊条', '螺栓', '电缆', '发动机', '油漆']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '当前库存',
      type: 'bar',
      data: [500, 10000, 5000, 2000, 5, 300]
    },
    {
      name: '安全库存',
      type: 'line',
      data: [300, 8000, 3000, 1500, 3, 200]
    },
    {
      name: '最大库存',
      type: 'line',
      data: [1000, 15000, 8000, 3000, 10, 500]
    }
  ]
})

// 价格波动趋势图表
const priceOption = ref({
  title: {
    text: '近6个月价格趋势'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['钢板', '焊条', '油漆']
  },
  xAxis: {
    type: 'category',
    data: ['2023-10', '2023-11', '2023-12', '2024-01', '2024-02', '2024-03']
  },
  yAxis: {
    type: 'value',
    name: '价格指数'
  },
  series: [
    {
      name: '钢板',
      type: 'line',
      data: [100, 105, 110, 120, 115, 118]
    },
    {
      name: '焊条',
      type: 'line',
      data: [100, 102, 105, 103, 108, 110]
    },
    {
      name: '油漆',
      type: 'line',
      data: [100, 98, 103, 108, 112, 115]
    }
  ]
})

// 供应商评估图表
const supplierOption = ref({
  title: {
    text: '供应商综合评估'
  },
  tooltip: {},
  legend: {
    data: ['宝钢股份', '天津大桥', '长江油漆']
  },
  radar: {
    indicator: [
      { name: '交付及时率', max: 100 },
      { name: '产品质量', max: 100 },
      { name: '价格优势', max: 100 },
      { name: '服务响应', max: 100 },
      { name: '技术支持', max: 100 }
    ]
  },
  series: [{
    type: 'radar',
    data: [
      {
        value: [95, 90, 85, 88, 92],
        name: '宝钢股份'
      },
      {
        value: [88, 92, 90, 85, 85],
        name: '天津大桥'
      },
      {
        value: [85, 88, 92, 90, 85],
        name: '长江油漆'
      }
    ]
  }]
})

// 风险等级分布图表
const riskLevelOption = ref({
  title: {
    text: '风险等级分布'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      type: 'pie',
      radius: '50%',
      data: [
        { value: 2, name: '高风险' },
        { value: 5, name: '中风险' },
        { value: 8, name: '低风险' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})

// 风险预警列表数据
const riskWarnings = ref([])
const dialogVisible = ref(false)
const selectedRisk = ref(null)

// 获取所有风险数据
const fetchRisks = async () => {
  try {
    const response = await riskApi.getAllRisks()
    riskWarnings.value = response.data
  } catch (error) {
    ElMessage.error('获取风险数据失败')
    console.error('获取风险数据失败:', error)
  }
}

// 获取风险统计数据并更新图表
const updateCharts = async () => {
  try {
    const { data } = await riskApi.getRiskStats()
    
    // 更新风险等级分布图表
    riskLevelOption.value.series[0].data = data.levels.map(level => ({
      value: level.count,
      name: level._id
    }))

    // 这里可以添加其他图表的更新逻辑
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

// 行点击处理
const handleRiskClick = async (row) => {
  try {
    const { data } = await riskApi.getRiskById(row._id)
    selectedRisk.value = data
    dialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取风险详情失败')
    console.error('获取风险详情失败:', error)
  }
}

// 添加新风险
const addRisk = async (riskData) => {
  try {
    await riskApi.createRisk(riskData)
    ElMessage.success('添加风险成功')
    fetchRisks()
    updateCharts()
  } catch (error) {
    ElMessage.error('添加风险失败')
    console.error('添加风险失败:', error)
  }
}

// 更新风险
const updateRisk = async (id, riskData) => {
  try {
    await riskApi.updateRisk(id, riskData)
    ElMessage.success('更新风险成功')
    fetchRisks()
    updateCharts()
  } catch (error) {
    ElMessage.error('更新风险失败')
    console.error('更新风险失败:', error)
  }
}

// 删除风险
const deleteRisk = async (id) => {
  try {
    await riskApi.deleteRisk(id)
    ElMessage.success('删除风险成功')
    fetchRisks()
    updateCharts()
  } catch (error) {
    ElMessage.error('删除风险失败')
    console.error('删除风险失败:', error)
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchRisks()
  updateCharts()
})

// 获取详情图表配置
const getDetailChartOption = (risk) => {
  return {
    title: {
      text: '相关指标变化趋势'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: risk.trendData.dates
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: risk.trendData.values,
      type: 'line',
      smooth: true,
      markPoint: {
        data: [
          { type: 'max', name: '最大值' },
          { type: 'min', name: '最小值' }
        ]
      }
    }]
  }
}

// 风险类型标签颜色
const getTagType = (type) => {
  const types = {
    '库存预警': 'warning',
    '价格波动': 'info',
    '供应商风险': 'danger',
    '质量风险': ''
  }
  return types[type] || ''
}

// 风险等级标签颜色
const getRiskLevelType = (level) => {
  const levels = {
    '高风险': 'danger',
    '中风险': 'warning',
    '低风险': 'info'
  }
  return levels[level] || ''
}
</script>

<style scoped>
.risk-management {
  padding: 20px;
}

.chart {
  height: 400px;
}

.mb-20 {
  margin-bottom: 20px;
}

.mt-20 {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-chart {
  height: 300px;
  margin: 20px 0;
}

.el-descriptions {
  margin: 20px 0;
}

.el-steps {
  margin-top: 20px;
}
</style> 