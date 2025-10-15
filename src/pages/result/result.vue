<template>
  <view class="result-page">
    <!-- 结果标题 -->
    <view class="crt-screen result-header">
      <view class="terminal-text">
        <text>{{ resultData.emoji }}</text>
        <text> {{ resultData.title }} </text>
        <text>{{ resultData.emoji }}</text>
      </view>
    </view>

    <!-- 产品信息 -->
    <view class="pixel-card mt-40">
      <view class="product-summary">
        <view class="summary-title">{{ product.name }}</view>
        <view class="summary-grade">
          <text class="grade-label">最终评级:</text>
          <view class="pixel-badge badge-large" :class="'badge-' + finalGrade.toLowerCase()">
            {{ finalGrade }}级
          </view>
        </view>
        <view class="summary-completion">
          完成度: {{ completion.toFixed(1) }}%
        </view>
      </view>
    </view>

    <!-- 市场反响 -->
    <view class="pixel-card mt-30" v-if="isSuccess">
      <view class="pixel-subtitle">市场反响</view>
      <view class="market-response scroll-text">
        {{ resultData.description }}
      </view>

      <!-- 评级变化 -->
      <view class="grade-change mt-30" v-if="gradeChange !== 0">
        <view class="change-icon">{{ gradeChange > 0 ? '⬆️' : '⬇️' }}</view>
        <view class="change-text">
          评级{{ gradeChange > 0 ? '提升' : '下降' }}了 {{ Math.abs(gradeChange) }} 级！
        </view>
      </view>
    </view>

    <!-- 失败原因 -->
    <view class="pixel-card mt-30" v-if="!isSuccess">
      <view class="pixel-subtitle">失败总结</view>
      <view class="failure-text scroll-text">
        {{ resultData.description }}
      </view>
    </view>

    <!-- 数据统计 -->
    <view class="pixel-card mt-30">
      <view class="pixel-subtitle">本局统计</view>
      <view class="stats-grid">
        <view class="stat-box">
          <view class="stat-label">开发时长</view>
          <view class="stat-value">{{ gameState.quarterIndex + 1 }}季度</view>
        </view>
        <view class="stat-box">
          <view class="stat-label">剩余体力</view>
          <view class="stat-value">{{ gameState.playerStats.stamina }}</view>
        </view>
        <view class="stat-box">
          <view class="stat-label">眼界</view>
          <view class="stat-value">{{ gameState.playerStats.vision }}</view>
        </view>
        <view class="stat-box">
          <view class="stat-label">运气</view>
          <view class="stat-value">{{ gameState.playerStats.luck }}</view>
        </view>
      </view>
    </view>

    <!-- 奖励 -->
    <view class="pixel-card mt-30 reward-card">
      <view class="pixel-subtitle text-center">获得奖励</view>
      <view class="reward-content">
        <view class="reward-icon">💎</view>
        <view class="reward-amount">+{{ crystalReward }}</view>
        <view class="reward-label">晶核</view>
      </view>
      <view class="reward-desc" v-if="isSuccess && (finalGrade === 'A' || finalGrade === 'S')">
        🎉 恭喜通关！获得大量晶核奖励！
      </view>
    </view>

    <!-- 临时升级选择（成功且未通关） -->
    <view 
      class="pixel-card mt-30" 
      v-if="isSuccess && !isGameOver"
    >
      <view class="pixel-subtitle text-center">选择临时升级</view>
      <view class="upgrade-desc">
        选择一项临时增益，持续到本局游戏结束
      </view>
      
      <view class="temp-upgrades-list mt-30">
        <view 
          v-for="(upgrade, index) in tempUpgrades" 
          :key="upgrade.id"
          class="temp-upgrade-card"
          :class="{ 'upgrade-selected': selectedUpgradeIndex === index }"
          @click="selectUpgrade(index)"
        >
          <view class="upgrade-icon-large">{{ upgrade.icon }}</view>
          <view class="upgrade-name">{{ upgrade.name }}</view>
          <view class="upgrade-effect">{{ upgrade.description }}</view>
        </view>
      </view>
    </view>

    <!-- 按钮 -->
    <view class="button-group mt-40">
      <!-- 成功未通关：选择升级继续 -->
      <view 
        v-if="isSuccess && !isGameOver"
        class="pixel-btn pixel-btn-success"
        :class="{ 'pixel-btn-disabled': selectedUpgradeIndex === null }"
        @click="continueWithUpgrade"
      >
        确认升级并继续 →
      </view>

      <!-- 通关或失败：返回首页 -->
      <view 
        v-if="isGameOver || !isSuccess"
        class="pixel-btn pixel-btn-primary"
        @click="backToHome"
      >
        {{ isGameOver ? '返回首页 🏠' : '重新开始' }}
      </view>

      <!-- 查看能力升级 -->
      <view 
        v-if="crystalReward > 0"
        class="pixel-btn mt-20"
        @click="goToUpgrade"
      >
        使用晶核升级 ⬆️
      </view>
    </view>
  </view>
</template>

<script>
import { 
  loadGameState, 
  loadPlayerData, 
  savePlayerData, 
  updateCrystals,
  saveGameHistory,
  clearGameState 
} from '@/utils/storage'
import { 
  calculateProductGrade, 
  calculateReward, 
  calculateFailureReward,
  generateMarketResponse,
  generateFailureResponse,
  compareGrade
} from '@/utils/gameLogic'
import { getRandomTempUpgrades, applyTempUpgrade } from '@/data/upgrades'

export default {
  data() {
    return {
      gameState: null,
      product: null,
      isSuccess: false,
      completion: 0,
      finalGrade: 'C',
      gradeChange: 0,
      crystalReward: 0,
      resultData: {
        title: '',
        description: '',
        emoji: ''
      },
      tempUpgrades: [],
      selectedUpgradeIndex: null,
      isGameOver: false
    }
  },
  onLoad(options) {
    this.isSuccess = options.success === 'true'
    this.initResult()
  },
  methods: {
    initResult() {
      this.gameState = loadGameState()
      
      if (!this.gameState) {
        uni.showToast({
          title: '数据错误',
          icon: 'none'
        })
        setTimeout(() => {
          uni.reLaunch({
            url: '/pages/home/home'
          })
        }, 1500)
        return
      }
      
      this.product = this.gameState.product
      
      if (this.isSuccess) {
        this.processSuccess()
      } else {
        this.processFailure()
      }
      
      // 更新玩家数据
      this.updatePlayerData()
      
      // 保存游戏历史
      this.saveHistory()
    },
    processSuccess() {
      const battleResult = this.gameState.battleResult
      this.completion = battleResult.completion
      
      // 计算产品评级
      const gradeResult = calculateProductGrade(
        this.product,
        this.completion,
        this.gameState.playerStats.luck,
        this.gameState.playerStats.tempUpgrades
      )
      
      this.finalGrade = gradeResult.grade
      this.gradeChange = gradeResult.gradeChange
      
      // 生成市场反响
      this.resultData = generateMarketResponse(
        this.product,
        this.finalGrade,
        this.completion
      )
      
      // 计算奖励
      this.crystalReward = calculateReward(
        this.product,
        this.finalGrade,
        this.completion
      )
      
      // 判断是否通关
      this.isGameOver = (this.finalGrade === 'A' || this.finalGrade === 'S')
      
      // 如果未通关，生成临时升级选项
      if (!this.isGameOver) {
        this.tempUpgrades = getRandomTempUpgrades(3)
      }
    },
    processFailure() {
      const battleResult = this.gameState.battleResult
      this.completion = battleResult ? battleResult.completion : 0
      
      this.finalGrade = this.product.grade
      
      // 生成失败描述
      this.resultData = generateFailureResponse(
        this.product,
        this.completion
      )
      
      // 计算失败奖励
      this.crystalReward = calculateFailureReward(
        this.product,
        this.completion
      )
      
      this.isGameOver = true
    },
    updatePlayerData() {
      const playerData = loadPlayerData()
      
      // 更新游戏次数
      playerData.gamesPlayed += 1
      
      // 更新成功次数
      if (this.isSuccess) {
        playerData.gamesWon += 1
      }
      
      // 更新最佳评级
      if (!playerData.bestGrade || compareGrade(this.finalGrade, playerData.bestGrade) > 0) {
        playerData.bestGrade = this.finalGrade
      }
      
      // 添加晶核
      updateCrystals(this.crystalReward)
      
      savePlayerData(playerData)
    },
    saveHistory() {
      saveGameHistory({
        productName: this.product.name,
        productGrade: this.product.grade,
        finalGrade: this.finalGrade,
        completion: this.completion,
        success: this.isSuccess,
        crystalReward: this.crystalReward,
        quarters: this.gameState.quarterIndex + 1
      })
    },
    selectUpgrade(index) {
      this.selectedUpgradeIndex = index
      uni.vibrateShort({
        type: 'light'
      })
    },
    continueWithUpgrade() {
      if (this.selectedUpgradeIndex === null) {
        uni.showToast({
          title: '请选择一个升级',
          icon: 'none'
        })
        return
      }
      
      const selectedUpgrade = this.tempUpgrades[this.selectedUpgradeIndex]
      
      // 应用临时升级
      const newStats = applyTempUpgrade(this.gameState.playerStats, selectedUpgrade)
      
      // 恢复满体力
      newStats.stamina = newStats.maxStamina || 50
      
      // 保存玩家数据用于下一局
      const playerData = loadPlayerData()
      playerData.vision = newStats.vision
      playerData.luck = newStats.luck
      playerData.stamina = newStats.stamina
      playerData.maxStamina = newStats.maxStamina || playerData.maxStamina
      playerData.tempUpgrades = newStats.tempUpgrades || []
      
      savePlayerData(playerData)
      
      // 清除当前游戏状态
      clearGameState()
      
      // 返回首页开始新游戏
      uni.reLaunch({
        url: '/pages/home/home'
      })
      
      // 提示
      setTimeout(() => {
        uni.showToast({
          title: `获得了 ${selectedUpgrade.name}！`,
          icon: 'success'
        })
      }, 500)
    },
    backToHome() {
      clearGameState()
      uni.reLaunch({
        url: '/pages/home/home'
      })
    },
    goToUpgrade() {
      clearGameState()
      uni.reLaunch({
        url: '/pages/upgrade/upgrade'
      })
    }
  }
}
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
}

.terminal-text {
  font-size: 40rpx;
  font-weight: bold;
  text-align: center;
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

.product-summary {
  text-align: center;
}

.summary-title {
  font-size: 48rpx;
  font-weight: bold;
  color: #3E2723;
  margin-bottom: 30rpx;
}

.summary-grade {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.grade-label {
  font-size: 32rpx;
  font-weight: bold;
}

.badge-large {
  font-size: 36rpx;
  padding: 15rpx 30rpx;
}

.summary-completion {
  font-size: 36rpx;
  font-weight: bold;
  color: #F57C00;
}

.market-response {
  font-size: 28rpx;
  line-height: 2;
  color: #3E2723;
  white-space: pre-line;
  margin-top: 20rpx;
}

.grade-change {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15rpx;
  padding: 30rpx;
  background: rgba(255, 193, 7, 0.2);
  border: 3px solid #FFC107;
}

.change-icon {
  font-size: 48rpx;
}

.change-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #F57C00;
}

.failure-text {
  font-size: 28rpx;
  line-height: 2;
  color: #5D4037;
  white-space: pre-line;
  margin-top: 20rpx;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
  margin-top: 20rpx;
}

.stat-box {
  text-align: center;
  padding: 25rpx;
  background: rgba(109, 76, 65, 0.1);
  border: 2px solid #6D4C41;
}

.stat-label {
  font-size: 24rpx;
  color: #5D4037;
  margin-bottom: 10rpx;
}

.stat-value {
  font-size: 40rpx;
  font-weight: bold;
  color: #3E2723;
}

.reward-card {
  background: linear-gradient(135deg, #FFE082 0%, #FFD54F 100%);
}

.reward-content {
  text-align: center;
  padding: 40rpx 0;
}

.reward-icon {
  font-size: 100rpx;
  margin-bottom: 20rpx;
}

.reward-amount {
  font-size: 72rpx;
  font-weight: bold;
  color: #E65100;
  margin-bottom: 15rpx;
}

.reward-label {
  font-size: 32rpx;
  color: #5D4037;
}

.reward-desc {
  text-align: center;
  font-size: 28rpx;
  font-weight: bold;
  color: #E65100;
  margin-top: 20rpx;
}

.upgrade-desc {
  text-align: center;
  font-size: 26rpx;
  color: #5D4037;
  margin-top: 15rpx;
}

.temp-upgrades-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.temp-upgrade-card {
  padding: 30rpx;
  background: #FFF9C4;
  border: 4px solid #3E2723;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.upgrade-selected {
  background: #FFE082;
  box-shadow: 0 0 0 4px #FFC107, 6px 6px 0 rgba(0, 0, 0, 0.15);
}

.upgrade-icon-large {
  font-size: 64rpx;
  margin-bottom: 20rpx;
}

.upgrade-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #3E2723;
  margin-bottom: 15rpx;
}

.upgrade-effect {
  font-size: 26rpx;
  color: #5D4037;
  line-height: 1.6;
}

.button-group {
  display: flex;
  flex-direction: column;
}
</style>

