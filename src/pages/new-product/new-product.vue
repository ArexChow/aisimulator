<template>
  <view class="new-product-page">
    <!-- 步骤指示器 -->
    <view class="step-indicator">
      <view 
        v-for="(step, index) in steps" 
        :key="index"
        class="step-item"
        :class="{ 'step-active': currentStep === index, 'step-completed': currentStep > index }"
      >
        <view class="step-number">{{ index + 1 }}</view>
        <view class="step-label">{{ step }}</view>
      </view>
    </view>

    <!-- 步骤1: 选择产品分类 -->
    <view v-if="currentStep === 0" class="step-content">
      <view class="pixel-subtitle text-center">选择产品类型</view>
      <view class="categories-grid">
        <view 
          v-for="category in availableCategories" 
          :key="category.id"
          class="category-card pixel-card"
          :class="{ 'category-selected': selectedCategory === category.id }"
          @click="selectCategory(category.id)"
        >
          <view class="category-icon">{{ category.icon }}</view>
          <view class="category-name">{{ category.name }}</view>
        </view>
      </view>
      
      <view class="button-group mt-40">
        <view 
          class="pixel-btn pixel-btn-success"
          :class="{ 'pixel-btn-disabled': !selectedCategory }"
          @click="nextStep"
        >
          下一步 →
        </view>
        <view class="pixel-btn mt-20" @click="goBack">
          返回
        </view>
      </view>
    </view>

    <!-- 步骤2: 选择具体产品 -->
    <view v-if="currentStep === 1" class="step-content">
      <view class="pixel-subtitle text-center">选择产品</view>
      
      <!-- AI创意生成按钮 -->
      <view class="ai-ideas-section mb-20">
        <view 
          class="pixel-btn pixel-btn-info"
          @click="getProductIdeas"
          :class="{ 'pixel-btn-disabled': generatingIdeas }"
        >
          {{ generatingIdeas ? '生成中...' : '💡 获取创意' }}
        </view>
        
        <!-- 流式生成的JSON文本展示 -->
        <view v-if="streamingIdeasText" class="streaming-text-container mt-20">
          <view class="pixel-subtitle text-center">正在生成创意...</view>
          <view class="streaming-text pixel-card">{{ streamingIdeasText }}</view>
        </view>
        
        <!-- 显示AI生成的创意 -->
        <view v-if="productIdeas.length > 0" class="ideas-container mt-20">
          <view class="pixel-subtitle text-center">AI生成的创意</view>
          <scroll-view scroll-y class="ideas-list">
            <view 
              v-for="(idea, index) in productIdeas"
              :key="index"
              class="idea-card pixel-card"
              @click="useProductIdea(idea)"
            >
              <view class="idea-name">{{ idea.name }}</view>
              <view class="idea-slogan">{{ idea.slogan }}</view>
              <view class="idea-desc">{{ idea.description }}</view>
              <view class="idea-highlights">
                <view 
                  v-for="(highlight, hIdx) in idea.highlights"
                  :key="hIdx"
                  class="highlight-tag"
                >
                  #{{ highlight }}
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>

      <view class="pixel-divider my-20"></view>
      
      <view class="pixel-subtitle text-center">或选择预设产品</view>
      <scroll-view scroll-y class="products-list">
        <view 
          v-for="product in productsInCategory" 
          :key="product.id"
          class="product-item pixel-card"
          :class="{ 'product-selected': selectedProduct === product.id }"
          @click="selectProduct(product)"
        >
          <view class="product-item-header">
            <view class="product-item-name">{{ product.name }}</view>
            <view class="pixel-badge" :class="'badge-' + product.grade.toLowerCase()">
              {{ product.grade }}级
            </view>
          </view>
          <view class="product-item-desc">{{ product.description }}</view>
          <view class="product-item-meta">
            <text>最少{{ product.minEmployees }}人 | 推荐{{ product.recommendedEmployees }}人</text>
          </view>
        </view>
      </scroll-view>
      
      <view class="button-group mt-20">
        <view 
          class="pixel-btn pixel-btn-success"
          :class="{ 'pixel-btn-disabled': !selectedProduct }"
          @click="nextStep"
        >
          下一步 →
        </view>
        <view class="pixel-btn mt-20" @click="prevStep">
          上一步
        </view>
      </view>
    </view>

    <!-- 步骤3: 产品配置 -->
    <view v-if="currentStep === 2" class="step-content">
      <view class="pixel-subtitle text-center">产品配置</view>
      
      <!-- 产品名称 -->
      <view class="config-section">
        <view class="config-label">产品名称</view>
        <input 
          v-model="productName"
          type="text"
          placeholder="请输入产品名称"
          maxlength="20"
          class="pixel-input"
        />
      </view>
      
      <!-- 变现方式 -->
      <view class="config-section">
        <view class="config-label">变现方式</view>
        <view class="monetization-options">
          <view 
            v-for="method in availableMonetizations" 
            :key="method.id"
            class="monetization-option"
            :class="{ 'option-selected': selectedMonetization === method.id }"
            @click="selectMonetization(method.id)"
          >
            <view class="option-name">{{ method.name }}</view>
            <view class="option-desc">{{ method.description }}</view>
          </view>
        </view>
      </view>
      
      <!-- 开发方案 -->
      <view class="config-section">
        <view class="config-label">开发方案</view>
        <view class="solution-options">
          <view 
            v-for="solution in solutions" 
            :key="solution.id"
            class="solution-option pixel-card"
            :class="{ 'option-selected': selectedSolution === solution.id }"
            @click="selectSolution(solution.id)"
          >
            <view class="solution-header">
              <view class="solution-name">{{ solution.name }}</view>
              <view class="solution-weeks">{{ solution.weeks }}周</view>
            </view>
            <view class="solution-desc">{{ solution.description }}</view>
            <view class="solution-requirement">需要: {{ solution.requiredEmployees }}人</view>
          </view>
        </view>
      </view>
      
      <!-- 分配员工 -->
      <view class="config-section">
        <view class="config-label">
          分配员工 ({{ selectedEmployees.length }}/{{ requiredEmployeeCount }})
        </view>
        <view class="employees-list">
          <view 
            v-for="employee in idleEmployees" 
            :key="employee.id"
            class="employee-item"
            :class="{ 'employee-selected': isEmployeeSelected(employee.id) }"
            @click="toggleEmployee(employee)"
          >
            <view class="employee-item-name">{{ employee.name }}</view>
            <view class="employee-item-abilities">
              💻{{ employee.programming }} 🎨{{ employee.art }} 💼{{ employee.business }}
            </view>
          </view>
        </view>
        <view class="hint-text" v-if="idleEmployees.length === 0">
          没有空闲员工，请先招聘或等待当前产品完成
        </view>
      </view>
      
      <view class="button-group mt-40">
        <view 
          class="pixel-btn pixel-btn-success"
          :class="{ 'pixel-btn-disabled': !canStartDevelopment }"
          @click="startDevelopment"
        >
          开始开发 ▶
        </view>
        <view class="pixel-btn mt-20" @click="prevStep">
          上一步
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { loadGameState, saveGameState, addProduct, addNews } from '@/utils/storage'
import { getAvailableProducts, getAvailableCategories, getProductById, createProductInstance } from '@/data/products'
import { getUnlockedMonetizationMethods } from '@/data/growthRules'
import { getAllSolutions, generateDevelopmentTasks } from '@/data/solutions'
import { assignEmployeeToProduct, getIdleEmployees } from '@/utils/employeeManager'
import { aiContentFactory } from '@/utils/aiContentFactory'

// 状态数据
const gameState = ref(null)
const currentStep = ref(0)
const steps = ['选择类型', '选择产品', '配置开发']

// 选择状态
const selectedCategory = ref(null)
const selectedProduct = ref(null)
const selectedProductTemplate = ref(null)
const productName = ref('')
const selectedMonetization = ref(null)
const selectedSolution = ref('balanced')
const selectedEmployees = ref([])

// AI创意生成状态
const generatingIdeas = ref(false)
const productIdeas = ref([])
const streamingIdeasText = ref('') // 流式生成的JSON文本

// 可用选项
const availableCategories = ref([])
const productsInCategory = ref([])
const availableMonetizations = ref([])
const solutions = ref([])
const idleEmployees = ref([])

// 计算属性
const requiredEmployeeCount = computed(() => {
  const solution = solutions.value.find(s => s.id === selectedSolution.value)
  return solution ? solution.requiredEmployees : 1
})

const canStartDevelopment = computed(() => {
  return productName.value.trim() && 
         selectedMonetization.value && 
         selectedSolution.value &&
         selectedEmployees.value.length >= requiredEmployeeCount.value
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
  
  // 加载可用分类
  availableCategories.value = getAvailableCategories(gameState.value.currentYear)
  
  // 加载变现方式
  availableMonetizations.value = getUnlockedMonetizationMethods(gameState.value.currentYear)
  
  // 加载开发方案
  solutions.value = getAllSolutions()
  
  // 加载空闲员工
  idleEmployees.value = getIdleEmployees(gameState.value.employees)
}

const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId
  
  // 加载该分类下的产品
  productsInCategory.value = getAvailableProducts(gameState.value.currentYear)
    .filter(p => p.category === categoryId)
}

const selectProduct = (product) => {
  selectedProduct.value = product.id
  selectedProductTemplate.value = product
  productName.value = product.name // 默认使用产品名称
  
  // 设置默认变现方式
  if (!selectedMonetization.value) {
    selectedMonetization.value = product.defaultMonetization
  }
}

const selectMonetization = (methodId) => {
  selectedMonetization.value = methodId
}

const selectSolution = (solutionId) => {
  selectedSolution.value = solutionId
  
  // 清空已选员工（因为需求数量可能变了）
  selectedEmployees.value = []
}

const toggleEmployee = (employee) => {
  const index = selectedEmployees.value.findIndex(e => e.id === employee.id)
  if (index >= 0) {
    selectedEmployees.value.splice(index, 1)
  } else {
    if (selectedEmployees.value.length < requiredEmployeeCount.value) {
      selectedEmployees.value.push(employee)
    } else {
      uni.showToast({
        title: `最多选择${requiredEmployeeCount.value}人`,
        icon: 'none'
      })
    }
  }
}

const isEmployeeSelected = (employeeId) => {
  return selectedEmployees.value.some(e => e.id === employeeId)
}

const nextStep = () => {
  if (currentStep.value === 0 && !selectedCategory.value) {
    uni.showToast({
      title: '请选择产品类型',
      icon: 'none'
    })
    return
  }
  
  if (currentStep.value === 1 && !selectedProduct.value) {
    uni.showToast({
      title: '请选择产品',
      icon: 'none'
    })
    return
  }
  
  currentStep.value++
}

const prevStep = () => {
  currentStep.value--
}

const startDevelopment = () => {
  if (!canStartDevelopment.value) {
    uni.showToast({
      title: '请完成所有配置',
      icon: 'none'
    })
    return
  }
  
  // 创建产品实例
  const productInstance = createProductInstance(
    selectedProductTemplate.value.id,
    productName.value,
    selectedMonetization.value,
    selectedEmployees.value.map(e => e.id),
    selectedSolution.value
  )
  
  // 生成开发任务
  productInstance.developmentTodos = generateDevelopmentTasks(selectedSolution.value, false)
  
  // 分配员工到产品
  selectedEmployees.value.forEach(emp => {
    const employee = gameState.value.employees.find(e => e.id === emp.id)
    if (employee) {
      assignEmployeeToProduct(employee, productInstance.instanceId)
    }
  })
  
  // 添加产品到游戏状态
  addProduct(gameState.value, productInstance)
  
  // 添加新闻
  addNews(gameState.value, {
    content: `🚀 开始开发${productName.value}，预计${solutions.value.find(s => s.id === selectedSolution.value).weeks}周完成`
  })
  
  // 保存游戏状态
  saveGameState(gameState.value)
  
  // 返回主面板
  uni.showToast({
    title: '开始开发！',
    icon: 'success'
  })
  
  setTimeout(() => {
    uni.navigateBack()
  }, 1000)
}

const goBack = () => {
  uni.navigateBack()
}

const getProductIdeas = async () => {
  if (generatingIdeas.value) return
  generatingIdeas.value = true
  streamingIdeasText.value = '' // 清空之前的流式文本
  productIdeas.value = [] // 清空之前的创意
  
  // 使用流式生成
  aiContentFactory.generateProductIdeasStream(
    {
      year: gameState.value.currentYear,
      era: gameState.value.era,
      companyName: gameState.value.companyName,
      existingProducts: gameState.value.products?.map(p => p.name) || [],
      companyStrength: '技术导向',
      category: selectedCategory.value,
      grade: 'C',
      monetization: selectedMonetization.value || 'ad',
      trendingTopics: ['产品创新', '用户体验'],
      competitors: [],
      userPainPoints: []
    },
    (chunk, accumulated) => {
      // 实时更新流式文本（打字机效果）
      streamingIdeasText.value = accumulated
    },
    (parsedIdeas) => {
      // 完成后展示解析后的创意卡片
      productIdeas.value = parsedIdeas
      streamingIdeasText.value = '' // 清空流式文本
      generatingIdeas.value = false
      
      if (parsedIdeas && parsedIdeas.length > 0) {
        uni.showToast({
          title: `已生成${parsedIdeas.length}个创意方案`,
          icon: 'success'
        })
      } else {
        uni.showToast({
          title: '创意生成完成',
          icon: 'none'
        })
      }
    },
    (error) => {
      console.error('获取创意失败:', error)
      streamingIdeasText.value = ''
      generatingIdeas.value = false
      uni.showToast({
        title: '获取创意失败，请重试',
        icon: 'none'
      })
    }
  )
}

const useProductIdea = (idea) => {
  productName.value = idea.name
  selectedProduct.value = null // 清空预设产品选择
  selectedProductTemplate.value = null
  selectedMonetization.value = null
  selectedSolution.value = 'balanced'
  selectedEmployees.value = []
  uni.showToast({
    title: `使用创意: ${idea.name}`,
    icon: 'none'
  })
}

// 生命周期
onLoad(() => {
  initData()
})
</script>

<style scoped>
.new-product-page {
  min-height: 100vh;
  padding: 40rpx;
  background: #F4E4C1;
  padding-bottom: 80rpx;
}

.step-indicator {
  display: flex;
  justify-content: center;
  margin-bottom: 40rpx;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
}

.step-item::after {
  content: '';
  position: absolute;
  top: 25rpx;
  left: 50%;
  width: 100%;
  height: 4rpx;
  background: #D7CCC8;
  z-index: 0;
}

.step-item:last-child::after {
  display: none;
}

.step-number {
  width: 50rpx;
  height: 50rpx;
  border: 4px solid #D7CCC8;
  background: #F4E4C1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 24rpx;
  color: #8D6E63;
  z-index: 1;
  position: relative;
}

.step-active .step-number {
  background: #FFC107;
  border-color: #FFA000;
  color: #3E2723;
}

.step-completed .step-number {
  background: #558B2F;
  border-color: #33691E;
  color: #FFF;
}

.step-label {
  font-size: 22rpx;
  color: #8D6E63;
  margin-top: 10rpx;
}

.step-active .step-label {
  color: #3E2723;
  font-weight: bold;
}

.step-content {
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.categories-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20rpx;
  margin-top: 30rpx;
}

.category-card {
  padding: 40rpx 20rpx;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.category-selected {
  background: #FFE082 !important;
  box-shadow: 0 0 0 4px #FFC107;
}

.category-icon {
  font-size: 60rpx;
  margin-bottom: 15rpx;
}

.category-name {
  font-size: 26rpx;
  font-weight: bold;
  color: #3E2723;
}

.ai-ideas-section {
  margin-top: 30rpx;
}

.streaming-text-container {
  margin-top: 20rpx;
}

.streaming-text {
  padding: 20rpx;
  background: #FFF;
  border: 3px solid #3E2723;
  min-height: 200rpx;
  max-height: 400rpx;
  overflow-y: auto;
  font-size: 22rpx;
  color: #5D4037;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: monospace;
}

.ideas-container {
  margin-top: 20rpx;
}

.ideas-list {
  height: 300rpx; /* Adjust height as needed */
  overflow-y: auto;
}

.idea-card {
  padding: 20rpx;
  margin-bottom: 15rpx;
  cursor: pointer;
  background: #FFF;
  border: 3px solid #3E2723;
}

.idea-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #3E2723;
  margin-bottom: 8rpx;
}

.idea-slogan {
  font-size: 24rpx;
  color: #5D4037;
  margin-bottom: 10rpx;
}

.idea-desc {
  font-size: 22rpx;
  color: #5D4037;
  line-height: 1.6;
  margin-bottom: 10rpx;
}

.idea-highlights {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}

.highlight-tag {
  background: #E0E0E0;
  padding: 5rpx 12rpx;
  border-radius: 10rpx;
  font-size: 20rpx;
  color: #3E2723;
}

.products-list {
  height: 900rpx;
  margin-top: 30rpx;
}

.product-item {
  margin-bottom: 20rpx;
  padding: 25rpx;
  cursor: pointer;
}

.product-selected {
  background: #FFE082 !important;
  box-shadow: 0 0 0 4px #FFC107;
}

.product-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
}

.product-item-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #3E2723;
}

.product-item-desc {
  font-size: 24rpx;
  color: #5D4037;
  line-height: 1.6;
  margin-bottom: 10rpx;
}

.product-item-meta {
  font-size: 22rpx;
  color: #8D6E63;
}

.config-section {
  margin: 30rpx 0;
}

.config-label {
  font-size: 28rpx;
  font-weight: bold;
  color: #3E2723;
  margin-bottom: 15rpx;
}

.pixel-input {
  width: 100%;
  padding: 20rpx;
  background: #FFF;
  border: 4px solid #3E2723;
  font-size: 28rpx;
  font-family: 'Courier New', Courier, monospace;
}

.monetization-options,
.solution-options {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.monetization-option,
.solution-option {
  padding: 20rpx;
  background: #FFF;
  border: 3px solid #3E2723;
  cursor: pointer;
}

.option-selected {
  background: #FFE082 !important;
  border-color: #FFC107 !important;
  border-width: 4px !important;
}

.option-name,
.solution-name {
  font-size: 26rpx;
  font-weight: bold;
  color: #3E2723;
  margin-bottom: 8rpx;
}

.option-desc,
.solution-desc {
  font-size: 22rpx;
  color: #5D4037;
}

.solution-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.solution-weeks {
  padding: 5rpx 12rpx;
  background: #558B2F;
  color: #FFF;
  border: 2px solid #33691E;
  font-size: 20rpx;
  font-weight: bold;
}

.solution-requirement {
  font-size: 22rpx;
  color: #8D6E63;
  margin-top: 8rpx;
}

.employees-list {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.employee-item {
  padding: 20rpx;
  background: #FFF;
  border: 3px solid #3E2723;
  cursor: pointer;
}

.employee-selected {
  background: #FFE082 !important;
  border-color: #FFC107 !important;
  border-width: 4px !important;
}

.employee-item-name {
  font-size: 26rpx;
  font-weight: bold;
  color: #3E2723;
  margin-bottom: 8rpx;
}

.employee-item-abilities {
  font-size: 22rpx;
  color: #5D4037;
}

.hint-text {
  font-size: 24rpx;
  color: #8D6E63;
  text-align: center;
  padding: 20rpx;
}

.button-group {
  display: flex;
  flex-direction: column;
}
</style>

