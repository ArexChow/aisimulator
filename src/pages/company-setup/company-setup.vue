<template>
  <view class="setup-page">
    <!-- 标题 -->
    <view class="crt-screen header-screen">
      <view class="terminal-text">
        <text class="blink">█</text>
        <text> 创建公司 </text>
        <text class="blink">█</text>
      </view>
      <view class="terminal-subtitle">
        {{ currentYear }}年，互联网浪潮来袭
      </view>
    </view>

    <!-- 公司名称 -->
    <view class="pixel-card mt-40">
      <view class="pixel-subtitle text-center">公司名称</view>
      <view class="company-name-input">
        <input
          v-model="companyName"
          type="text"
          placeholder="请输入公司名称"
          maxlength="20"
          class="pixel-input"
        />
        <view class="pixel-btn pixel-btn-small" @click="randomCompanyName">
          随机
        </view>
      </view>
      <view class="hint-text">
        提示：选择一个响亮的名字，开启你的创业之旅！
      </view>
    </view>

    <!-- 初始资金 -->
    <view class="pixel-card mt-30">
      <view class="pixel-subtitle text-center">初始资源</view>
      <view class="resource-item">
        <view class="resource-icon">💰</view>
        <view class="resource-info">
          <view class="resource-name">启动资金</view>
          <view class="resource-value">80,000 元</view>
        </view>
      </view>
      <view class="resource-item">
        <view class="resource-icon">👥</view>
        <view class="resource-info">
          <view class="resource-name">初始员工</view>
          <view class="resource-value">1 人（{{ initialEmployee.name }}）</view>
        </view>
      </view>
    </view>

    <!-- 初始员工信息 -->
    <view class="pixel-card mt-30">
      <view class="pixel-subtitle text-center">初始员工资料</view>
      <view class="employee-profile">
        <view class="employee-header">
          <view class="employee-name">{{ initialEmployee.name }}</view>
          <view class="employee-tag">{{ initialEmployee.personality.name }}</view>
        </view>
        
        <view class="ability-item">
          <view class="ability-label">💻 编程</view>
          <view class="ability-bar">
            <view class="pixel-progress">
              <view class="pixel-progress-bar" :style="{width: initialEmployee.programming + '%'}"></view>
            </view>
            <text class="ability-value">{{ initialEmployee.programming }}</text>
          </view>
        </view>
        
        <view class="ability-item">
          <view class="ability-label">🎨 美术</view>
          <view class="ability-bar">
            <view class="pixel-progress">
              <view class="pixel-progress-bar" :style="{width: initialEmployee.art + '%'}"></view>
            </view>
            <text class="ability-value">{{ initialEmployee.art }}</text>
          </view>
        </view>
        
        <view class="ability-item">
          <view class="ability-label">💼 商业</view>
          <view class="ability-bar">
            <view class="pixel-progress">
              <view class="pixel-progress-bar" :style="{width: initialEmployee.business + '%'}"></view>
            </view>
            <text class="ability-value">{{ initialEmployee.business }}</text>
          </view>
        </view>
        
        <view class="salary-info">
          月薪：¥{{ initialEmployee.salary }}
        </view>
      </view>
    </view>

    <!-- 开始按钮 -->
    <view class="button-group mt-40">
      <view 
        class="pixel-btn pixel-btn-success" 
        :class="{ 'pixel-btn-disabled': !companyName.trim() }"
        @click="startCompany"
      >
        开始创业 ▶
      </view>
      <view class="pixel-btn mt-20" @click="goBack">
        返回
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { createInitialEmployee } from '@/data/employees'
import { createNewGame, addEmployee, saveGameState } from '@/utils/storage'

// 状态数据
const currentYear = ref(2000)
const companyName = ref('')
const initialEmployee = ref(null)

// 公司名称模板
const COMPANY_NAME_TEMPLATES = [
  '腾飞科技', '创新软件', '智慧互联', '未来网络', '极客工作室',
  '蓝海科技', '启明星软件', '梦想家', '数字时代', '云端科技',
  '星辰工作室', '光速软件', '天际科技', '魔方工作室', '赛博科技',
  '像素实验室', '字节科技', '代码之光', '零壹科技', '量子工作室'
]

// 方法
const initData = () => {
  // 生成初始员工
  initialEmployee.value = createInitialEmployee()
}

const randomCompanyName = () => {
  const randomIndex = Math.floor(Math.random() * COMPANY_NAME_TEMPLATES.length)
  companyName.value = COMPANY_NAME_TEMPLATES[randomIndex]
}

const startCompany = () => {
  if (!companyName.value.trim()) {
    uni.showToast({
      title: '请输入公司名称',
      icon: 'none'
    })
    return
  }
  
  // 创建新游戏状态
  const gameState = createNewGame(companyName.value)
  
  // 添加初始员工
  gameState.employees = [initialEmployee.value]
  gameState.statistics.employeesHired = 1
  
  // 保存游戏状态
  saveGameState(gameState)
  
  // 跳转到主面板
  uni.redirectTo({
    url: '/pages/dashboard/dashboard'
  })
}

const goBack = () => {
  uni.navigateBack()
}

// 生命周期
onLoad(() => {
  initData()
})
</script>

<style scoped>
.setup-page {
  min-height: 100vh;
  padding: 40rpx;
  background: #F4E4C1;
  padding-bottom: 80rpx;
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
  font-size: 26rpx;
  text-align: center;
  margin-top: 20rpx;
  opacity: 0.8;
}

.company-name-input {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-top: 20rpx;
}

.pixel-input {
  flex: 1;
  padding: 20rpx;
  background: #FFF;
  border: 4px solid #3E2723;
  font-size: 28rpx;
  font-family: 'Courier New', Courier, monospace;
}

.pixel-btn-small {
  padding: 20rpx 30rpx;
}

.hint-text {
  font-size: 24rpx;
  color: #8D6E63;
  margin-top: 15rpx;
  text-align: center;
}

.resource-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  margin: 15rpx 0;
  background: rgba(109, 76, 65, 0.1);
  border: 2px solid #6D4C41;
}

.resource-icon {
  font-size: 48rpx;
  margin-right: 20rpx;
}

.resource-info {
  flex: 1;
}

.resource-name {
  font-size: 26rpx;
  color: #5D4037;
  margin-bottom: 5rpx;
}

.resource-value {
  font-size: 32rpx;
  font-weight: bold;
  color: #3E2723;
}

.employee-profile {
  margin-top: 20rpx;
}

.employee-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.employee-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #3E2723;
}

.employee-tag {
  padding: 8rpx 16rpx;
  background: #558B2F;
  color: #FFF;
  border: 3px solid #33691E;
  font-size: 22rpx;
  font-weight: bold;
}

.ability-item {
  margin: 20rpx 0;
}

.ability-label {
  font-size: 26rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.ability-bar {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.ability-bar .pixel-progress {
  flex: 1;
}

.ability-value {
  font-size: 24rpx;
  font-weight: bold;
  min-width: 80rpx;
  text-align: right;
}

.salary-info {
  margin-top: 30rpx;
  padding: 15rpx;
  background: rgba(255, 193, 7, 0.2);
  border: 2px solid #FFC107;
  text-align: center;
  font-size: 28rpx;
  font-weight: bold;
  color: #F57C00;
}

.button-group {
  display: flex;
  flex-direction: column;
}
</style>

