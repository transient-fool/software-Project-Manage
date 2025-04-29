<template>
  <div class="contract-management">
    <el-row :gutter="20" class="mb-20">
      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>合同状态分布</span>
            </div>
          </template>
          <v-chart class="chart" :option="statusOption" />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>风险等级分布</span>
            </div>
          </template>
          <v-chart class="chart" :option="riskOption" />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>节点完成情况</span>
            </div>
          </template>
          <v-chart class="chart" :option="nodeOption" />
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <template #header>
        <div class="card-header">
          <span>合同列表</span>
          <el-button type="primary" @click="handleAdd">新增合同</el-button>
        </div>
      </template>
      <el-table :data="contracts" style="width: 100%" @row-click="handleRowClick">
        <el-table-column prop="contractNo" label="合同编号" width="120" />
        <el-table-column prop="name" label="合同名称" />
        <el-table-column prop="customer" label="客户" />
        <el-table-column prop="startDate" label="开始日期" width="120" />
        <el-table-column prop="endDate" label="结束日期" width="120" />
        <el-table-column prop="amount" label="合同金额" width="120">
          <template #default="{ row }">
            {{ formatAmount(row.amount) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="riskLevel" label="风险等级" width="100">
          <template #default="{ row }">
            <el-tag :type="getRiskLevelType(row.riskLevel)">{{ row.riskLevel }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 合同详情对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="selectedContract ? `${selectedContract.name} - 详细信息` : ''"
      width="70%">
      <template v-if="selectedContract">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="合同编号">{{ selectedContract.contractNo }}</el-descriptions-item>
          <el-descriptions-item label="合同名称">{{ selectedContract.name }}</el-descriptions-item>
          <el-descriptions-item label="客户">{{ selectedContract.customer }}</el-descriptions-item>
          <el-descriptions-item label="合同金额">{{ formatAmount(selectedContract.amount) }}</el-descriptions-item>
          <el-descriptions-item label="开始日期">{{ formatDate(selectedContract.startDate) }}</el-descriptions-item>
          <el-descriptions-item label="结束日期">{{ formatDate(selectedContract.endDate) }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(selectedContract.status)">{{ selectedContract.status }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="风险等级">
            <el-tag :type="getRiskLevelType(selectedContract.riskLevel)">{{ selectedContract.riskLevel }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ selectedContract.remarks }}</el-descriptions-item>
        </el-descriptions>

        <el-divider>履约节点</el-divider>
        <el-timeline>
          <el-timeline-item
            v-for="(node, index) in selectedContract.nodes"
            :key="index"
            :type="getNodeType(node.status)"
            :timestamp="formatDate(node.plannedDate)"
            :hollow="node.status === '未开始'">
            <el-card class="node-card">
              <template #header>
                <div class="node-header">
                  <span>{{ node.name }}</span>
                  <el-tag :type="getNodeStatusType(node.status)">{{ node.status }}</el-tag>
                </div>
              </template>
              <div class="node-content">
                <p><strong>计划日期：</strong>{{ formatDate(node.plannedDate) }}</p>
                <p v-if="node.actualDate"><strong>实际日期：</strong>{{ formatDate(node.actualDate) }}</p>
                <p><strong>负责人：</strong>{{ node.responsible }}</p>
                <p><strong>描述：</strong>{{ node.description }}</p>
                
                <div v-if="node.attachments.length > 0" class="attachments">
                  <strong>附件：</strong>
                  <el-link
                    v-for="(file, fileIndex) in node.attachments"
                    :key="fileIndex"
                    :href="file.url"
                    target="_blank"
                    type="primary"
                    class="attachment-link">
                    {{ file.name }}
                  </el-link>
                </div>

                <div v-if="node.comments.length > 0" class="comments">
                  <strong>评论：</strong>
                  <div v-for="(comment, commentIndex) in node.comments" :key="commentIndex" class="comment">
                    <p class="comment-content">{{ comment.content }}</p>
                    <p class="comment-info">
                      {{ comment.author }} - {{ formatDate(comment.date) }}
                    </p>
                  </div>
                </div>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>

        <el-divider>相关文档</el-divider>
        <div class="documents">
          <el-link
            v-for="(doc, index) in selectedContract.documents"
            :key="index"
            :href="doc.url"
            target="_blank"
            type="primary"
            class="document-link">
            {{ doc.name }}
          </el-link>
        </div>
      </template>
    </el-dialog>

    <!-- 新增/编辑合同对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="isEdit ? '编辑合同' : '新增合同'"
      width="50%">
      <el-form :model="contractForm" label-width="100px">
        <el-form-item label="合同编号">
          <el-input v-model="contractForm.contractNo" />
        </el-form-item>
        <el-form-item label="合同名称">
          <el-input v-model="contractForm.name" />
        </el-form-item>
        <el-form-item label="客户">
          <el-input v-model="contractForm.customer" />
        </el-form-item>
        <el-form-item label="开始日期">
          <el-date-picker v-model="contractForm.startDate" type="date" />
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker v-model="contractForm.endDate" type="date" />
        </el-form-item>
        <el-form-item label="合同金额">
          <el-input-number v-model="contractForm.amount" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="contractForm.status">
            <el-option label="进行中" value="进行中" />
            <el-option label="已完成" value="已完成" />
            <el-option label="已逾期" value="已逾期" />
            <el-option label="已终止" value="已终止" />
          </el-select>
        </el-form-item>
        <el-form-item label="风险等级">
          <el-select v-model="contractForm.riskLevel">
            <el-option label="低风险" value="低风险" />
            <el-option label="中风险" value="中风险" />
            <el-option label="高风险" value="高风险" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="contractForm.remarks" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { contractApi } from '../api/contract'
import { ElMessage } from 'element-plus'

use([
  CanvasRenderer,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent
])

// 合同数据
const contracts = ref([])
const dialogVisible = ref(false)
const selectedContract = ref(null)
const editDialogVisible = ref(false)
const isEdit = ref(false)
const contractForm = ref({
  contractNo: '',
  name: '',
  customer: '',
  startDate: null,
  endDate: null,
  amount: 0,
  status: '进行中',
  riskLevel: '低风险',
  remarks: '',
  nodes: [],
  documents: []
})

// 获取所有合同数据
const fetchContracts = async () => {
  try {
    const response = await contractApi.getAllContracts()
    contracts.value = response.data
  } catch (error) {
    ElMessage.error('获取合同数据失败')
    console.error('获取合同数据失败:', error)
  }
}

// 获取合同统计数据并更新图表
const updateCharts = async () => {
  try {
    const { data } = await contractApi.getContractStats()
    
    // 更新合同状态分布图表
    statusOption.value.series[0].data = data.statusDistribution.map(item => ({
      value: item.count,
      name: item._id
    }))

    // 更新风险等级分布图表
    riskOption.value.series[0].data = data.riskDistribution.map(item => ({
      value: item.count,
      name: item._id
    }))

    // 更新节点完成情况图表
    nodeOption.value.series[0].data = data.nodeCompletion.map(item => ({
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
    const { data } = await contractApi.getContractById(row._id)
    selectedContract.value = data
    dialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取合同详情失败')
    console.error('获取合同详情失败:', error)
  }
}

// 新增合同
const handleAdd = () => {
  isEdit.value = false
  contractForm.value = {
    contractNo: '',
    name: '',
    customer: '',
    startDate: null,
    endDate: null,
    amount: 0,
    status: '进行中',
    riskLevel: '低风险',
    remarks: '',
    nodes: [],
    documents: []
  }
  editDialogVisible.value = true
}

// 保存合同
const handleSave = async () => {
  try {
    if (isEdit.value) {
      await contractApi.updateContract(selectedContract.value._id, contractForm.value)
      ElMessage.success('更新合同成功')
    } else {
      await contractApi.createContract(contractForm.value)
      ElMessage.success('创建合同成功')
    }
    editDialogVisible.value = false
    fetchContracts()
    updateCharts()
  } catch (error) {
    ElMessage.error(isEdit.value ? '更新合同失败' : '创建合同失败')
    console.error('保存合同失败:', error)
  }
}

// 合同状态分布图表配置
const statusOption = ref({
  title: {
    text: '合同状态分布'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [{
    name: '状态分布',
    type: 'pie',
    radius: '50%',
    data: []
  }]
})

// 风险等级分布图表配置
const riskOption = ref({
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
  series: [{
    name: '风险等级',
    type: 'pie',
    radius: '50%',
    data: []
  }]
})

// 节点完成情况图表配置
const nodeOption = ref({
  title: {
    text: '节点完成情况'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [{
    name: '节点状态',
    type: 'pie',
    radius: '50%',
    data: []
  }]
})

// 格式化金额
const formatAmount = (amount) => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY'
  }).format(amount)
}

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

// 获取状态标签类型
const getStatusType = (status) => {
  const types = {
    '进行中': 'primary',
    '已完成': 'success',
    '已逾期': 'danger',
    '已终止': 'info'
  }
  return types[status] || ''
}

// 获取风险等级标签类型
const getRiskLevelType = (level) => {
  const types = {
    '低风险': 'success',
    '中风险': 'warning',
    '高风险': 'danger'
  }
  return types[level] || ''
}

// 获取节点类型
const getNodeType = (status) => {
  const types = {
    '已完成': 'success',
    '进行中': 'primary',
    '已逾期': 'danger',
    '未开始': 'info'
  }
  return types[status] || ''
}

// 获取节点状态标签类型
const getNodeStatusType = (status) => {
  const types = {
    '已完成': 'success',
    '进行中': 'primary',
    '已逾期': 'danger',
    '未开始': 'info'
  }
  return types[status] || ''
}

// 组件挂载时获取数据
onMounted(() => {
  fetchContracts()
  updateCharts()
})
</script>

<style scoped>
.contract-management {
  padding: 20px;
}

.chart {
  height: 300px;
}

.mb-20 {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.node-card {
  margin-bottom: 10px;
}

.node-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.node-content {
  padding: 10px 0;
}

.attachments {
  margin-top: 10px;
}

.attachment-link {
  margin-right: 10px;
}

.comments {
  margin-top: 10px;
}

.comment {
  margin: 5px 0;
  padding: 5px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.comment-content {
  margin: 0;
}

.comment-info {
  margin: 5px 0 0;
  font-size: 12px;
  color: #909399;
}

.documents {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.document-link {
  margin-right: 10px;
}
</style> 