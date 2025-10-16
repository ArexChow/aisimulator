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
        <br/>Tips：
        <br/>• 招聘优秀员工组建团队
        <br/>• 开发各类互联网产品
        <br/>• 管理资金和运营
        <br/>• 打造世界级伟大公司！
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
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { hasSavedGame as checkSavedGame } from '@/utils/storage'

// 状态数据
const hasSavedGame = ref(false)

// 方法
const loadData = () => {
  hasSavedGame.value = checkSavedGame()
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

.button-group {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding-bottom: 40rpx;
}
</style>

