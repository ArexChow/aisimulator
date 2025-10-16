<template>
  <view class="home-page">
    <!-- CRT显示器效果的标题 -->
    <view class="crt-screen header-screen">
      <view class="terminal-text">
        <text class="blink">█</text>
        <text> SOFTWARE STORY </text>
        <text class="blink">█</text>
      </view>
      <view class="terminal-subtitle">
        软件开发物语 v1.0
      </view>
    </view>

    <!-- 游戏介绍 -->
    <view class="pixel-card mt-40">
      <view class="pixel-subtitle text-center">游戏介绍</view>
      <view class="intro-text">
        一觉醒来你回到了2000年
        <br/>决定用8万元启动资金创办软件公司
        <br/>
        <br/>你将：
        <br/>• 招聘优秀员工组建团队
        <br/>• 开发各类互联网产品
        <br/>• 管理资金和运营
        <br/>• 打造世界级伟大公司！
      </view>
    </view>

    <!-- 历史统计 -->
    <view class="pixel-card mt-30" v-if="historyStats.gamesPlayed > 0">
      <view class="pixel-subtitle text-center">历史统计</view>
      <view class="stats-grid">
        <view class="stat-item">
          <view class="stat-value">{{ historyStats.gamesPlayed }}</view>
          <view class="stat-label">创业次数</view>
        </view>
        <view class="stat-item">
          <view class="stat-value">{{ formatMoney(historyStats.totalRevenue) }}</view>
          <view class="stat-label">累计收入</view>
        </view>
        <view class="stat-item">
          <view class="stat-value">{{ historyStats.totalProducts }}</view>
          <view class="stat-label">产品总数</view>
        </view>
        <view class="stat-item">
          <view class="stat-value">{{ historyStats.longestSurvival }}</view>
          <view class="stat-label">最长存活(周)</view>
        </view>
      </view>
      <view class="best-product" v-if="historyStats.bestProduct">
        <view class="best-product-title">🏆 最佳产品</view>
        <view class="best-product-name">{{ historyStats.bestProduct.name }}</view>
        <view class="best-product-stats">
          DAU: {{ formatNumber(historyStats.bestProduct.dau) }} | 
          收入: {{ formatMoney(historyStats.bestProduct.revenue) }}/月
        </view>
      </view>
    </view>

    <!-- 按钮组 -->
    <view class="button-group mt-40">
      <view class="pixel-btn pixel-btn-success" @click="startNewGame" v-if="!hasSavedGame">
        开始创业 ▶
      </view>
      <view class="pixel-btn pixel-btn-success" @click="continueGame" v-if="hasSavedGame">
        继续游戏 ▶
      </view>
      <view class="pixel-btn pixel-btn-primary mt-20" @click="startNewGame" v-if="hasSavedGame">
        新的开始 🔄
      </view>
      <view class="pixel-btn mt-20" @click="showRules">
        游戏规则 ？
      </view>
    </view>

    <!-- 规则弹窗 -->
    <view class="modal-mask" v-if="showRulesModal" @click="showRulesModal = false">
      <view class="modal-content pixel-container" @click.stop>
        <view class="pixel-subtitle text-center">游戏规则</view>
        <scroll-view scroll-y class="rules-scroll">
          <view class="rules-text">
            <text class="rule-section">【核心玩法】</text>
            <br/>• 招聘员工：通过不同渠道招聘员工组建团队
            <br/>• 开发产品：选择产品类型，分配员工进行研发
            <br/>• 经营管理：产品上线后持续运营获得收入
            <br/>• 资金管理：平衡收入支出，避免破产
            <br/><br/>
            <text class="rule-section">【员工系统】</text>
            <br/>• 三维能力：编程、美术、商业
            <br/>• 体力机制：工作会消耗体力，低于20可能摸鱼
            <br/>• 个性特质：不同个性影响工作效率
            <br/>• 月薪支出：能力越强工资越高
            <br/><br/>
            <text class="rule-section">【产品研发】</text>
            <br/>• 快速方案：1人，4周完成，质量一般
            <br/>• 平衡方案：2人，8周完成，质量良好
            <br/>• 精益方案：3人，12周完成，质量优秀
            <br/>• 产品上线后开始产生DAU和收入
            <br/><br/>
            <text class="rule-section">【时间流逝】</text>
            <br/>• 8秒 = 1周，时间自动流逝
            <br/>• 每周结算收支，更新产品数据
            <br/>• 员工体力下降，可能进入摸鱼状态
            <br/>• 从2000年PC时代到AI时代
            <br/><br/>
            <text class="rule-section">【结束条件】</text>
            <br/>• 资金耗尽无法支付工资则破产
            <br/>• 坚持越久、产品越成功，成就越高
          </view>
        </scroll-view>
        <view class="pixel-btn mt-20" @click="showRulesModal = false">
          关闭
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { hasSavedGame as checkSavedGame, getHistoryStatistics } from '@/utils/storage'

// 状态数据
const showRulesModal = ref(false)
const hasSavedGame = ref(false)
const historyStats = ref({
  gamesPlayed: 0,
  totalRevenue: 0,
  totalProducts: 0,
  longestSurvival: 0,
  peakMoney: 0,
  bestProduct: null
})

// 方法
const loadData = () => {
  hasSavedGame.value = checkSavedGame()
  historyStats.value = getHistoryStatistics()
}

const startNewGame = () => {
  // 如果有存档，确认是否覆盖
  if (hasSavedGame.value) {
    uni.showModal({
      title: '确认开始新游戏？',
      content: '当前存档将被覆盖，是否继续？',
      success: (res) => {
        if (res.confirm) {
          goToCompanySetup()
        }
      }
    })
  } else {
    goToCompanySetup()
  }
}

const continueGame = () => {
  // 继续游戏，跳转到主面板
  uni.navigateTo({
    url: '/pages/dashboard/dashboard'
  })
}

const goToCompanySetup = () => {
  // 跳转到公司创建页面
  uni.navigateTo({
    url: '/pages/company-setup/company-setup'
  })
}

const showRules = () => {
  showRulesModal.value = true
}

const formatMoney = (amount) => {
  if (amount >= 10000) {
    return (amount / 10000).toFixed(1) + '万'
  }
  return amount.toFixed(0)
}

const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toFixed(0)
}

// 生命周期
onLoad(() => {
  loadData()
})

onShow(() => {
  // 每次显示页面时重新加载数据
  loadData()
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  padding: 40rpx;
  background: #F4E4C1;
}

.header-screen {
  padding: 60rpx 40rpx;
}

.terminal-text {
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
  letter-spacing: 4rpx;
}

.terminal-subtitle {
  font-size: 28rpx;
  text-align: center;
  margin-top: 20rpx;
  opacity: 0.8;
}

.intro-text {
  font-size: 28rpx;
  line-height: 2;
  color: #5D4037;
}

.attr-item {
  margin: 20rpx 0;
}

.attr-label {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.attr-bar {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.attr-bar .pixel-progress {
  flex: 1;
}

.attr-value {
  font-size: 24rpx;
  font-weight: bold;
  min-width: 100rpx;
  text-align: right;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
  margin-top: 20rpx;
}

.stat-item {
  text-align: center;
  padding: 20rpx;
  background: rgba(109, 76, 65, 0.1);
  border: 2px solid #6D4C41;
}

.stat-value {
  font-size: 48rpx;
  font-weight: bold;
  color: #3E2723;
}

.stat-label {
  font-size: 24rpx;
  color: #5D4037;
  margin-top: 10rpx;
}

.button-group {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding-bottom: 40rpx;
}

.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-height: 80vh;
  background: #F4E4C1;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
}

.rules-scroll {
  flex: 1;
  max-height: 800rpx;
  margin: 20rpx 0;
}

.rules-text {
  font-size: 26rpx;
  line-height: 1.8;
  color: #3E2723;
}

.rule-section {
  font-weight: bold;
  color: #6D4C41;
  font-size: 28rpx;
}

.best-product {
  margin-top: 30rpx;
  padding: 20rpx;
  background: rgba(255, 193, 7, 0.1);
  border: 2px solid #FFC107;
  text-align: center;
}

.best-product-title {
  font-size: 24rpx;
  color: #F57C00;
  margin-bottom: 10rpx;
}

.best-product-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #E65100;
  margin-bottom: 10rpx;
}

.best-product-stats {
  font-size: 24rpx;
  color: #5D4037;
}
</style>

