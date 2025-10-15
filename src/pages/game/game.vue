<template>
  <view class="game-page">
    <!-- 游戏标题 -->
    <view class="crt-screen game-header">
      <view class="terminal-text">
        <text>{{ currentYear }}年</text>
        <text class="blink ml-20">█</text>
      </view>
    </view>

    <!-- 产品信息 -->
    <view class="pixel-card mt-30" v-if="currentProduct">
      <view class="product-header">
        <view class="product-name">{{ currentProduct.name }}</view>
        <view class="pixel-badge" :class="'badge-' + currentProduct.grade.toLowerCase()">
          {{ currentProduct.grade }}级
        </view>
      </view>
      <view class="product-desc mt-20">{{ currentProduct.description }}</view>
      <view class="product-category mt-10">
        分类: {{ getCategoryName(currentProduct.category) }}
      </view>
    </view>

    <!-- 玩家状态 -->
    <view class="pixel-card mt-30">
      <view class="pixel-subtitle">当前状态</view>
      
      <view class="status-item">
        <view class="status-label">👁️ 眼界</view>
        <view class="status-value">{{ playerStats.vision }}</view>
      </view>

      <view class="status-item">
        <view class="status-label">🍀 运气</view>
        <view class="status-value">{{ playerStats.luck }}</view>
      </view>

      <view class="status-item">
        <view class="status-label">💪 体力</view>
        <view class="status-bar">
          <view class="pixel-progress">
            <view 
              class="pixel-progress-bar" 
              :class="{ 'bar-danger': staminaPercent < 30, 'bar-warning': staminaPercent < 60 }"
              :style="{width: staminaPercent + '%'}"
            ></view>
          </view>
          <text class="status-value">{{ playerStats.stamina }} / {{ playerStats.maxStamina }}</text>
        </view>
      </view>
    </view>

    <!-- 临时升级 -->
    <view class="pixel-card mt-30" v-if="playerStats.tempUpgrades && playerStats.tempUpgrades.length > 0">
      <view class="pixel-subtitle">临时增益</view>
      <view class="temp-upgrades">
        <view 
          v-for="(upgrade, index) in playerStats.tempUpgrades" 
          :key="index"
          class="temp-upgrade-item"
        >
          <text class="upgrade-icon">{{ upgrade.icon }}</text>
          <text class="upgrade-name">{{ upgrade.name }}</text>
        </view>
      </view>
    </view>

    <!-- 进度指示 -->
    <view class="pixel-card mt-30">
      <view class="pixel-subtitle">项目进度</view>
      <view class="progress-steps">
        <view 
          v-for="i in 4" 
          :key="i"
          class="progress-step"
          :class="{ 
            'step-completed': i < quarterIndex + 1,
            'step-current': i === quarterIndex + 1
          }"
        >
          <view class="step-circle">
            <text v-if="i < quarterIndex + 1">✓</text>
            <text v-else>{{ i }}</text>
          </view>
          <view class="step-label">
            {{ i <= 3 ? 'Q' + i : 'Boss' }}
          </view>
        </view>
      </view>
    </view>

    <!-- 当前任务信息 -->
    <view class="pixel-card mt-30" v-if="currentProduct && quarterIndex < 3">
      <view class="pixel-subtitle">
        第{{ quarterIndex + 1 }}季度任务
      </view>
      <view class="quarter-info">
        <view class="quarter-name">{{ currentProduct.quarters[quarterIndex].name }}</view>
        <view class="quarter-desc">{{ currentProduct.quarters[quarterIndex].desc }}</view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="button-group mt-40">
      <view 
        class="pixel-btn pixel-btn-success"
        v-if="quarterIndex < 3"
        @click="startQuarter"
      >
        开始第{{ quarterIndex + 1 }}季度 ▶
      </view>

      <view 
        class="pixel-btn pixel-btn-danger"
        v-if="quarterIndex === 3"
        @click="startBoss"
      >
        开始Boss战 ⚔️
      </view>

      <view class="pixel-btn mt-20" @click="confirmQuit">
        放弃项目
      </view>
    </view>

    <!-- 确认退出弹窗 -->
    <view class="modal-mask" v-if="showQuitModal" @click="showQuitModal = false">
      <view class="modal-content pixel-container" @click.stop>
        <view class="pixel-subtitle text-center">确认放弃？</view>
        <view class="modal-text">
          放弃当前项目将失去所有进度
          <br/>临时升级也会失效
          <br/>
          <br/>确定要放弃吗？
        </view>
        <view class="modal-buttons">
          <view class="pixel-btn flex-1" @click="showQuitModal = false">
            取消
          </view>
          <view class="pixel-btn pixel-btn-danger flex-1 ml-20" @click="quitGame">
            确定放弃
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { loadPlayerData, saveGameState, clearGameState } from '@/utils/storage'
import { selectRandomProduct } from '@/data/products'

export default {
  data() {
    return {
      currentProduct: null,
      playerStats: {
        vision: 50,
        luck: 50,
        stamina: 50,
        maxStamina: 50,
        tempUpgrades: []
      },
      quarterIndex: 0,
      selectedSolutions: [],
      currentYear: 2000,
      showQuitModal: false
    }
  },
  computed: {
    staminaPercent() {
      return (this.playerStats.stamina / this.playerStats.maxStamina * 100)
    }
  },
  onLoad() {
    this.initGame()
  },
  methods: {
    initGame() {
      // 加载玩家数据
      const playerData = loadPlayerData()
      
      // 根据眼界选择产品
      this.currentProduct = selectRandomProduct(playerData.vision)
      
      if (!this.currentProduct) {
        uni.showModal({
          title: '提示',
          content: '没有找到合适的产品，请提升眼界后再试',
          showCancel: false,
          success: () => {
            uni.navigateBack()
          }
        })
        return
      }
      
      // 设置年份
      this.currentYear = this.currentProduct.year
      
      // 初始化玩家状态
      this.playerStats = {
        vision: playerData.vision,
        luck: playerData.luck,
        stamina: playerData.stamina,
        maxStamina: playerData.maxStamina,
        tempUpgrades: playerData.tempUpgrades || []
      }
      
      // 保存游戏状态
      this.saveState()
    },
    saveState() {
      saveGameState({
        product: this.currentProduct,
        playerStats: this.playerStats,
        quarterIndex: this.quarterIndex,
        selectedSolutions: this.selectedSolutions,
        currentYear: this.currentYear
      })
    },
    startQuarter() {
      this.saveState()
      
      uni.navigateTo({
        url: '/pages/quarter-task/quarter-task'
      })
    },
    startBoss() {
      this.saveState()
      
      uni.navigateTo({
        url: '/pages/boss-battle/boss-battle'
      })
    },
    confirmQuit() {
      this.showQuitModal = true
    },
    quitGame() {
      clearGameState()
      uni.reLaunch({
        url: '/pages/home/home'
      })
    },
    getCategoryName(category) {
      const names = {
        social: '社交',
        ecommerce: '电商',
        video: '视频',
        tool: '工具',
        media: '媒体',
        content: '内容',
        education: '教育',
        fintech: '金融科技',
        search: '搜索',
        transport: '出行',
        game: '游戏',
        enterprise: '企业服务',
        security: '安全'
      }
      return names[category] || category
    }
  }
}
</script>

<style scoped>
.game-page {
  min-height: 100vh;
  padding: 40rpx;
  background: #F4E4C1;
  padding-bottom: 80rpx;
}

.game-header {
  padding: 40rpx;
}

.terminal-text {
  font-size: 48rpx;
  font-weight: bold;
  text-align: center;
}

.ml-20 {
  margin-left: 20rpx;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-name {
  font-size: 40rpx;
  font-weight: bold;
  color: #3E2723;
}

.product-desc {
  font-size: 28rpx;
  color: #5D4037;
  line-height: 1.6;
}

.product-category {
  font-size: 24rpx;
  color: #8D6E63;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20rpx 0;
}

.status-label {
  font-size: 28rpx;
  font-weight: bold;
}

.status-value {
  font-size: 28rpx;
  font-weight: bold;
  color: #3E2723;
}

.status-bar {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-left: 20rpx;
}

.status-bar .pixel-progress {
  flex: 1;
}

.bar-warning .pixel-progress-bar {
  background: #FFA726 !important;
}

.bar-danger .pixel-progress-bar {
  background: #E53935 !important;
}

.temp-upgrades {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
  margin-top: 20rpx;
}

.temp-upgrade-item {
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 15rpx 25rpx;
  background: rgba(85, 139, 47, 0.1);
  border: 2px solid #558B2F;
  font-size: 24rpx;
}

.upgrade-icon {
  font-size: 32rpx;
}

.upgrade-name {
  font-weight: bold;
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  margin-top: 30rpx;
  position: relative;
}

.progress-steps::before {
  content: '';
  position: absolute;
  top: 25rpx;
  left: 12.5%;
  right: 12.5%;
  height: 4rpx;
  background: #D7CCC8;
  z-index: 0;
}

.progress-step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
}

.step-circle {
  width: 50rpx;
  height: 50rpx;
  border: 4px solid #D7CCC8;
  background: #F4E4C1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 24rpx;
}

.step-completed .step-circle {
  background: #558B2F;
  border-color: #558B2F;
  color: #FFF;
}

.step-current .step-circle {
  background: #FFC107;
  border-color: #FFA000;
  color: #3E2723;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.step-label {
  font-size: 22rpx;
  margin-top: 10rpx;
  font-weight: bold;
}

.quarter-info {
  margin-top: 20rpx;
}

.quarter-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #3E2723;
  margin-bottom: 15rpx;
}

.quarter-desc {
  font-size: 26rpx;
  color: #5D4037;
  line-height: 1.6;
}

.button-group {
  display: flex;
  flex-direction: column;
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
  width: 85%;
  background: #F4E4C1;
  padding: 40rpx;
}

.modal-text {
  font-size: 28rpx;
  line-height: 2;
  color: #5D4037;
  text-align: center;
  margin: 30rpx 0;
}

.modal-buttons {
  display: flex;
  gap: 20rpx;
  margin-top: 30rpx;
}
</style>

