<template>
  <view class="recruit-page">
    <!-- 当前资金 -->
    <view class="money-display-top">
      <text class="money-label">当前资金：</text>
      <text class="money-value">¥{{ formatMoney(gameState.money) }}</text>
    </view>

    <!-- 步骤1: 选择招聘渠道 -->
    <view v-if="currentStep === 0" class="step-content">
      <view class="pixel-subtitle text-center">选择招聘渠道</view>
      
      <view class="channels-list">
        <view 
          v-for="channel in channels" 
          :key="channel.id"
          class="channel-card pixel-card"
          :class="{ 'channel-selected': selectedChannel === channel.id }"
          @click="selectChannel(channel.id)"
        >
          <view class="channel-header">
            <view class="channel-name">{{ channel.name }}</view>
            <view class="channel-cost" v-if="channel.cost > 0">
              ¥{{ channel.cost }}
            </view>
            <view class="channel-cost channel-free" v-else>
              免费
            </view>
          </view>
          <view class="channel-desc">{{ channel.description }}</view>
          <view class="channel-range">
            能力范围：{{ channel.abilityRange.min }}-{{ channel.abilityRange.max }}
          </view>
        </view>
      </view>
      
      <view class="button-group mt-40">
        <view 
          class="pixel-btn pixel-btn-success"
          :class="{ 'pixel-btn-disabled': !selectedChannel }"
          @click="generateCandidates"
        >
          查看候选人 →
        </view>
        <view class="pixel-btn mt-20" @click="goBack">
          返回
        </view>
      </view>
    </view>

    <!-- 步骤2: 选择候选人 -->
    <view v-if="currentStep === 1" class="step-content">
      <view class="pixel-subtitle text-center">选择候选人</view>
      
      <view class="candidates-list">
        <view 
          v-for="(candidate, index) in candidates" 
          :key="index"
          class="candidate-card pixel-card"
          :class="{ 'candidate-selected': selectedCandidate === index }"
          @click="selectCandidate(index)"
        >
          <view class="candidate-header">
            <view class="candidate-name">{{ candidate.name }}</view>
            <view class="personality-badge">{{ candidate.personality.name }}</view>
          </view>
          
          <view class="candidate-personality-desc">
            {{ candidate.personality.description }}
          </view>
          
          <view class="candidate-abilities">
            <view class="ability-item">
              <view class="ability-label">💻 编程</view>
              <view class="ability-bar">
                <view class="pixel-progress">
                  <view class="pixel-progress-bar" :style="{width: candidate.programming + '%'}"></view>
                </view>
                <text class="ability-value">{{ candidate.programming }}</text>
              </view>
            </view>
            
            <view class="ability-item">
              <view class="ability-label">🎨 美术</view>
              <view class="ability-bar">
                <view class="pixel-progress">
                  <view class="pixel-progress-bar" :style="{width: candidate.art + '%'}"></view>
                </view>
                <text class="ability-value">{{ candidate.art }}</text>
              </view>
            </view>
            
            <view class="ability-item">
              <view class="ability-label">💼 商业</view>
              <view class="ability-bar">
                <view class="pixel-progress">
                  <view class="pixel-progress-bar" :style="{width: candidate.business + '%'}"></view>
                </view>
                <text class="ability-value">{{ candidate.business }}</text>
              </view>
            </view>
          </view>
          
          <view class="candidate-footer">
            <view class="candidate-salary">月薪: ¥{{ candidate.salary }}</view>
            <view class="candidate-stamina">体力: {{ candidate.stamina }}</view>
          </view>
          
          <!-- 背景故事 -->
          <view class="candidate-story-section">
            <view 
              class="story-toggle"
              @click="toggleStory(index)"
            >
              📖 {{ expandedStory === index ? '收起' : '背景故事' }}
            </view>
            <view v-if="expandedStory === index" class="story-content">
              <view v-if="candidateStories[index]" class="story-text">
                {{ candidateStories[index] }}
              </view>
              <view v-else class="story-loading">生成中...</view>
            </view>
          </view>
        </view>
      </view>
      
      <view class="button-group mt-30">
        <view class="pixel-btn pixel-btn-primary" @click="refreshCandidates">
          🔄 重新刷新 (¥{{ channels.find(c => c.id === selectedChannel).cost }})
        </view>
        <view 
          class="pixel-btn pixel-btn-success mt-20"
          :class="{ 'pixel-btn-disabled': selectedCandidate === null }"
          @click="goToConfirm"
        >
          确认雇佣 →
        </view>
        <view class="pixel-btn mt-20" @click="prevStep">
          返回
        </view>
      </view>
    </view>

    <!-- 步骤3: 确认雇佣 -->
    <view v-if="currentStep === 2" class="step-content">
      <view class="pixel-subtitle text-center">确认雇佣</view>
      
      <view class="confirm-card pixel-card" v-if="candidates[selectedCandidate]">
        <view class="confirm-employee-info">
          <view class="employee-large-name">{{ candidates[selectedCandidate].name }}</view>
          <view class="personality-tag-large">{{ candidates[selectedCandidate].personality.name }}</view>
          
          <view class="abilities-summary">
            <view class="ability-summary-item">
              <text class="ability-icon">💻</text>
              <text class="ability-number">{{ candidates[selectedCandidate].programming }}</text>
            </view>
            <view class="ability-summary-item">
              <text class="ability-icon">🎨</text>
              <text class="ability-number">{{ candidates[selectedCandidate].art }}</text>
            </view>
            <view class="ability-summary-item">
              <text class="ability-icon">💼</text>
              <text class="ability-number">{{ candidates[selectedCandidate].business }}</text>
            </view>
          </view>
          
          <view class="cost-breakdown">
            <view class="cost-item">
              <text class="cost-label">招聘费用：</text>
              <text class="cost-value">¥{{ channels.find(c => c.id === selectedChannel).cost }}</text>
            </view>
            <view class="cost-item">
              <text class="cost-label">月薪：</text>
              <text class="cost-value">¥{{ candidates[selectedCandidate].salary }}</text>
            </view>
            <view class="cost-item total">
              <text class="cost-label">本次支出：</text>
              <text class="cost-value">¥{{ channels.find(c => c.id === selectedChannel).cost }}</text>
            </view>
          </view>
        </view>
        
        <!-- 自定义姓名 -->
        <view class="name-input-section">
          <view class="name-input-label">自定义姓名（可选）</view>
          <view class="name-input-row">
            <input 
              v-model="customName"
              type="text"
              placeholder="留空使用默认姓名"
              maxlength="10"
              class="pixel-input"
            />
            <view class="pixel-btn-small" @click="randomName">
              随机
            </view>
          </view>
        </view>
      </view>
      
      <view class="button-group mt-40">
        <view 
          class="pixel-btn pixel-btn-success"
          :class="{ 'pixel-btn-disabled': !canHire }"
          @click="confirmHire"
        >
          确认雇佣 ✓
        </view>
        <view class="pixel-btn mt-20" @click="prevStep">
          返回
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { loadGameState, saveGameState, addEmployee, addNews } from '@/utils/storage'
import { RECRUITMENT_CHANNELS, generateCandidates as genCandidates, generateRandomName } from '@/data/employees'
import { formatMoney } from '@/utils/financeManager'
import { aiContentFactory } from '@/utils/aiContentFactory'

// 状态数据
const gameState = ref(null)
const currentStep = ref(0)
const selectedChannel = ref(null)
const candidates = ref([])
const selectedCandidate = ref(null)
const customName = ref('')
// AI背景故事状态
const expandedStory = ref(null)
const candidateStories = ref({})

// 招聘渠道
const channels = ref([])

// 计算属性
const canHire = computed(() => {
  if (!gameState.value || selectedCandidate.value === null) return false
  const channel = channels.value.find(c => c.id === selectedChannel.value)
  return gameState.value.money >= channel.cost
})

// 方法
const initData = () => {
  gameState.value = loadGameState()
  if (!gameState.value) {
    uni.showToast({
      title: '未找到游戏存档',
      icon: 'none'
    })
    setTimeout(() => {
      uni.reLaunch({ url: '/pages/home/home' })
    }, 1500)
    return
  }
  
  // 加载招聘渠道
  channels.value = Object.values(RECRUITMENT_CHANNELS)
}

const selectChannel = (channelId) => {
  selectedChannel.value = channelId
}

const generateCandidates = () => {
  if (!selectedChannel.value) {
    uni.showToast({
      title: '请选择招聘渠道',
      icon: 'none'
    })
    return
  }
  
  const channel = channels.value.find(c => c.id === selectedChannel.value)
  
  // 检查资金
  if (gameState.value.money < channel.cost) {
    uni.showToast({
      title: '资金不足',
      icon: 'none'
    })
    return
  }
  
  // 生成候选人
  candidates.value = genCandidates(selectedChannel.value, 3)
  currentStep.value = 1
}

const refreshCandidates = () => {
  const channel = channels.value.find(c => c.id === selectedChannel.value)
  
  if (gameState.value.money < channel.cost) {
    uni.showToast({
      title: '资金不足',
      icon: 'none'
    })
    return
  }
  
  // 重新生成
  candidates.value = genCandidates(selectedChannel.value, 3)
  selectedCandidate.value = null
  
  uni.showToast({
    title: '已刷新候选人',
    icon: 'success'
  })
}

const selectCandidate = (index) => {
  selectedCandidate.value = index
}

// 切换员工背景故事
const toggleStory = async (index) => {
  if (expandedStory.value === index) {
    // 切换关闭
    expandedStory.value = null
    return
  }
  
  expandedStory.value = index
  
  // 检查是否已缓存故事
  if (!candidateStories.value[index]) {
    try {
      const candidate = candidates.value[index]
      const story = await aiContentFactory.generateEmployeeStory({
        name: candidate.name,
        personality: candidate.personality.name,
        programming: candidate.programming,
        art: candidate.art,
        business: candidate.business,
        salary: candidate.salary,
        channel: selectedChannel.value,
        year: gameState.value.currentYear,
        era: '移动互联网时代'
      })
      
      candidateStories.value[index] = story
    } catch (error) {
      console.error('生成背景故事失败:', error)
      candidateStories.value[index] = '背景故事生成失败，请重试'
    }
  }
}

const goToConfirm = () => {
  if (selectedCandidate.value === null) {
    uni.showToast({
      title: '请选择候选人',
      icon: 'none'
    })
    return
  }
  
  currentStep.value = 2
}

const randomName = () => {
  customName.value = generateRandomName()
}

const confirmHire = () => {
  if (!canHire.value) {
    uni.showToast({
      title: '资金不足',
      icon: 'none'
    })
    return
  }
  
  const channel = channels.value.find(c => c.id === selectedChannel.value)
  const candidate = { ...candidates.value[selectedCandidate.value] }
  
  // 应用自定义姓名
  if (customName.value.trim()) {
    candidate.name = customName.value.trim()
  }
  
  // 生成唯一ID
  candidate.id = 'emp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  
  // 扣除招聘费用
  gameState.value.money -= channel.cost
  
  // 添加员工
  addEmployee(gameState.value, candidate)
  
  // 添加新闻
  addNews(gameState.value, {
    content: `🎉 ${candidate.name}加入了公司，月薪¥${candidate.salary}`
  })
  
  // 保存游戏状态
  saveGameState(gameState.value)
  
  // 提示并返回
  uni.showToast({
    title: '雇佣成功！',
    icon: 'success'
  })
  
  setTimeout(() => {
    uni.navigateBack()
  }, 1000)
}

const prevStep = () => {
  currentStep.value--
  if (currentStep.value === 1) {
    selectedCandidate.value = null
  }
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
.recruit-page {
  min-height: 100vh;
  padding: 40rpx;
  background: #F4E4C1;
  padding-bottom: 80rpx;
}

.money-display-top {
  text-align: center;
  padding: 20rpx;
  background: #558B2F;
  color: #FFF;
  border: 4px solid #33691E;
  margin-bottom: 40rpx;
  font-weight: bold;
}

.money-label {
  font-size: 24rpx;
}

.money-value {
  font-size: 36rpx;
  margin-left: 10rpx;
}

.step-content {
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.channels-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-top: 30rpx;
}

.channel-card {
  padding: 30rpx;
  cursor: pointer;
}

.channel-selected {
  background: #FFE082 !important;
  box-shadow: 0 0 0 4px #FFC107;
}

.channel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
}

.channel-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #3E2723;
}

.channel-cost {
  padding: 8rpx 16rpx;
  background: #FFC107;
  color: #3E2723;
  border: 3px solid #FFA000;
  font-size: 24rpx;
  font-weight: bold;
}

.channel-free {
  background: #558B2F;
  color: #FFF;
  border-color: #33691E;
}

.channel-desc {
  font-size: 26rpx;
  color: #5D4037;
  line-height: 1.6;
  margin-bottom: 10rpx;
}

.channel-range {
  font-size: 24rpx;
  color: #8D6E63;
}

.candidates-list {
  display: flex;
  flex-direction: column;
  gap: 25rpx;
  margin-top: 30rpx;
}

.candidate-card {
  padding: 30rpx;
  cursor: pointer;
}

.candidate-selected {
  background: #FFE082 !important;
  box-shadow: 0 0 0 4px #FFC107;
}

.candidate-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
}

.candidate-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #3E2723;
}

.personality-badge {
  padding: 8rpx 16rpx;
  background: #558B2F;
  color: #FFF;
  border: 3px solid #33691E;
  font-size: 22rpx;
  font-weight: bold;
}

.candidate-personality-desc {
  font-size: 22rpx;
  color: #8D6E63;
  margin-bottom: 20rpx;
}

.candidate-abilities {
  margin: 20rpx 0;
}

.ability-item {
  margin: 15rpx 0;
}

.ability-label {
  font-size: 24rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
  display: block;
}

.ability-bar {
  display: flex;
  align-items: center;
  gap: 15rpx;
}

.ability-bar .pixel-progress {
  flex: 1;
}

.ability-value {
  font-size: 24rpx;
  font-weight: bold;
  min-width: 60rpx;
  text-align: right;
}

.candidate-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 20rpx;
  padding-top: 15rpx;
  border-top: 2px solid #D7CCC8;
}

.candidate-salary,
.candidate-stamina {
  font-size: 26rpx;
  font-weight: bold;
  color: #3E2723;
}

.candidate-story-section {
  margin-top: 20rpx;
  padding-top: 15rpx;
  border-top: 2px solid #D7CCC8;
}

.story-toggle {
  font-size: 24rpx;
  color: #5D4037;
  cursor: pointer;
  text-align: center;
  margin-bottom: 15rpx;
}

.story-content {
  font-size: 22rpx;
  color: #8D6E63;
  line-height: 1.6;
}

.story-text {
  margin-top: 10rpx;
}

.story-loading {
  text-align: center;
  color: #8D6E63;
}

.confirm-card {
  padding: 40rpx;
}

.employee-large-name {
  font-size: 48rpx;
  font-weight: bold;
  color: #3E2723;
  text-align: center;
  margin-bottom: 15rpx;
}

.personality-tag-large {
  text-align: center;
  padding: 12rpx 24rpx;
  background: #558B2F;
  color: #FFF;
  border: 3px solid #33691E;
  font-size: 26rpx;
  font-weight: bold;
  display: inline-block;
  margin: 0 auto 30rpx;
}

.abilities-summary {
  display: flex;
  justify-content: center;
  gap: 40rpx;
  margin: 30rpx 0;
}

.ability-summary-item {
  text-align: center;
}

.ability-icon {
  font-size: 48rpx;
  display: block;
  margin-bottom: 10rpx;
}

.ability-number {
  font-size: 36rpx;
  font-weight: bold;
  color: #3E2723;
}

.cost-breakdown {
  margin: 30rpx 0;
  padding: 25rpx;
  background: rgba(255, 193, 7, 0.1);
  border: 3px solid #FFC107;
}

.cost-item {
  display: flex;
  justify-content: space-between;
  margin: 15rpx 0;
  font-size: 26rpx;
}

.cost-item.total {
  margin-top: 20rpx;
  padding-top: 15rpx;
  border-top: 3px solid #FFC107;
  font-weight: bold;
  font-size: 32rpx;
}

.cost-label {
  color: #5D4037;
}

.cost-value {
  color: #F57C00;
  font-weight: bold;
}

.name-input-section {
  margin-top: 30rpx;
}

.name-input-label {
  font-size: 26rpx;
  font-weight: bold;
  color: #3E2723;
  margin-bottom: 15rpx;
}

.name-input-row {
  display: flex;
  align-items: center;
  gap: 15rpx;
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
  background: #6D4C41;
  color: #F4E4C1;
  border: 3px solid #3E2723;
  font-size: 24rpx;
  font-weight: bold;
}

.button-group {
  display: flex;
  flex-direction: column;
}
</style>

