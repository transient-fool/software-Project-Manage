import axios from 'axios';

const API_URL = 'http://localhost:3002/api';

export const riskApi = {
  // 获取所有风险
  getAllRisks() {
    return axios.get(`${API_URL}/risks`);
  },

  // 获取单个风险详情
  getRiskById(id) {
    return axios.get(`${API_URL}/risks/${id}`);
  },

  // 创建新风险
  createRisk(riskData) {
    return axios.post(`${API_URL}/risks`, riskData);
  },

  // 更新风险
  updateRisk(id, riskData) {
    return axios.put(`${API_URL}/risks/${id}`, riskData);
  },

  // 删除风险
  deleteRisk(id) {
    return axios.delete(`${API_URL}/risks/${id}`);
  },

  // 获取风险统计数据
  getRiskStats() {
    return axios.get(`${API_URL}/risks/stats/summary`);
  }
}; 