<template>
  <view class="upgrade-page">
    <view class="pixel-title">能力升级</view>

    <!-- 晶核余额 -->
    <view class="crystals-balance">
      <text class="crystal-icon">💎</text>
      <text class="crystal-amount">{{ playerData.crystals }}</text>
      <text class="crystal-label">晶核</text>
    </view>

    <!-- 升级列表 -->
    <view class="upgrade-list">
      <view 
        v-for="(config, attr) in upgradeConfigs" 
        :key="attr"
        class="upgrade-card pixel-card"
      >
        <view class="upgrade-header">
          <view class="upgrade-icon">{{ config.icon }}</view>
          <view class="upgrade-info">
            <view class="upgrade-name">{{ config.name }}</view>
            <view class="upgrade-desc">{{ config.description }}</view>
          </view>
        </view>

        <!-- 当前等级 -->
        <view class="upgrade-level">
          <view class="level-bar">
            <view 
              v-for="i in 10" 
              :key="i" 
              class="level-dot"
              :class="{ active: i <= playerData.permanentUpgrades[attr] }"
            ></view>
          </view>
          <view class="level-text">
            等级 {{ playerData.permanentUpgrades[attr] }} / 10
          </view>
        </view>

        <!-- 当前加成 -->
        <view class="current-bonus">
          当前加成: +{{ getTotalBonus(attr) }}
        </view>

        <!-- 升级按钮 -->
        <view v-if="getNextLevel(attr)" class="upgrade-action">
          <view class="next-level-info">
            <text>下一级: {{ getNextLevel(attr).desc }}</text>
          </view>
          <view 
            class="pixel-btn pixel-btn-success"
            :class="{ 'pixel-btn-disabled': !canUpgrade(attr) }"
            @click="doUpgrade(attr)"
          >
            <text v-if="canUpgrade(attr)">
              升级 ({{ getNextLevel(attr).cost }} 💎)
            </text>
            <text v-else>
              晶核不足 ({{ getNextLevel(attr).cost }} 💎)
            </text>
          </view>
        </view>
        <view v-else class="max-level">
          ⭐ 已满级 ⭐
        </view>
      </view>
    </view>

    <!-- 返回按钮 -->
    <view class="pixel-btn mt-40 mb-40" @click="goBack">
      ← 返回
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { loadPlayerData, purchaseUpgrade, savePlayerData } from '@/utils/storage'
import { permanentUpgrades, calculatePermanentBonus } from '@/data/upgrades'

// 状态数据
const playerData = ref({
  crystals: 0,
  permanentUpgrades: {
    vision: 0,
    luck: 0,
    stamina: 0
  }
})
const upgradeConfigs = permanentUpgrades

// 方法
const loadData = () => {
  playerData.value = loadPlayerData()
}

const getTotalBonus = (attr) => {
  const level = playerData.value.permanentUpgrades[attr]
  const config = upgradeConfigs[attr]
  let total = 0
  
  for (let i = 0; i < level; i++) {
    if (config.levels[i]) {
      total += config.levels[i].bonus
    }
  }
  
  return total
}

const getNextLevel = (attr) => {
  const currentLevel = playerData.value.permanentUpgrades[attr]
  const config = upgradeConfigs[attr]
  
  if (currentLevel >= config.levels.length) {
    return null
  }
  
  return config.levels[currentLevel]
}

const canUpgrade = (attr) => {
  const nextLevel = getNextLevel(attr)
  if (!nextLevel) return false
  
  return playerData.value.crystals >= nextLevel.cost
}

const doUpgrade = (attr) => {
  if (!canUpgrade(attr)) {
    uni.showToast({
      title: '晶核不足',
      icon: 'none'
    })
    return
  }
  
  const nextLevel = getNextLevel(attr)
  const result = purchaseUpgrade(attr, nextLevel.cost)
  
  if (result.success) {
    playerData.value = result.data
    
    // 显示升级成功动画
    uni.showToast({
      title: `${upgradeConfigs[attr].name}升级成功！`,
      icon: 'success'
    })
    
    // 震动反馈
    uni.vibrateShort()
  } else {
    uni.showToast({
      title: result.message,
      icon: 'none'
    })
  }
}

const goBack = () => {
  uni.navigateBack()
}

// 生命周期
onLoad(() => {
  loadData()
})
</script>

<style scoped>
.upgrade-page {
  min-height: 100vh;
  padding: 40rpx;
  background: #F4E4C1;
}

.crystals-balance {
  text-align: center;
  padding: 40rpx;
  background: #3E2723;
  color: #F4E4C1;
  border: 6px solid #3E2723;
  margin-bottom: 40rpx;
  box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.2);
}

.crystal-icon {
  font-size: 64rpx;
}

.crystal-amount {
  display: block;
  font-size: 72rpx;
  font-weight: bold;
  margin: 20rpx 0;
}

.crystal-label {
  font-size: 32rpx;
  opacity: 0.8;
}

.upgrade-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.upgrade-card {
  padding: 40rpx;
}

.upgrade-header {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.upgrade-icon {
  font-size: 64rpx;
}

.upgrade-info {
  flex: 1;
}

.upgrade-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #3E2723;
  margin-bottom: 10rpx;
}

.upgrade-desc {
  font-size: 26rpx;
  color: #5D4037;
  line-height: 1.5;
}

.upgrade-level {
  margin: 30rpx 0;
}

.level-bar {
  display: flex;
  gap: 10rpx;
  margin-bottom: 15rpx;
}

.level-dot {
  flex: 1;
  height: 20rpx;
  background: #D7CCC8;
  border: 2px solid #3E2723;
}

.level-dot.active {
  background: #6D4C41;
}

.level-text {
  font-size: 28rpx;
  text-align: center;
  font-weight: bold;
}

.current-bonus {
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
  color: #558B2F;
  padding: 20rpx;
  background: rgba(85, 139, 47, 0.1);
  border: 2px solid #558B2F;
  margin: 20rpx 0;
}

.upgrade-action {
  margin-top: 30rpx;
}

.next-level-info {
  font-size: 26rpx;
  text-align: center;
  margin-bottom: 15rpx;
  color: #5D4037;
}

.max-level {
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
  color: #FFA726;
  padding: 30rpx;
  margin-top: 20rpx;
}
</style>

