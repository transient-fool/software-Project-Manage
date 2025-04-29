<template>
  <div class="material-management">
    <!-- 轮播图 -->
    <el-carousel :interval="4000" type="card" height="300px" class="mb-20">
      <el-carousel-item v-for="item in carouselItems" :key="item.title">
        <el-card :body-style="{ padding: '0px' }" class="carousel-card">
          <img :src="item.image" class="carousel-image">
          <div class="carousel-content">
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </el-card>
      </el-carousel-item>
    </el-carousel>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>物料库存概览</span>
            </div>
          </template>
          <v-chart class="chart" :option="stockOption" />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>物料类别分布</span>
            </div>
          </template>
          <v-chart class="chart" :option="categoryOption" />
        </el-card>
      </el-col>
    </el-row>
    
    <el-table 
      :data="materials" 
      style="margin-top: 20px"
      @row-click="handleRowClick">
      <el-table-column prop="name" label="物料名称" />
      <el-table-column prop="category" label="类别" />
      <el-table-column prop="quantity" label="库存数量" />
      <el-table-column prop="unit" label="单位" />
      <el-table-column prop="lastUpdate" label="最后更新时间" />
    </el-table>

    <!-- 物料详情对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="selectedMaterial ? selectedMaterial.name + ' - 详细信息' : ''"
      width="50%">
      <template v-if="selectedMaterial">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="物料名称">{{ selectedMaterial.name }}</el-descriptions-item>
          <el-descriptions-item label="物料类别">{{ selectedMaterial.category }}</el-descriptions-item>
          <el-descriptions-item label="库存数量">{{ selectedMaterial.quantity }}</el-descriptions-item>
          <el-descriptions-item label="计量单位">{{ selectedMaterial.unit }}</el-descriptions-item>
          <el-descriptions-item label="最后更新时间">{{ selectedMaterial.lastUpdate }}</el-descriptions-item>
          <el-descriptions-item label="规格型号">{{ selectedMaterial.specification }}</el-descriptions-item>
          <el-descriptions-item label="存放位置">{{ selectedMaterial.location }}</el-descriptions-item>
          <el-descriptions-item label="供应商">{{ selectedMaterial.supplier }}</el-descriptions-item>
        </el-descriptions>
        
        <el-divider>库存变动记录</el-divider>
        <el-timeline>
          <el-timeline-item
            v-for="(record, index) in selectedMaterial.records"
            :key="index"
            :timestamp="record.date"
            :type="record.type === '入库' ? 'success' : 'warning'">
            {{ record.type }}: {{ record.quantity }}{{ selectedMaterial.unit }}
            <div class="text-sm text-gray">操作人: {{ record.operator }}</div>
          </el-timeline-item>
        </el-timeline>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { materialApi } from '../api/material'
import { ElMessage } from 'element-plus'

use([
  CanvasRenderer,
  BarChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent
])

// 轮播图数据
const carouselItems = [
  {
    title: '高强度船用钢板',
    description: '采用先进工艺生产的高强度船用钢板，具有优异的焊接性能和抗腐蚀性能',
    image: 'https://img.freepik.com/free-photo/steel-plates_1127-3241.jpg'
  },
  {
    title: '船用发动机系统',
    description: '高效节能的船用发动机系统，符合国际海事组织最新排放标准',
    image: 'https://img.freepik.com/free-photo/engine-motor-parts_1127-3233.jpg'
  },
  {
    title: '专业船用涂料',
    description: '环保型船用防腐涂料，提供卓越的防腐保护性能',
    image: 'https://img.freepik.com/free-photo/paint-cans_1127-3210.jpg'
  }
]

// 物料数据
const materials = ref([])
const dialogVisible = ref(false)
const selectedMaterial = ref(null)

// 获取所有物料数据
const fetchMaterials = async () => {
  try {
    const response = await materialApi.getAllMaterials()
    materials.value = response.data
  } catch (error) {
    ElMessage.error('获取物料数据失败')
    console.error('获取物料数据失败:', error)
  }
}

// 获取物料统计数据并更新图表
const updateCharts = async () => {
  try {
    const { data } = await materialApi.getMaterialStats()
    
    // 更新库存概览图表
    stockOption.value.xAxis.data = data.stockOverview.map(item => item._id)
    stockOption.value.series[0].data = data.stockOverview.map(item => item.totalQuantity)

    // 更新物料类别分布图表
    categoryOption.value.series[0].data = data.categoryDistribution.map(item => ({
      value: item.count,
      name: item._id
    }))
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

// 行点击处理
const handleRowClick = async (row) => {
  try {
    const { data } = await materialApi.getMaterialById(row._id)
    selectedMaterial.value = data
    dialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取物料详情失败')
    console.error('获取物料详情失败:', error)
  }
}

// 库存概览图表配置
const stockOption = ref({
  title: {
    text: '各类物料库存量'
  },
  tooltip: {},
  xAxis: {
    data: [],
    axisLabel: {
      interval: 0,
      rotate: 30
    }
  },
  yAxis: {},
  series: [{
    name: '库存量',
    type: 'bar',
    data: []
  }]
})

// 物料类别分布图表配置
const categoryOption = ref({
  title: {
    text: '物料类别占比'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    type: 'scroll'
  },
  series: [{
    name: '类别占比',
    type: 'pie',
    radius: '50%',
    data: []
  }]
})

// 组件挂载时获取数据
onMounted(() => {
  fetchMaterials()
  updateCharts()
})
</script>

<style scoped>
.material-management {
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

.carousel-card {
  height: 100%;
}

.carousel-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.carousel-content {
  padding: 14px;
}

.carousel-content h3 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.carousel-content p {
  margin: 10px 0 0;
  font-size: 14px;
  color: #606266;
}

.text-sm {
  font-size: 12px;
}

.text-gray {
  color: #909399;
}
</style> 