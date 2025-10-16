<template>
  <view class="result-page">
    <!-- 结果标题 -->
    <view class="crt-screen result-header">
      <view class="terminal-text">
        <text>{{ resultEmoji }}</text>
        <text> 公司破产 </text>
        <text>{{ resultEmoji }}</text>
      </view>
      <view class="terminal-subtitle">
        {{ gameState.companyName }} 已停止运营
      </view>
    </view>

    <!-- 存活时长 -->
    <view class="pixel-card mt-40">
      <view class="survival-info">
        <view class="survival-label">存活时长</view>
        <view class="survival-value">{{ survivalDisplay }}</view>
        <view class="survival-weeks">共 {{ totalWeeks }} 周</view>
      </view>
    </view>

    <!-- 核心统计 -->
    <view class="pixel-card mt-30">
      <view class="pixel-subtitle text-center">经营数据</view>
      <view class="stats-grid">
        <view class="stat-box">
          <view class="stat-icon">📦</view>
          <view class="stat-value">{{ gameState.statistics.productsLaunched }}</view>
          <view class="stat-label">产品总数</view>
        </view>
        <view class="stat-box">
          <view class="stat-icon">👥</view>
          <view class="stat-value">{{ gameState.statistics.employeesHired }}</view>
          <view class="stat-label">雇佣员工</view>
        </view>
        <view class="stat-box">
          <view class="stat-icon">💰</view>
          <view class="stat-value">{{ formatMoney(gameState.statistics.totalRevenue) }}</view>
          <view class="stat-label">总收入</view>
        </view>
        <view class="stat-box">
          <view class="stat-icon">💸</view>
          <view class="stat-value">{{ formatMoney(gameState.statistics.totalExpenses) }}</view>
          <view class="stat-label">总支出</view>
        </view>
      </view>
    </view>

    <!-- 最佳产品 -->
    <view class="pixel-card mt-30" v-if="gameState.statistics.bestProduct">
      <view class="pixel-subtitle text-center">🏆 最佳产品</view>
      <view class="best-product-info">
        <view class="best-product-name">{{ gameState.statistics.bestProduct.name }}</view>
        <view class="best-product-stats">
          <view class="best-stat-item">
            <text class="best-stat-label">最高DAU:</text>
            <text class="best-stat-value">{{ formatNumber(gameState.statistics.bestProduct.dau) }}</text>
          </view>
          <view class="best-stat-item">
            <text class="best-stat-label">月收入:</text>
            <text class="best-stat-value">¥{{ formatMoney(gameState.statistics.bestProduct.revenue) }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 时代进度 -->
    <view class="pixel-card mt-30">
      <view class="pixel-subtitle text-center">时代进程</view>
      <view class="era-info">
        <view class="era-current">{{ currentEra }}</view>
        <view class="era-year">{{ gameState.currentYear }}年</view>
      </view>
    </view>

    <!-- 破产原因 -->
    <view class="pixel-card mt-30 bankruptcy-reason">
      <view class="pixel-subtitle text-center">破产原因</view>
      <view class="reason-text">
        资金耗尽，无法支付员工工资和运营成本
      </view>
      <view class="final-money">
        最终资金：<text class="money-negative">¥{{ gameState.money.toFixed(2) }}</text>
      </view>
    </view>

    <!-- 按钮 -->
    <view class="button-group mt-40">
      <view class="pixel-btn pixel-btn-success" @click="restartGame">
        再次创业 🔄
      </view>
      <view class="pixel-btn mt-20" @click="goHome">
        返回主页
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { loadGameState, clearGameState, saveGameHistory } from '@/utils/storage'
import { getCurrentEra, getEraName } from '@/utils/timeSystem'
import { formatMoney } from '@/utils/financeManager'

// 状态数据
const gameState = ref(null)
const resultEmoji = ref('💔')

// 计算属性
const totalWeeks = computed(() => {
  if (!gameState.value) return 0
  return (gameState.value.currentYear - 2000) * 52 + gameState.value.currentWeek
})

const survivalDisplay = computed(() => {
  if (!gameState.value) return ''
  const years = gameState.value.currentYear - 2000
  const weeks = gameState.value.currentWeek
  
  if (years > 0) {
    return `${years}年${weeks}周`
  } else {
    return `${weeks}周`
  }
})

const currentEra = computed(() => {
  if (!gameState.value) return ''
  return getEraName(getCurrentEra(gameState.value.currentYear))
})

// 方法
const initData = () => {
  gameState.value = loadGameState()
  if (!gameState.value) {
    uni.showToast({
      title: '未找到游戏数据',
      icon: 'none'
    })
    setTimeout(() => {
      uni.reLaunch({ url: '/pages/home/home' })
    }, 1500)
    return
  }
  
  // 保存到历史记录
  const historyRecord = {
    companyName: gameState.value.companyName,
    startYear: 2000,
    endYear: gameState.value.currentYear,
    weeksPlayed: totalWeeks.value,
    statistics: { ...gameState.value.statistics }
  }
  
  saveGameHistory(historyRecord)
  
  // 设置emoji根据存活时间
  if (totalWeeks.value < 52) {
    resultEmoji.value = '💔'
  } else if (totalWeeks.value < 52 * 5) {
    resultEmoji.value = '😢'
  } else if (totalWeeks.value < 52 * 10) {
    resultEmoji.value = '😔'
  } else {
    resultEmoji.value = '👍'
  }
}

const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toFixed(0)
}

const restartGame = () => {
  clearGameState()
  uni.reLaunch({
    url: '/pages/company-setup/company-setup'
  })
}

const goHome = () => {
  clearGameState()
  uni.reLaunch({
    url: '/pages/home/home'
  })
}

// 生命周期
onLoad(() => {
  initData()
})
</script>

<style scoped>
.result-page {
  min-height: 100vh;
  padding: 40rpx;
  background: #F4E4C1;
  padding-bottom: 80rpx;
}

.result-header {
  padding: 60rpx 40rpx;
  background: #3E2723 !important;
}

.terminal-text {
  font-size: 40rpx;
  font-weight: bold;
  text-align: center;
  letter-spacing: 4rpx;
  color: #00FF00;
}

.terminal-subtitle {
  font-size: 26rpx;
  text-align: center;
  margin-top: 20rpx;
  opacity: 0.8;
  color: #00FF00;
}

.survival-info {
  text-align: center;
  padding: 30rpx;
}

.survival-label {
  font-size: 26rpx;
  color: #8D6E63;
  margin-bottom: 15rpx;
}

.survival-value {
  font-size: 64rpx;
  font-weight: bold;
  color: #3E2723;
  margin: 20rpx 0;
}

.survival-weeks {
  font-size: 28rpx;
  color: #5D4037;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
  margin-top: 30rpx;
}

.stat-box {
  text-align: center;
  padding: 30rpx 20rpx;
  background: rgba(109, 76, 65, 0.1);
  border: 3px solid #6D4C41;
}

.stat-icon {
  font-size: 48rpx;
  margin-bottom: 15rpx;
}

.stat-value {
  font-size: 40rpx;
  font-weight: bold;
  color: #3E2723;
  margin: 10rpx 0;
}

.stat-label {
  font-size: 24rpx;
  color: #5D4037;
}

.best-product-info {
  text-align: center;
  padding: 30rpx;
  background: rgba(255, 193, 7, 0.1);
  border: 3px solid #FFC107;
  margin-top: 20rpx;
}

.best-product-name {
  font-size: 42rpx;
  font-weight: bold;
  color: #E65100;
  margin-bottom: 25rpx;
}

.best-product-stats {
  display: flex;
  justify-content: center;
  gap: 40rpx;
}

.best-stat-item {
  text-align: center;
}

.best-stat-label {
  font-size: 24rpx;
  color: #8D6E63;
  display: block;
  margin-bottom: 10rpx;
}

.best-stat-value {
  font-size: 32rpx;
  font-weight: bold;
  color: #F57C00;
}

.era-info {
  text-align: center;
  padding: 30rpx;
}

.era-current {
  font-size: 36rpx;
  font-weight: bold;
  color: #3E2723;
  margin-bottom: 15rpx;
}

.era-year {
  font-size: 28rpx;
  color: #5D4037;
}

.bankruptcy-reason {
  background: rgba(198, 40, 40, 0.1);
  border: 4px solid #C62828;
}

.reason-text {
  font-size: 28rpx;
  color: #5D4037;
  line-height: 1.8;
  text-align: center;
  padding: 20rpx 0;
}

.final-money {
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
  color: #3E2723;
  margin-top: 20rpx;
}

.money-negative {
  color: #C62828;
  font-size: 40rpx;
}

.button-group {
  display: flex;
  flex-direction: column;
}
</style>
