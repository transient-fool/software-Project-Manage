<template>
  <el-container>
    <el-header>
      <div class="header-content">
        <h1>船舶物料管理系统</h1>
        <div class="nav-links">
          <router-link to="/materials" custom v-slot="{ navigate, isActive }">
            <el-button 
              :type="isActive ? 'primary' : 'text'"
              @click="navigate"
              class="nav-button">
              <el-icon><Box /></el-icon>
              物料管理
            </el-button>
          </router-link>
          <router-link to="/risks" custom v-slot="{ navigate, isActive }">
            <el-button 
              :type="isActive ? 'primary' : 'text'"
              @click="navigate"
              class="nav-button">
              <el-icon><Warning /></el-icon>
              风险管理
            </el-button>
          </router-link>
          <router-link to="/contracts" custom v-slot="{ navigate, isActive }">
            <el-button 
              :type="isActive ? 'primary' : 'text'"
              @click="navigate"
              class="nav-button">
              <el-icon><Document /></el-icon>
              合同管理
            </el-button>
          </router-link>
        </div>
      </div>
    </el-header>
    <el-main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-main>
    <AIAssistant />
  </el-container>
</template>

<script setup>
import { Box, Warning, Document } from '@element-plus/icons-vue'
import AIAssistant from './components/AIAssistant.vue'
</script>

<style>
.el-header {
  background-color: #409EFF;
  color: white;
  padding: 0;
}

.header-content {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.header-content h1 {
  margin: 0;
  font-size: 20px;
  margin-right: 40px;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-button {
  color: white;
  height: 60px;
  padding: 0 20px;
  font-size: 16px;
  border-radius: 0;
  border: none;
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-button.el-button--primary {
  background-color: rgba(255, 255, 255, 0.2);
}

.nav-button .el-icon {
  margin-right: 8px;
  font-size: 18px;
}

/* 路由切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 