<template>
  <view class="quarter-task-page">
    <view class="pixel-title">选择开发方案</view>

    <!-- 任务信息 -->
    <view v-if="currentQuarter" class="pixel-card">
      <view class="task-title">
        第{{ quarterIndex + 1 }}季度: {{ currentQuarter.name }}
      </view>
      <view class="task-desc">{{ currentQuarter.desc }}</view>
    </view>

    <!-- 方案选择 -->
    <view v-if="solutions.length > 0" class="solutions-list mt-30">
      <view 
        v-for="(solution, index) in solutions" 
        :key="solution.id"
        class="solution-card pixel-card"
        :class="{ 'pixel-card-active': selectedIndex === index }"
        @click="selectSolution(index)"
      >
        <view class="solution-header">
          <view class="solution-name">{{ solution.name }}</view>
          <view class="solution-badge">
            方案 {{ index + 1 }}
          </view>
        </view>

        <view class="solution-desc mt-20">
          {{ solution.description }}
        </view>

        <!-- 方案属性 -->
        <view class="solution-stats mt-30">
          <view class="stat-row">
            <text class="stat-label">💪 体力消耗</text>
            <text class="stat-value">-{{ solution.stamina }}</text>
          </view>
          <view class="stat-row">
            <text class="stat-label">⭐ 质量影响</text>
            <text class="stat-value">{{ (solution.qualityImpact * 100).toFixed(0) }}%</text>
          </view>
          <view class="stat-row">
            <text class="stat-label">⚡ 进度速度</text>
            <text class="stat-value">{{ (solution.progressSpeed * 100).toFixed(0) }}%</text>
          </view>
        </view>

        <!-- Todo预览 -->
        <view class="todos-preview mt-30">
          <view class="todos-title">📋 开发任务清单</view>
          <view class="todos-list">
            <view 
              v-for="(todo, i) in solution.todos" 
              :key="i"
              class="todo-item"
            >
              <text class="todo-checkbox">[ ]</text>
              <text class="todo-text">{{ todo }}</text>
            </view>
          </view>
        </view>

        <!-- 体力警告 -->
        <view 
          v-if="playerStats.stamina < solution.stamina"
          class="warning-box mt-20"
        >
          ⚠️ 体力不足，选择此方案可能导致失败
        </view>
      </view>
    </view>

    <!-- 当前体力提示 -->
    <view class="pixel-card mt-30">
      <view class="stamina-info">
        <text class="info-label">当前体力:</text>
        <view class="pixel-progress">
          <view 
            class="pixel-progress-bar"
            :class="{ 'bar-warning': staminaPercent < 60, 'bar-danger': staminaPercent < 30 }"
            :style="{width: staminaPercent + '%'}"
          ></view>
        </view>
        <text class="info-value">{{ playerStats.stamina }} / {{ playerStats.maxStamina }}</text>
      </view>
      
      <view v-if="selectedIndex !== null" class="stamina-after mt-20">
        <text class="after-label">完成后剩余:</text>
        <text 
          class="after-value"
          :class="{ 'value-danger': remainingStamina < 20 }"
        >
          {{ remainingStamina }}
        </text>
      </view>
    </view>

    <!-- 按钮 -->
    <view class="button-group mt-40">
      <view 
        class="pixel-btn pixel-btn-success"
        :class="{ 'pixel-btn-disabled': selectedIndex === null }"
        @click="confirmSelection"
      >
        确认方案 ✓
      </view>
      <view class="pixel-btn mt-20" @click="goBack">
        ← 返回
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { loadGameState, saveGameState } from '@/utils/storage'
import { generateSolutions } from '@/data/solutions'
import { applySolutionModifiers } from '@/utils/gameLogic'

// 状态数据
const gameState = ref(null)
const currentQuarter = ref(null)
const quarterIndex = ref(0)
const solutions = ref([])
const selectedIndex = ref(null)
const playerStats = ref({
  stamina: 50,
  maxStamina: 50
})

// 计算属性
const staminaPercent = computed(() => {
  return (playerStats.value.stamina / playerStats.value.maxStamina * 100)
})

const remainingStamina = computed(() => {
  if (selectedIndex.value === null) return playerStats.value.stamina
  return playerStats.value.stamina - solutions.value[selectedIndex.value].stamina
})

// 方法
const initTask = () => {
  // 加载游戏状态
  gameState.value = loadGameState()
  
  if (!gameState.value) {
    uni.showToast({
      title: '游戏状态错误',
      icon: 'none'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
    return
  }
  
  // 验证游戏状态的完整性
  if (!gameState.value.product || !gameState.value.product.quarters) {
    uni.showToast({
      title: '产品数据错误',
      icon: 'none'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
    return
  }
  
  playerStats.value = gameState.value.playerStats || {
    stamina: 50,
    maxStamina: 50
  }
  quarterIndex.value = gameState.value.quarterIndex || 0
  currentQuarter.value = gameState.value.product.quarters[quarterIndex.value]
  
  if (!currentQuarter.value) {
    uni.showToast({
      title: '季度数据错误',
      icon: 'none'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
    return
  }
  
  // 生成方案
  let baseSolutions = generateSolutions(gameState.value.product, quarterIndex.value)
  
  // 应用临时升级对方案的影响
  if (playerStats.value.tempUpgrades && playerStats.value.tempUpgrades.length > 0) {
    solutions.value = baseSolutions.map(s => 
      applySolutionModifiers(s, playerStats.value.tempUpgrades)
    )
  } else {
    solutions.value = baseSolutions
  }
}

const selectSolution = (index) => {
  selectedIndex.value = index
  
  // 震动反馈
  uni.vibrateShort({
    type: 'light'
  })
}

const confirmSelection = () => {
  if (selectedIndex.value === null) {
    uni.showToast({
      title: '请选择一个方案',
      icon: 'none'
    })
    return
  }
  
  const selectedSolution = solutions.value[selectedIndex.value]
  
  // 保存选择的方案
  if (!gameState.value.selectedSolutions) {
    gameState.value.selectedSolutions = []
  }
  gameState.value.selectedSolutions.push(selectedSolution)
  
  saveGameState(gameState.value)
  
  // 跳转到任务进行页面
  uni.navigateTo({
    url: '/pages/task-progress/task-progress'
  })
}

const goBack = () => {
  uni.navigateBack()
}

// 生命周期
onLoad(() => {
  initTask()
})
</script>

<style scoped>
.quarter-task-page {
  min-height: 100vh;
  padding: 40rpx;
  background: #F4E4C1;
  padding-bottom: 80rpx;
}

.task-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #3E2723;
  margin-bottom: 15rpx;
}

.task-desc {
  font-size: 28rpx;
  color: #5D4037;
  line-height: 1.6;
}

.solutions-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.solution-card {
  cursor: pointer;
  transition: all 0.2s;
}

.solution-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.solution-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #3E2723;
}

.solution-badge {
  padding: 10rpx 20rpx;
  background: #6D4C41;
  color: #F4E4C1;
  border: 2px solid #3E2723;
  font-size: 22rpx;
  font-weight: bold;
}

.solution-desc {
  font-size: 26rpx;
  color: #5D4037;
  line-height: 1.8;
}

.solution-stats {
  background: rgba(109, 76, 65, 0.1);
  padding: 25rpx;
  border: 2px solid #6D4C41;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10rpx 0;
  font-size: 26rpx;
}

.stat-label {
  font-weight: bold;
}

.stat-value {
  font-weight: bold;
  color: #3E2723;
}

.todos-preview {
  background: #F4E4C1;
  padding: 20rpx;
  border: 3px solid #3E2723;
}

.todos-title {
  font-size: 26rpx;
  font-weight: bold;
  margin-bottom: 15rpx;
}

.todos-list {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.todo-item {
  font-size: 24rpx;
  display: flex;
  gap: 10rpx;
  line-height: 1.6;
}

.todo-checkbox {
  color: #6D4C41;
  font-weight: bold;
}

.todo-text {
  color: #5D4037;
  flex: 1;
}

.warning-box {
  background: #FFE082;
  border: 3px solid #FFA000;
  padding: 20rpx;
  font-size: 26rpx;
  font-weight: bold;
  color: #E65100;
  text-align: center;
}

.stamina-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.info-label {
  font-size: 28rpx;
  font-weight: bold;
  white-space: nowrap;
}

.info-value {
  font-size: 28rpx;
  font-weight: bold;
  white-space: nowrap;
}

.stamina-info .pixel-progress {
  flex: 1;
}

.bar-warning .pixel-progress-bar {
  background: #FFA726 !important;
}

.bar-danger .pixel-progress-bar {
  background: #E53935 !important;
}

.stamina-after {
  text-align: center;
  padding: 20rpx;
  background: rgba(85, 139, 47, 0.1);
  border: 2px solid #558B2F;
}

.after-label {
  font-size: 26rpx;
  margin-right: 15rpx;
}

.after-value {
  font-size: 36rpx;
  font-weight: bold;
  color: #558B2F;
}

.value-danger {
  color: #E53935 !important;
}

.button-group {
  display: flex;
  flex-direction: column;
}
</style>

