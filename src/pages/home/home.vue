<template>
  <view class="home-page">
    <!-- CRT显示器效果的标题 -->
    <view class="crt-screen header-screen">
      <view class="terminal-text">
        <text class="blink">█</text>
        <text> PROGRAMMER SIMULATOR </text>
        <text class="blink">█</text>
      </view>
      <view class="terminal-subtitle">
        程序员模拟器 v1.0
      </view>
    </view>

    <!-- 游戏介绍 -->
    <view class="pixel-card mt-40">
      <view class="pixel-subtitle text-center">游戏介绍</view>
      <view class="intro-text">
        一觉醒来你回到了2000年
        <br/>决定以程序员的身份重新开始人生
        <br/>
        <br/>在这里，你将：
        <br/>• 开发各种互联网产品
        <br/>• 经历季度任务和年度Boss战
        <br/>• 从C级独立作品做到S级世界级产品
        <br/>• 见证中国互联网的发展历程
      </view>
    </view>

    <!-- 玩家属性 -->
    <view class="pixel-card mt-30">
      <view class="pixel-subtitle text-center">当前属性</view>
      
      <view class="attr-item">
        <view class="attr-label">👁️ 眼界</view>
        <view class="attr-bar">
          <view class="pixel-progress">
            <view class="pixel-progress-bar" :style="{width: playerData.vision + '%'}"></view>
          </view>
          <text class="attr-value">{{ playerData.vision }}</text>
        </view>
      </view>

      <view class="attr-item">
        <view class="attr-label">🍀 运气</view>
        <view class="attr-bar">
          <view class="pixel-progress">
            <view class="pixel-progress-bar" :style="{width: playerData.luck + '%'}"></view>
          </view>
          <text class="attr-value">{{ playerData.luck }}</text>
        </view>
      </view>

      <view class="attr-item">
        <view class="attr-label">💪 体力</view>
        <view class="attr-bar">
          <view class="pixel-progress">
            <view class="pixel-progress-bar" :style="{width: (playerData.stamina / playerData.maxStamina * 100) + '%'}"></view>
          </view>
          <text class="attr-value">{{ playerData.stamina }} / {{ playerData.maxStamina }}</text>
        </view>
      </view>

      <view class="crystals-info">
        <text class="crystal-icon">💎</text>
        <text class="crystal-text">晶核: {{ playerData.crystals }}</text>
      </view>
    </view>

    <!-- 游戏统计 -->
    <view class="pixel-card mt-30" v-if="playerData.gamesPlayed > 0">
      <view class="pixel-subtitle text-center">游戏统计</view>
      <view class="stats-grid">
        <view class="stat-item">
          <view class="stat-value">{{ playerData.gamesPlayed }}</view>
          <view class="stat-label">游戏局数</view>
        </view>
        <view class="stat-item">
          <view class="stat-value">{{ playerData.gamesWon }}</view>
          <view class="stat-label">成功次数</view>
        </view>
        <view class="stat-item">
          <view class="stat-value">{{ playerData.bestGrade || '-' }}</view>
          <view class="stat-label">最佳评级</view>
        </view>
        <view class="stat-item">
          <view class="stat-value">{{ playerData.totalCrystals }}</view>
          <view class="stat-label">总晶核</view>
        </view>
      </view>
    </view>

    <!-- 按钮组 -->
    <view class="button-group mt-40">
      <view class="pixel-btn pixel-btn-success" @click="startGame">
        开始游戏 ▶
      </view>
      <view class="pixel-btn pixel-btn-primary mt-20" @click="goToUpgrade">
        能力升级 ⬆
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
            <text class="rule-section">【数值体系】</text>
            <br/>• 眼界：决定下一个项目的品级
            <br/>• 运气：影响项目发布后的市场反响
            <br/>• 体力：开发过程中会消耗，归零则失败
            <br/><br/>
            <text class="rule-section">【游戏流程】</text>
            <br/>• 每个产品分为3个季度任务 + 1个年度Boss战
            <br/>• 季度任务提供3种方案，体力消耗和质量各不相同
            <br/>• Boss战需要完成度≥80%才能成功
            <br/>• 成功后可获得临时升级，持续到本局结束
            <br/><br/>
            <text class="rule-section">【产品等级】</text>
            <br/>• C级：独立作品、外包产品
            <br/>• B级：有市场反响的小产品
            <br/>• A级：风靡全国的产品
            <br/>• S级：世界级产品
            <br/><br/>
            <text class="rule-section">【晶核系统】</text>
            <br/>• 完成项目获得晶核奖励
            <br/>• 即使失败也会获得少量晶核
            <br/>• 使用晶核永久提升属性
            <br/><br/>
            <text class="rule-section">【胜利条件】</text>
            <br/>• 成功做出A级或S级产品通关
            <br/>• 获得丰厚的晶核奖励
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
import { loadPlayerData, resetPlayerData } from '@/utils/storage'

// 状态数据
const playerData = ref({
  vision: 50,
  luck: 50,
  stamina: 50,
  maxStamina: 50,
  crystals: 0,
  gamesPlayed: 0,
  gamesWon: 0,
  bestGrade: null,
  totalCrystals: 0
})
const showRulesModal = ref(false)

// 方法
const loadData = () => {
  playerData.value = loadPlayerData()
}

const startGame = () => {
  // 重置游戏状态（保留晶核和升级）
  const newData = resetPlayerData()
  playerData.value = newData
  
  // 跳转到游戏主界面
  uni.navigateTo({
    url: '/pages/game/game'
  })
}

const goToUpgrade = () => {
  uni.navigateTo({
    url: '/pages/upgrade/upgrade'
  })
}

const showRules = () => {
  showRulesModal.value = true
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

.crystals-info {
  margin-top: 30rpx;
  text-align: center;
  padding: 20rpx;
  background: rgba(255, 193, 7, 0.2);
  border: 3px solid #FFC107;
}

.crystal-icon {
  font-size: 32rpx;
}

.crystal-text {
  font-size: 32rpx;
  font-weight: bold;
  margin-left: 10rpx;
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
</style>

