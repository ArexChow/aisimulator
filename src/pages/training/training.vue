<template>
  <view class="training-page">
    <view class="pixel-subtitle text-center">员工培训</view>
    
    <view class="hint-text mt-30">
      培训可以提升员工的能力，每次培训提升5-10点能力值
    </view>

    <!-- 选择员工 -->
    <view class="pixel-card mt-40">
      <view class="section-title">选择员工</view>
      <scroll-view scroll-y class="employees-list">
        <view 
          v-for="employee in gameState.employees" 
          :key="employee.id"
          class="employee-item"
          :class="{ 'item-selected': selectedEmployee?.id === employee.id }"
          @click="selectEmployee(employee)"
        >
          <view class="employee-name">{{ employee.name }}</view>
          <view class="employee-abilities">
            💻{{ employee.programming }} 🎨{{ employee.art }} 💼{{ employee.business }}
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 选择培训类型 -->
    <view class="pixel-card mt-30" v-if="selectedEmployee">
      <view class="section-title">选择培训类型</view>
      <view class="training-types">
        <view 
          v-for="type in trainingTypes" 
          :key="type.id"
          class="training-type-item"
          :class="{ 'item-selected': selectedType === type.id }"
          @click="selectType(type.id)"
        >
          <view class="type-header">
            <view class="type-name">{{ type.name }}</view>
            <view class="type-cost">¥{{ type.cost }}</view>
          </view>
          <view class="type-desc">{{ type.description }}</view>
        </view>
      </view>
    </view>

    <!-- 按钮 -->
    <view class="button-group mt-40">
      <view 
        class="pixel-btn pixel-btn-success"
        :class="{ 'pixel-btn-disabled': !canTrain }"
        @click="confirmTraining"
      >
        开始培训 ▶
      </view>
      <view class="pixel-btn mt-20" @click="goBack">
        返回
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { loadGameState, saveGameState, addNews } from '@/utils/storage'
import { trainEmployee } from '@/utils/employeeManager'

// 状态数据
const gameState = ref(null)
const selectedEmployee = ref(null)
const selectedType = ref(null)

const trainingTypes = [
  { id: 'programming', name: '编程培训', description: '提升编程能力 +5-10', cost: 10000 },
  { id: 'art', name: '美术培训', description: '提升美术能力 +5-10', cost: 10000 },
  { id: 'business', name: '商业培训', description: '提升商业能力 +5-10', cost: 10000 },
  { id: 'all', name: '全面培训', description: '提升所有能力 +3-5', cost: 25000 }
]

// 计算属性
const canTrain = computed(() => {
  if (!selectedEmployee.value || !selectedType.value || !gameState.value) return false
  const type = trainingTypes.find(t => t.id === selectedType.value)
  return gameState.value.money >= type.cost
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
  }
}

const selectEmployee = (employee) => {
  selectedEmployee.value = employee
}

const selectType = (typeId) => {
  selectedType.value = typeId
}

const confirmTraining = () => {
  if (!canTrain.value) {
    uni.showToast({
      title: '资金不足或未选择',
      icon: 'none'
    })
    return
  }
  
  const type = trainingTypes.find(t => t.id === selectedType.value)
  
  // 扣除费用
  gameState.value.money -= type.cost
  
  // 培训员工
  const employee = gameState.value.employees.find(e => e.id === selectedEmployee.value.id)
  trainEmployee(employee, selectedType.value)
  
  // 添加新闻
  addNews(gameState.value, {
    content: `${employee.name}完成了${type.name}，能力得到提升`
  })
  
  // 保存游戏状态
  saveGameState(gameState.value)
  
  // 提示并返回
  uni.showToast({
    title: '培训完成！',
    icon: 'success'
  })
  
  setTimeout(() => {
    uni.navigateBack()
  }, 1000)
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
.training-page {
  min-height: 100vh;
  padding: 40rpx;
  background: #F4E4C1;
  padding-bottom: 80rpx;
}

.hint-text {
  font-size: 26rpx;
  color: #8D6E63;
  text-align: center;
  line-height: 1.8;
}

.section-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #3E2723;
  margin-bottom: 20rpx;
}

.employees-list {
  height: 400rpx;
}

.employee-item {
  padding: 25rpx;
  margin-bottom: 15rpx;
  background: #FFF;
  border: 3px solid #3E2723;
  cursor: pointer;
}

.item-selected {
  background: #FFE082 !important;
  border-color: #FFC107 !important;
  border-width: 4px !important;
}

.employee-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #3E2723;
  margin-bottom: 10rpx;
}

.employee-abilities {
  font-size: 24rpx;
  color: #5D4037;
}

.training-types {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.training-type-item {
  padding: 25rpx;
  background: #FFF;
  border: 3px solid #3E2723;
  cursor: pointer;
}

.type-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.type-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #3E2723;
}

.type-cost {
  padding: 8rpx 16rpx;
  background: #FFC107;
  color: #3E2723;
  border: 2px solid #FFA000;
  font-size: 22rpx;
  font-weight: bold;
}

.type-desc {
  font-size: 24rpx;
  color: #5D4037;
}

.button-group {
  display: flex;
  flex-direction: column;
}
</style>

