<template>
  <view class="task-progress-page">
    <!-- CRT屏幕效果 -->
    <view v-if="solution" class="crt-screen main-screen">
      <view class="terminal-header">
        <text>{{ solution.name }}</text>
        <text class="blink ml-20">█</text>
      </view>

      <!-- Todo列表 -->
      <view class="todos-container mt-40">
        <view 
          v-for="(todo, index) in solution.todos" 
          :key="index"
          class="todo-line"
          :class="{ 
            'todo-completed': index < completedCount,
            'todo-current': index === completedCount && !isFinished
          }"
        >
          <text class="todo-status">
            {{ index < completedCount ? '[✓]' : '[ ]' }}
          </text>
          <text 
            class="todo-content"
            :class="{ 'strikethrough': index < completedCount }"
          >
            {{ todo }}
          </text>
        </view>
      </view>

      <!-- 进度信息 -->
      <view class="progress-info mt-40">
        <view class="progress-text">
          进度: {{ currentProgress.toFixed(1) }}%
        </view>
        <view class="pixel-progress mt-20">
          <view 
            class="pixel-progress-bar"
            :style="{width: currentProgress + '%'}"
          ></view>
        </view>
      </view>

      <!-- 体力条 -->
      <view class="stamina-display mt-30">
        <view class="stamina-label">体力: {{ currentStamina }} / {{ maxStamina }}</view>
        <view class="pixel-progress mt-10">
          <view 
            class="pixel-progress-bar"
            :class="{ 
              'bar-warning': staminaPercent < 60,
              'bar-danger': staminaPercent < 30 
            }"
            :style="{width: staminaPercent + '%'}"
          ></view>
        </view>
      </view>

      <!-- 状态信息 -->
      <view class="status-message mt-40" v-if="statusMessage">
        <text>{{ statusMessage }}</text>
        <text class="blink ml-10">█</text>
      </view>
    </view>

    <!-- 完成提示 -->
    <view class="pixel-card mt-40" v-if="isFinished">
      <view class="finish-message">
        <view class="finish-icon">{{ isSuccess ? '✓' : '✗' }}</view>
        <view class="finish-title">
          {{ isSuccess ? '任务完成！' : '任务失败...' }}
        </view>
        <view class="finish-desc" v-if="isSuccess">
          恭喜完成第{{ quarterIndex + 1 }}季度任务
        </view>
        <view class="finish-desc" v-else>
          体力耗尽，项目失败
        </view>
      </view>

      <view 
        class="pixel-btn pixel-btn-success mt-30"
        v-if="isSuccess"
        @click="continueGame"
      >
        继续 →
      </view>
      <view 
        class="pixel-btn pixel-btn-danger mt-30"
        v-else
        @click="goToResult"
      >
        查看结果
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { loadGameState, saveGameState } from '@/utils/storage'
import { generateTodoTimings } from '@/utils/gameLogic'

// 状态数据
const gameState = ref(null)
const solution = ref(null)
const quarterIndex = ref(0)
const completedCount = ref(0)
const currentProgress = ref(0)
const currentStamina = ref(50)
const maxStamina = ref(50)
const isFinished = ref(false)
const isSuccess = ref(false)
const statusMessage = ref('正在初始化开发环境...')
const timers = ref([])

// 计算属性
const staminaPercent = computed(() => {
  return (currentStamina.value / maxStamina.value * 100)
})

// 方法
const initTask = () => {
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
  
  // 验证玩家状态
  if (!gameState.value.playerStats) {
    uni.showToast({
      title: '玩家状态错误',
      icon: 'none'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
    return
  }
  
  quarterIndex.value = gameState.value.quarterIndex || 0
  currentStamina.value = gameState.value.playerStats.stamina || 50
  maxStamina.value = gameState.value.playerStats.maxStamina || 50
  
  // 获取最新选择的方案
  const solutions = gameState.value.selectedSolutions
  if (!solutions || solutions.length === 0) {
    uni.showToast({
      title: '未找到选择的方案',
      icon: 'none'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
    return
  }
  
  solution.value = solutions[solutions.length - 1]
  
  // 验证方案数据
  if (!solution.value || !solution.value.todos || solution.value.todos.length === 0) {
    uni.showToast({
      title: '方案数据错误',
      icon: 'none'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
    return
  }
}

const startTask = () => {
  statusMessage.value = '开始开发...'
  
  // 计算每个todo的时间间隔
  const totalTime = 8000 // 总共8秒完成
  const timings = generateTodoTimings(solution.value.todos, totalTime)
  
  // 计算体力消耗速度
  const staminaPerTodo = solution.value.stamina / solution.value.todos.length
  
  let currentTime = 0
  
  solution.value.todos.forEach((todo, index) => {
    currentTime += timings[index]
    
    const timer = setTimeout(() => {
      completeTodo(index, staminaPerTodo)
    }, currentTime)
    
    timers.value.push(timer)
  })
  
  // 任务完成
  const finishTimer = setTimeout(() => {
    finishTask()
  }, currentTime + 500)
  
  timers.value.push(finishTimer)
}

const completeTodo = (index, staminaCost) => {
  // 完成一个todo
  completedCount.value = index + 1
  
  // 消耗体力
  currentStamina.value = Math.max(0, currentStamina.value - staminaCost)
  
  // 更新进度
  currentProgress.value = (completedCount.value / solution.value.todos.length) * 100
  
  // 更新状态消息
  const messages = [
    '编写代码中...',
    '调试功能...',
    '优化性能...',
    '编写测试...',
    '修复bug...',
    '代码审查...',
    '部署准备...'
  ]
  statusMessage.value = messages[index % messages.length]
  
  // 震动反馈
  uni.vibrateShort({
    type: 'light'
  })
  
  // 检查体力
  if (currentStamina.value <= 0 && completedCount.value < solution.value.todos.length) {
    // 体力耗尽，任务失败
    failTask()
  }
}

const finishTask = () => {
  if (currentStamina.value <= 0) {
    failTask()
    return
  }
  
  isFinished.value = true
  isSuccess.value = true
  statusMessage.value = '任务完成！'
  currentProgress.value = 100
  
  // 更新游戏状态
  gameState.value.playerStats.stamina = Math.round(currentStamina.value)
  gameState.value.quarterIndex += 1
  
  saveGameState(gameState.value)
  
  // 震动反馈
  uni.vibrateShort()
}

const failTask = () => {
  // 清除所有定时器
  timers.value.forEach(timer => clearTimeout(timer))
  timers.value = []
  
  isFinished.value = true
  isSuccess.value = false
  statusMessage.value = '体力耗尽...'
  currentStamina.value = 0
  
  // 震动反馈
  uni.vibrateLong()
}

const continueGame = () => {
  // 判断是否还有季度任务
  if (gameState.value.quarterIndex < 3) {
    // 返回游戏主界面
    uni.navigateBack({
      delta: 2
    })
  } else {
    // 进入Boss战准备
    uni.navigateBack({
      delta: 2
    })
  }
}

const goToResult = () => {
  // 跳转到结算页面（失败）
  uni.redirectTo({
    url: '/pages/result/result?success=false'
  })
}

// 生命周期
onLoad(() => {
  initTask()
  setTimeout(() => {
    startTask()
  }, 1000)
})

onUnload(() => {
  // 清理所有定时器
  timers.value.forEach(timer => clearTimeout(timer))
})
</script>

<style scoped>
.task-progress-page {
  min-height: 100vh;
  padding: 40rpx;
  background: #F4E4C1;
}

.main-screen {
  min-height: 700rpx;
}

.terminal-header {
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
}

.ml-20 {
  margin-left: 20rpx;
}

.mt-40 {
  margin-top: 40rpx;
}

.mt-30 {
  margin-top: 30rpx;
}

.mt-20 {
  margin-top: 20rpx;
}

.mt-10 {
  margin-top: 10rpx;
}

.todos-container {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.todo-line {
  display: flex;
  gap: 15rpx;
  font-size: 28rpx;
  opacity: 0.5;
  transition: all 0.3s;
}

.todo-current {
  opacity: 1;
  animation: pulse-green 1s infinite;
}

.todo-completed {
  opacity: 0.7;
}

@keyframes pulse-green {
  0%, 100% { color: #00FF00; }
  50% { color: #00AA00; }
}

.todo-status {
  font-weight: bold;
}

.todo-content {
  flex: 1;
  line-height: 1.6;
}

.strikethrough {
  text-decoration: line-through;
}

.progress-info {
  border-top: 2px solid #00FF00;
  padding-top: 30rpx;
}

.progress-text {
  font-size: 32rpx;
  font-weight: bold;
}

.stamina-display {
  border-top: 2px solid #00FF00;
  padding-top: 20rpx;
}

.stamina-label {
  font-size: 28rpx;
  font-weight: bold;
}

.bar-warning .pixel-progress-bar {
  background: #FFEB3B !important;
}

.bar-danger .pixel-progress-bar {
  background: #FF5252 !important;
}

.status-message {
  font-size: 26rpx;
  font-style: italic;
  opacity: 0.8;
}

.ml-10 {
  margin-left: 10rpx;
}

.finish-message {
  text-align: center;
  padding: 40rpx 0;
}

.finish-icon {
  font-size: 120rpx;
  margin-bottom: 30rpx;
}

.finish-title {
  font-size: 48rpx;
  font-weight: bold;
  color: #3E2723;
  margin-bottom: 20rpx;
}

.finish-desc {
  font-size: 28rpx;
  color: #5D4037;
}
</style>

