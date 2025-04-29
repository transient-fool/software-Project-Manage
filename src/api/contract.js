import axios from 'axios';

const API_URL = 'http://localhost:3002/api';

export const contractApi = {
  // 获取所有合同
  getAllContracts() {
    return axios.get(`${API_URL}/contracts`);
  },

  // 获取单个合同详情
  getContractById(id) {
    return axios.get(`${API_URL}/contracts/${id}`);
  },

  // 创建新合同
  createContract(contractData) {
    return axios.post(`${API_URL}/contracts`, contractData);
  },

  // 更新合同
  updateContract(id, contractData) {
    return axios.put(`${API_URL}/contracts/${id}`, contractData);
  },

  // 删除合同
  deleteContract(id) {
    return axios.delete(`${API_URL}/contracts/${id}`);
  },

  // 获取合同统计数据
  getContractStats() {
    return axios.get(`${API_URL}/contracts/stats/summary`);
  }
}; 