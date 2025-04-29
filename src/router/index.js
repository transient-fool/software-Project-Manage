import { createRouter, createWebHistory } from 'vue-router'
import MaterialManagement from '../views/MaterialManagement.vue'
import RiskManagement from '../views/RiskManagement.vue'
import ContractManagement from '../views/ContractManagement.vue'

const routes = [
  {
    path: '/',
    redirect: '/materials'
  },
  {
    path: '/materials',
    name: 'MaterialManagement',
    component: MaterialManagement
  },
  {
    path: '/risks',
    name: 'RiskManagement',
    component: RiskManagement
  },
  {
    path: '/contracts',
    name: 'ContractManagement',
    component: ContractManagement
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 