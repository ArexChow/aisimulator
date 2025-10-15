<template>
  <view class="boss-battle-page">
    <!-- Boss战标题 -->
    <view class="crt-screen boss-header">
      <view class="terminal-text">
        <text class="blink">⚔️</text>
        <text> BOSS 战 </text>
        <text class="blink">⚔️</text>
      </view>
      <view v-if="product" class="terminal-subtitle">
        {{ product.name }} - 最终发布
      </view>
    </view>

    <!-- 战前准备信息 -->
    <view class="pixel-card mt-40" v-if="!battleStarted && product && bossSolution">
      <view class="pixel-subtitle text-center">战前准备</view>
      
      <view class="preparation-info">
        <view class="info-item">
          <text class="info-label">产品名称:</text>
          <text class="info-value">{{ product.name }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">产品等级:</text>
          <view class="pixel-badge" :class="'badge-' + product.grade.toLowerCase()">
            {{ product.grade }}级
          </view>
        </view>
        <view class="info-item">
          <text class="info-label">当前体力:</text>
          <text class="info-value" :class="{ 'value-danger': playerStats.stamina < bossSolution.stamina }">
            {{ playerStats.stamina }}
          </text>
        </view>
        <view class="info-item">
          <text class="info-label">需要体力:</text>
          <text class="info-value">{{ bossSolution.stamina }}</text>
        </view>
      </view>

      <!-- 已完成的季度方案回顾 -->
      <view class="solutions-review mt-30">
        <view class="review-title">前期开发回顾:</view>
        <view 
          v-for="(solution, index) in selectedSolutions" 
          :key="index"
          class="review-item"
        >
          <text class="review-quarter">Q{{ index + 1 }}</text>
          <text class="review-name">{{ solution.name }}</text>
          <text class="review-quality">质量: {{ (solution.qualityImpact * 100).toFixed(0) }}%</text>
        </view>
      </view>

      <!-- Boss任务预览 -->
      <view class="boss-preview mt-30">
        <view class="preview-title">📋 最终任务清单</view>
        <view class="preview-list">
          <view 
            v-for="(todo, i) in bossSolution.todos" 
            :key="i"
            class="preview-item"
          >
            <text>{{ i + 1 }}. {{ todo }}</text>
          </view>
        </view>
      </view>

      <!-- 成功率提示 -->
      <view class="success-rate mt-30">
        <text class="rate-label">预计完成度:</text>
        <text class="rate-value">{{ estimatedCompletion.toFixed(0) }}%</text>
        <view class="rate-desc">
          (需要 ≥80% 才能成功上线)
        </view>
      </view>

      <!-- 开始按钮 -->
      <view 
        class="pixel-btn pixel-btn-danger mt-40"
        @click="startBattle"
      >
        开始最终战斗 ⚔️
      </view>
    </view>

    <!-- 战斗进行中 -->
    <view class="crt-screen battle-screen mt-40" v-if="battleStarted && !battleFinished">
      <view class="battle-progress">
        <view class="progress-label">开发进度</view>
        <view class="pixel-progress mt-20">
          <view 
            class="pixel-progress-bar"
            :style="{width: currentProgress + '%'}"
          ></view>
        </view>
        <view class="progress-text mt-10">{{ currentProgress.toFixed(1) }}%</view>
      </view>

      <view class="battle-todos mt-40">
        <view 
          v-for="(todo, index) in bossSolution.todos" 
          :key="index"
          class="battle-todo"
          :class="{ 
            'todo-completed': index < completedCount,
            'todo-current': index === completedCount
          }"
        >
          <text class="todo-status">
            {{ index < completedCount ? '[✓]' : '[ ]' }}
          </text>
          <text 
            class="todo-text"
            :class="{ 'strikethrough': index < completedCount }"
          >
            {{ todo }}
          </text>
        </view>
      </view>

      <view class="battle-stamina mt-40">
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

      <view class="battle-message mt-30">
        <text>{{ statusMessage }}</text>
        <text class="blink ml-10">█</text>
      </view>
    </view>

    <!-- 战斗结果 -->
    <view class="pixel-card mt-40" v-if="battleFinished">
      <view class="result-content">
        <view class="result-icon">{{ battleSuccess ? '🎉' : '💔' }}</view>
        <view class="result-title">
          {{ battleSuccess ? '发布成功！' : '发布失败...' }}
        </view>
        <view class="result-completion">
          最终完成度: {{ finalCompletion.toFixed(1) }}%
        </view>
        <view class="result-desc">
          {{ battleSuccess ? '产品成功上线，即将展示市场反响' : '项目未能达到上线标准' }}
        </view>
      </view>

      <view 
        class="pixel-btn pixel-btn-success mt-40"
        @click="goToResult"
      >
        查看结果 →
      </view>
    </view>
  </view>
</template>

<script>
import { loadGameState, saveGameState } from '@/utils/storage'
import { generateBossSolution } from '@/data/solutions'
import { calculateBossCompletion, isBossSuccess, generateTodoTimings } from '@/utils/gameLogic'

export default {
  data() {
    return {
      gameState: null,
      product: null,
      playerStats: null,
      selectedSolutions: [],
      bossSolution: null,
      battleStarted: false,
      battleFinished: false,
      battleSuccess: false,
      completedCount: 0,
      currentProgress: 0,
      currentStamina: 0,
      maxStamina: 0,
      finalCompletion: 0,
      statusMessage: '',
      timers: []
    }
  },
  computed: {
    staminaPercent() {
      return (this.currentStamina / this.maxStamina * 100)
    },
    estimatedCompletion() {
      // 估算完成度（不考虑运气因素）
      return this.bossSolution.baseCompletionRate + this.bossSolution.qualityBonus
    }
  },
  onLoad() {
    this.initBattle()
  },
  onUnload() {
    this.timers.forEach(timer => clearTimeout(timer))
  },
  methods: {
    initBattle() {
      this.gameState = loadGameState()
      
      if (!this.gameState) {
        uni.showToast({
          title: '游戏状态错误',
          icon: 'none'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
        return
      }
      
      // 验证产品数据
      if (!this.gameState.product) {
        uni.showToast({
          title: '产品数据错误',
          icon: 'none'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
        return
      }
      
      // 验证玩家状态
      if (!this.gameState.playerStats) {
        uni.showToast({
          title: '玩家状态错误',
          icon: 'none'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
        return
      }
      
      this.product = this.gameState.product
      this.playerStats = this.gameState.playerStats
      this.selectedSolutions = this.gameState.selectedSolutions || []
      
      // 生成Boss战方案
      this.bossSolution = generateBossSolution(this.product, this.selectedSolutions)
      
      // 验证Boss方案
      if (!this.bossSolution || !this.bossSolution.todos) {
        uni.showToast({
          title: 'Boss方案生成失败',
          icon: 'none'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
        return
      }
      
      this.currentStamina = this.playerStats.stamina || 50
      this.maxStamina = this.playerStats.maxStamina || 50
    },
    startBattle() {
      this.battleStarted = true
      this.statusMessage = '开始整合各模块...'
      
      // 开始执行Boss战
      const totalTime = 12000 // 12秒
      const timings = generateTodoTimings(this.bossSolution.todos, totalTime)
      
      const staminaPerTodo = this.bossSolution.stamina / this.bossSolution.todos.length
      
      let currentTime = 0
      
      this.bossSolution.todos.forEach((todo, index) => {
        currentTime += timings[index]
        
        const timer = setTimeout(() => {
          this.completeTodo(index, staminaPerTodo)
        }, currentTime)
        
        this.timers.push(timer)
      })
      
      // 战斗结束
      const finishTimer = setTimeout(() => {
        this.finishBattle()
      }, currentTime + 1000)
      
      this.timers.push(finishTimer)
    },
    completeTodo(index, staminaCost) {
      this.completedCount = index + 1
      this.currentStamina = Math.max(0, this.currentStamina - staminaCost)
      this.currentProgress = (this.completedCount / this.bossSolution.todos.length) * 100
      
      const messages = [
        '整合模块中...',
        '解决兼容性问题...',
        '全链路测试...',
        '性能优化...',
        '安全检查...',
        '准备上线...',
        '部署到生产环境...',
        '监控系统就位...',
        '正式发布...'
      ]
      this.statusMessage = messages[index % messages.length]
      
      uni.vibrateShort({
        type: 'light'
      })
      
      // 检查是否体力耗尽
      if (this.currentStamina <= 0 && this.completedCount < this.bossSolution.todos.length) {
        this.failBattle()
      }
    },
    finishBattle() {
      // 计算最终完成度
      this.finalCompletion = calculateBossCompletion(
        this.currentStamina,
        this.maxStamina,
        this.bossSolution,
        this.playerStats.luck
      )
      
      // 判断是否成功
      this.battleSuccess = isBossSuccess(
        this.finalCompletion,
        this.playerStats.tempUpgrades
      )
      
      this.battleFinished = true
      this.currentProgress = 100
      this.statusMessage = this.battleSuccess ? '发布成功！' : '未达标准...'
      
      // 更新游戏状态
      this.gameState.playerStats.stamina = Math.round(this.currentStamina)
      this.gameState.battleResult = {
        success: this.battleSuccess,
        completion: this.finalCompletion
      }
      
      saveGameState(this.gameState)
      
      // 震动反馈
      if (this.battleSuccess) {
        uni.vibrateShort()
        setTimeout(() => uni.vibrateShort(), 200)
      } else {
        uni.vibrateLong()
      }
    },
    failBattle() {
      this.timers.forEach(timer => clearTimeout(timer))
      this.timers = []
      
      this.finalCompletion = calculateBossCompletion(
        0,
        this.maxStamina,
        this.bossSolution,
        this.playerStats.luck
      )
      
      this.battleSuccess = false
      this.battleFinished = true
      this.currentStamina = 0
      this.statusMessage = '体力耗尽...'
      
      this.gameState.battleResult = {
        success: false,
        completion: this.finalCompletion
      }
      
      saveGameState(this.gameState)
      
      uni.vibrateLong()
    },
    goToResult() {
      uni.redirectTo({
        url: `/pages/result/result?success=${this.battleSuccess}`
      })
    }
  }
}
</script>

<style scoped>
.boss-battle-page {
  min-height: 100vh;
  padding: 40rpx;
  background: #F4E4C1;
  padding-bottom: 80rpx;
}

.boss-header {
  padding: 60rpx 40rpx;
}

.terminal-text {
  font-size: 40rpx;
  font-weight: bold;
  text-align: center;
}

.terminal-subtitle {
  font-size: 28rpx;
  text-align: center;
  margin-top: 20rpx;
  opacity: 0.8;
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

.ml-10 {
  margin-left: 10rpx;
}

.preparation-info {
  margin-top: 30rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20rpx 0;
  font-size: 28rpx;
}

.info-label {
  font-weight: bold;
  color: #5D4037;
}

.info-value {
  font-weight: bold;
  color: #3E2723;
  font-size: 32rpx;
}

.value-danger {
  color: #E53935;
}

.solutions-review {
  background: rgba(109, 76, 65, 0.1);
  padding: 25rpx;
  border: 2px solid #6D4C41;
}

.review-title {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.review-item {
  display: flex;
  gap: 20rpx;
  align-items: center;
  margin: 15rpx 0;
  font-size: 24rpx;
}

.review-quarter {
  font-weight: bold;
  background: #6D4C41;
  color: #F4E4C1;
  padding: 5rpx 15rpx;
}

.review-name {
  flex: 1;
}

.review-quality {
  font-weight: bold;
  color: #558B2F;
}

.boss-preview {
  background: #F4E4C1;
  padding: 25rpx;
  border: 3px solid #3E2723;
}

.preview-title {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.preview-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.preview-item {
  font-size: 24rpx;
  color: #5D4037;
  line-height: 1.6;
}

.success-rate {
  text-align: center;
  padding: 30rpx;
  background: rgba(255, 193, 7, 0.2);
  border: 3px solid #FFC107;
}

.rate-label {
  font-size: 28rpx;
  margin-right: 15rpx;
}

.rate-value {
  font-size: 48rpx;
  font-weight: bold;
  color: #F57C00;
}

.rate-desc {
  font-size: 24rpx;
  color: #5D4037;
  margin-top: 15rpx;
}

.battle-screen {
  min-height: 600rpx;
}

.battle-progress {
  text-align: center;
}

.progress-label {
  font-size: 32rpx;
  font-weight: bold;
}

.progress-text {
  font-size: 36rpx;
  font-weight: bold;
}

.battle-todos {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.battle-todo {
  display: flex;
  gap: 15rpx;
  font-size: 26rpx;
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

.todo-text {
  flex: 1;
  line-height: 1.6;
}

.strikethrough {
  text-decoration: line-through;
}

.battle-stamina {
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

.battle-message {
  font-size: 26rpx;
  font-style: italic;
  opacity: 0.8;
}

.result-content {
  text-align: center;
  padding: 40rpx 0;
}

.result-icon {
  font-size: 120rpx;
  margin-bottom: 30rpx;
}

.result-title {
  font-size: 48rpx;
  font-weight: bold;
  color: #3E2723;
  margin-bottom: 20rpx;
}

.result-completion {
  font-size: 40rpx;
  font-weight: bold;
  color: #F57C00;
  margin-bottom: 20rpx;
}

.result-desc {
  font-size: 28rpx;
  color: #5D4037;
  line-height: 1.8;
}
</style>

