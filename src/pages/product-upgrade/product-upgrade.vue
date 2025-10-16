<template>
  <view class="upgrade-page">
    <view class="pixel-subtitle text-center">产品升级</view>

    <!-- 产品信息 -->
    <view class="pixel-card mt-30" v-if="product">
      <view class="product-header">
        <view class="product-name">{{ product.name }}</view>
        <view class="pixel-badge" :class="'badge-' + product.grade.toLowerCase()">
          {{ product.grade }}级
        </view>
      </view>
      
      <view class="product-current-stats">
        <view class="stat-item">
          <text class="stat-label">当前DAU:</text>
          <text class="stat-value">{{ formatNumber(product.dau) }}</text>
        </view>
        <view class="stat-item">
          <text class="stat-label">月收入:</text>
          <text class="stat-value">¥{{ formatMoney(product.monthlyRevenue) }}</text>
        </view>
        <view class="stat-item">
          <text class="stat-label">用户评价:</text>
          <text class="stat-value">{{ '⭐'.repeat(Math.floor(product.userRating)) }} {{ product.userRating.toFixed(1) }}</text>
        </view>
      </view>
    </view>

    <!-- 升级方案 -->
    <view class="pixel-card mt-30">
      <view class="section-title">选择升级方案</view>
      
      <view class="solutions-list">
        <view 
          v-for="solution in solutions" 
          :key="solution.id"
          class="solution-card"
          :class="{ 'solution-selected': selectedSolution === solution.id }"
          @click="selectSolution(solution.id)"
        >
          <view class="solution-header">
            <view class="solution-name">{{ solution.name }}</view>
            <view class="solution-weeks">{{ solution.weeks }}周</view>
          </view>
          <view class="solution-desc">{{ solution.description }}</view>
          <view class="solution-requirement">
            需要: {{ solution.requiredEmployees }}人
          </view>
          <view class="solution-effect" v-if="upgradeEffect && selectedSolution === solution.id">
            <view class="effect-title">预计效果:</view>
            <view class="effect-item">DAU +{{ formatNumber(upgradeEffect.dauIncrease) }}</view>
            <view class="effect-item">评价 +{{ upgradeEffect.ratingIncrease.toFixed(1) }}⭐</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 分配员工 -->
    <view class="pixel-card mt-30" v-if="selectedSolution">
      <view class="section-title">
        分配员工 ({{ selectedEmployees.length }}/{{ requiredEmployeeCount }})
      </view>
      
      <view class="employees-list">
        <view 
          v-for="employee in idleEmployees" 
          :key="employee.id"
          class="employee-item"
          :class="{ 'employee-selected': isEmployeeSelected(employee.id) }"
          @click="toggleEmployee(employee)"
        >
          <view class="employee-item-name">{{ employee.name }}</view>
          <view class="employee-item-abilities">
            💻{{ employee.programming }} 🎨{{ employee.art }} 💼{{ employee.business }}
          </view>
        </view>
      </view>
      
      <view class="hint-text" v-if="idleEmployees.length === 0">
        没有空闲员工
      </view>
      <view class="hint-text" v-else-if="idleEmployees.length < requiredEmployeeCount">
        空闲员工数量不足，至少需要{{ requiredEmployeeCount }}人
      </view>
    </view>

    <!-- 按钮 -->
    <view class="button-group mt-40">
      <view 
        class="pixel-btn pixel-btn-success"
        :class="{ 'pixel-btn-disabled': !canStartUpgrade }"
        @click="startUpgrade"
      >
        开始升级 ▶
      </view>
      <view class="pixel-btn mt-20" @click="goBack">
        返回
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { loadGameState, saveGameState, addNews } from '@/utils/storage'
import { getAllSolutions, generateDevelopmentTasks } from '@/data/solutions'
import { getIdleEmployees, assignEmployeeToProduct } from '@/utils/employeeManager'
import { calculateUpgradeEffect } from '@/utils/balanceSystem'
import { formatMoney } from '@/utils/financeManager'

// 状态数据
const gameState = ref(null)
const product = ref(null)
const selectedSolution = ref(null)
const selectedEmployees = ref([])
const solutions = ref([])
const idleEmployees = ref([])
const upgradeEffect = ref(null)

// 计算属性
const requiredEmployeeCount = computed(() => {
  const solution = solutions.value.find(s => s.id === selectedSolution.value)
  return solution ? solution.requiredEmployees : 1
})

const canStartUpgrade = computed(() => {
  return selectedSolution.value && 
         selectedEmployees.value.length >= requiredEmployeeCount.value
})

// 方法
const initData = () => {
  gameState.value = loadGameState()
  if (!gameState.value) {
    uni.showToast({
      title: '未找到游戏存档',
      icon: 'none'
    })
    setTimeout(() => {
      uni.reLaunch({ url: '/pages/home/home' })
    }, 1500)
    return
  }
  
  // 从URL获取产品ID
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const productId = currentPage.options.productId
  
  if (!productId) {
    uni.showToast({
      title: '产品ID不存在',
      icon: 'none'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
    return
  }
  
  // 查找产品
  product.value = gameState.value.products.find(p => p.instanceId == productId)
  
  if (!product.value) {
    uni.showToast({
      title: '产品不存在',
      icon: 'none'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
    return
  }
  
  // 加载升级方案
  solutions.value = getAllSolutions()
  
  // 加载空闲员工
  idleEmployees.value = getIdleEmployees(gameState.value.employees)
}

const selectSolution = (solutionId) => {
  selectedSolution.value = solutionId
  selectedEmployees.value = []
  
  // 计算升级效果
  if (selectedEmployees.value.length > 0) {
    const solution = solutions.value.find(s => s.id === solutionId)
    upgradeEffect.value = calculateUpgradeEffect(
      product.value, 
      selectedEmployees.value, 
      solution.quality
    )
  }
}

const toggleEmployee = (employee) => {
  const index = selectedEmployees.value.findIndex(e => e.id === employee.id)
  if (index >= 0) {
    selectedEmployees.value.splice(index, 1)
  } else {
    if (selectedEmployees.value.length < requiredEmployeeCount.value) {
      selectedEmployees.value.push(employee)
    } else {
      uni.showToast({
        title: `最多选择${requiredEmployeeCount.value}人`,
        icon: 'none'
      })
    }
  }
  
  // 重新计算升级效果
  if (selectedEmployees.value.length > 0 && selectedSolution.value) {
    const solution = solutions.value.find(s => s.id === selectedSolution.value)
    upgradeEffect.value = calculateUpgradeEffect(
      product.value, 
      selectedEmployees.value, 
      solution.quality
    )
  } else {
    upgradeEffect.value = null
  }
}

const isEmployeeSelected = (employeeId) => {
  return selectedEmployees.value.some(e => e.id === employeeId)
}

const startUpgrade = () => {
  if (!canStartUpgrade.value) {
    uni.showToast({
      title: '请完成所有配置',
      icon: 'none'
    })
    return
  }
  
  // 分配员工
  selectedEmployees.value.forEach(emp => {
    const employee = gameState.value.employees.find(e => e.id === emp.id)
    if (employee) {
      assignEmployeeToProduct(employee, product.value.instanceId)
    }
  })
  
  // 设置产品为升级中
  product.value.status = 'developing'
  product.value.developmentSolution = selectedSolution.value
  product.value.assignedEmployees = selectedEmployees.value.map(e => e.id)
  product.value.developmentProgress = 0
  product.value.currentTodoIndex = 0
  product.value.developmentTodos = generateDevelopmentTasks(selectedSolution.value, true)
  
  // 添加新闻
  const solution = solutions.value.find(s => s.id === selectedSolution.value)
  addNews(gameState.value, {
    content: `🔧 开始升级${product.value.name}，预计${solution.weeks}周完成`
  })
  
  // 保存游戏状态
  saveGameState(gameState.value)
  
  // 返回主面板
  uni.showToast({
    title: '开始升级！',
    icon: 'success'
  })
  
  setTimeout(() => {
    uni.navigateBack()
  }, 1000)
}

const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toFixed(0)
}

const goBack = () => {
  uni.navigateBack()
}

// 生命周期
onLoad(() => {
  initData()
})
</script>

<style scoped>
.upgrade-page {
  min-height: 100vh;
  padding: 40rpx;
  background: #F4E4C1;
  padding-bottom: 80rpx;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.product-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #3E2723;
}

.product-current-stats {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
  margin-top: 20rpx;
  padding-top: 20rpx;
  border-top: 2px solid #D7CCC8;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  font-size: 26rpx;
}

.stat-label {
  color: #5D4037;
}

.stat-value {
  font-weight: bold;
  color: #3E2723;
}

.section-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #3E2723;
  margin-bottom: 20rpx;
}

.solutions-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.solution-card {
  padding: 25rpx;
  background: #FFF;
  border: 3px solid #3E2723;
  cursor: pointer;
}

.solution-selected {
  background: #FFE082 !important;
  border-color: #FFC107 !important;
  border-width: 4px !important;
}

.solution-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
}

.solution-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #3E2723;
}

.solution-weeks {
  padding: 8rpx 16rpx;
  background: #558B2F;
  color: #FFF;
  border: 2px solid #33691E;
  font-size: 22rpx;
  font-weight: bold;
}

.solution-desc {
  font-size: 24rpx;
  color: #5D4037;
  line-height: 1.6;
  margin-bottom: 10rpx;
}

.solution-requirement {
  font-size: 22rpx;
  color: #8D6E63;
}

.solution-effect {
  margin-top: 20rpx;
  padding: 15rpx;
  background: rgba(85, 139, 47, 0.1);
  border: 2px solid #558B2F;
}

.effect-title {
  font-size: 22rpx;
  font-weight: bold;
  color: #33691E;
  margin-bottom: 10rpx;
}

.effect-item {
  font-size: 24rpx;
  color: #558B2F;
  margin: 5rpx 0;
}

.employees-list {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.employee-item {
  padding: 20rpx;
  background: #FFF;
  border: 3px solid #3E2723;
  cursor: pointer;
}

.employee-selected {
  background: #FFE082 !important;
  border-color: #FFC107 !important;
  border-width: 4px !important;
}

.employee-item-name {
  font-size: 26rpx;
  font-weight: bold;
  color: #3E2723;
  margin-bottom: 8rpx;
}

.employee-item-abilities {
  font-size: 22rpx;
  color: #5D4037;
}

.hint-text {
  font-size: 24rpx;
  color: #8D6E63;
  text-align: center;
  padding: 20rpx;
}

.button-group {
  display: flex;
  flex-direction: column;
}
</style>
