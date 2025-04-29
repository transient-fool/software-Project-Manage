import axios from 'axios';

const API_URL = 'http://localhost:3002/api';

export const materialApi = {
  // 获取所有物料
  getAllMaterials() {
    return axios.get(`${API_URL}/materials`);
  },

  // 获取单个物料详情
  getMaterialById(id) {
    return axios.get(`${API_URL}/materials/${id}`);
  },

  // 创建新物料
  createMaterial(materialData) {
    return axios.post(`${API_URL}/materials`, materialData);
  },

  // 更新物料
  updateMaterial(id, materialData) {
    return axios.put(`${API_URL}/materials/${id}`, materialData);
  },

  // 删除物料
  deleteMaterial(id) {
    return axios.delete(`${API_URL}/materials/${id}`);
  },

  // 获取物料统计数据
  getMaterialStats() {
    return axios.get(`${API_URL}/materials/stats/summary`);
  }
}; 