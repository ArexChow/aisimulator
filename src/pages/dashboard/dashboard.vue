<template>
  <view class="dashboard-page">
    <!-- 顶部状态栏 -->
    <view class="status-bar" v-if="gameState">
      <view class="company-info">
        <view class="company-name">{{ gameState.companyName }}</view>
        <view class="time-display">{{ timeDisplay }}</view>
      </view>
      <view class="money-display" :class="'money-' + moneyStatus">
        <text class="money-icon">💰</text>
        <text class="money-value">{{ formatMoney(gameState.money) }}</text>
      </view>
      <view class="action-buttons">
        <view class="pixel-btn-mini pixel-btn-save" @click="saveGame">
          💾 保存
        </view>
        <view class="pixel-btn-mini" @click="showFinanceDialog">
          融资
        </view>
      </view>
    </view>

    <!-- 主要内容区 -->
    <view class="main-content" v-if="gameState">
      <!-- 调试信息
      <view style="position: fixed; top: 100rpx; left: 20rpx; z-index: 9999; background: red; color: white; padding: 10rpx; font-size: 24rpx;">
        当前Tab: {{ currentTab }}
      </view> -->
      
      <!-- 产品区域 -->
      <view class="tab-content products-tab" v-if="currentTab === 'products'">
        <view class="section-header">
          <text class="section-title">产品列表 ({{ gameState.products.length }})</text>
          <view class="pixel-btn-mini pixel-btn-success" @click="goToNewProduct">
            + 新产品
          </view>
        </view>
        
        <!-- 产品Logo横向滚动栏 -->
        <scroll-view 
          v-if="gameState.products.length > 0"
          scroll-x 
          class="product-logo-scroll"
          :show-scrollbar="false"
        >
          <view class="product-logo-list">
            <!-- 各个产品Logo -->
            <view 
              v-for="product in gameState.products" 
              :key="product.instanceId"
              class="product-logo-item"
              :class="{ 'logo-active': selectedProductFilter === product.instanceId }"
              @click="selectProductFilter(product.instanceId)"
            >
              <view class="logo-icon">{{ product.logo }}</view>
              <view class="logo-name">{{ product.name }}</view>
            </view>
          </view>
        </scroll-view>
        
        <scroll-view scroll-y class="content-scroll">
          <view class="empty-hint" v-if="gameState.products.length === 0">
            还没有产品，点击"新产品"开始开发吧！
          </view>
          
          <view 
            v-for="product in filteredProducts" 
            :key="product.instanceId"
            class="product-card pixel-card"
          >
            <view class="product-header">
              <view class="product-name-row">
                <text class="product-name">{{ product.name }}</text>
                <view class="pixel-badge" :class="'badge-' + product.grade.toLowerCase()">
                  {{ product.grade }}
                </view>
              </view>
              <view class="product-status">{{ getProductStatus(product) }}</view>
            </view>
            
            <!-- 研发中 -->
            <view v-if="product.status === 'developing'" class="product-development">
              <view class="progress-bar-container">
                <view class="pixel-progress">
                  <view class="pixel-progress-bar" :style="{width: product.developmentProgress + '%'}"></view>
                </view>
                <text class="progress-text">{{ product.developmentProgress }}%</text>
              </view>
            </view>
            
            <!-- 研发日志滚动区（研发中和运营中都显示） -->
            <view v-if="product.status === 'developing' || product.status === 'operating'" class="product-development-logs">
              <view class="dev-logs-header">
                <text>📋 研发日志</text>
                <text class="dev-logs-hint">最新 ↓</text>
              </view>
              <scroll-view 
                scroll-y 
                class="dev-logs-scroll"
              >
                <view class="dev-logs-container">
                  <view 
                    v-for="(logItem, index) in getReversedLogs(product.instanceId)" 
                    :key="index"
                    class="dev-log-item"
                    :class="{
                      'dev-log-todo': logItem.type === 'todo', 
                      'dev-log-ai': logItem.type === 'log',
                      'dev-log-slack': logItem.type === 'slack'
                    }"
                  >
                    <view class="dev-log-header">
                      <text class="dev-log-time">{{ formatNewsTime(logItem.week) }}</text>
                      <text class="dev-log-type" v-if="logItem.type === 'todo'">✓ 任务</text>
                      <text class="dev-log-type" v-else-if="logItem.type === 'slack'">⚠️ 摸鱼</text>
                      <text class="dev-log-type" v-else>📝 日志</text>
                    </view>
                    <view class="dev-log-content">
                      {{ logItem.content }}
                      <text v-if="logItem.streaming" class="streaming-cursor">▊</text>
                    </view>
                  </view>
                  
                  <view v-if="getReversedLogs(product.instanceId).length === 0" class="dev-logs-empty">
                    研发进行中，日志加载中...
                  </view>
                </view>
              </scroll-view>
            </view>
            
            <!-- 运营中 -->
            <view v-if="product.status === 'operating'" class="product-stats">
              <view class="stat-row">
                <text class="stat-label">DAU</text>
                <text class="stat-value">{{ formatNumber(product.dau) }}</text>
              </view>
              <view class="stat-row">
                <text class="stat-label">月收入</text>
                <text class="stat-value">¥{{ formatMoney(product.monthlyRevenue) }}</text>
              </view>
              <view class="stat-row">
                <text class="stat-label">评价</text>
                <text class="stat-value">{{ '⭐'.repeat(Math.floor(product.userRating)) }} {{ product.userRating.toFixed(1) }}</text>
              </view>
            </view>
            
            <!-- 操作按钮 -->
            <view class="product-actions" v-if="product.status === 'operating'">
              <view class="pixel-btn-tiny" @click="promoteProduct(product)">推广</view>
              <view class="pixel-btn-tiny" @click="upgradeProduct(product)">升级</view>
              <view class="pixel-btn-tiny" @click="showComments(product)">💬评论</view>
              <view class="pixel-btn-tiny pixel-btn-danger" @click="offlineProduct(product)">下架</view>
            </view>
            
            <!-- 用户评论展开区 -->
            <view v-if="selectedProductComments === product.instanceId" class="product-details">
              <view class="details-header">用户评论</view>
              <view v-if="productComments[product.instanceId]?.length > 0" class="comments-list">
                <view 
                  v-for="(comment, index) in productComments[product.instanceId]"
                  :key="index"
                  class="comment-item"
                  :class="'sentiment-' + comment.sentiment"
                >
                  <view class="comment-header">
                    <text class="comment-author">{{ comment.author }}</text>
                    <text class="comment-rating">{{ '⭐'.repeat(comment.rating) }}</text>
                  </view>
                  <view class="comment-content">{{ comment.content }}</view>
                </view>
              </view>
              <view v-else class="loading-hint">加载中...</view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 员工区域 -->
      <view class="tab-content employees-tab" v-if="currentTab === 'employees'">
        <view class="section-header">
          <text class="section-title">员工列表 ({{ gameState.employees.length }})</text>
          <view class="pixel-btn-mini pixel-btn-success" @click="goToRecruit">
            + 招聘
          </view>
        </view>
        
        <scroll-view scroll-y class="content-scroll">
          <view 
            v-for="employee in gameState.employees" 
            :key="employee.id"
            class="employee-card pixel-card"
            :class="{ 
              'employee-slacking': employee.status === 'slacking',
              'employee-resting': employee.status === 'idle' && employee.stamina < employee.maxStamina
            }"
          >
            <view class="employee-header">
              <view class="employee-name-row">
                <text class="employee-name">{{ employee.name }}</text>
                <view class="personality-tag">{{ employee.personality.name }}</view>
                <view v-if="employee.status === 'slacking'" class="slacking-badge">摸鱼中</view>
                <view v-if="employee.status === 'idle' && employee.stamina < employee.maxStamina" class="resting-badge">休息中</view>
              </view>
              <view class="employee-status">{{ getEmployeeStatus(employee) }}</view>
            </view>
            
            <view class="employee-abilities">
              <view class="ability-mini">
                <text class="ability-label">💻</text>
                <view class="ability-bar-mini">
                  <view class="bar-fill" :style="{width: employee.programming + '%'}"></view>
                </view>
                <text class="ability-num">{{ employee.programming }}</text>
              </view>
              <view class="ability-mini">
                <text class="ability-label">🎨</text>
                <view class="ability-bar-mini">
                  <view class="bar-fill" :style="{width: employee.art + '%'}"></view>
                </view>
                <text class="ability-num">{{ employee.art }}</text>
              </view>
              <view class="ability-mini">
                <text class="ability-label">💼</text>
                <view class="ability-bar-mini">
                  <view class="bar-fill" :style="{width: employee.business + '%'}"></view>
                </view>
                <text class="ability-num">{{ employee.business }}</text>
              </view>
            </view>
            
            <view class="stamina-bar">
              <text class="stamina-label">体力</text>
              <view class="pixel-progress">
                <view 
                  class="pixel-progress-bar" 
                  :class="{ 'bar-danger': employee.stamina <= 20, 'bar-warning': employee.stamina <= 50 }"
                  :style="{width: (employee.stamina / employee.maxStamina * 100) + '%'}"
                ></view>
              </view>
              <text class="stamina-value" :class="{ 'stamina-critical': employee.stamina <= 20 }">
                {{ employee.stamina }}/{{ employee.maxStamina }}
              </text>
            </view>
            
            <view class="employee-actions">
              <view class="pixel-btn-tiny" @click="pepTalk(employee)">画大饼</view>
              <view class="pixel-btn-tiny" v-if="employee.status === 'slacking'" @click="walkBy(employee)">路过工位</view>
              <view class="pixel-btn-tiny pixel-btn-danger" @click="confirmFire(employee)">解雇</view>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 新闻栏 -->
      <view class="tab-content news-tab" v-if="currentTab === 'news'">
        <view class="section-header">
          <text class="section-title">新闻动态</text>
        </view>
        
        <scroll-view scroll-y class="content-scroll">
          <view 
            v-for="newsItem in gameState.news.slice(0, 20)" 
            :key="newsItem.id"
            class="news-item"
          >
            <view class="news-time">{{ formatNewsTime(newsItem.week) }}</view>
            <view class="news-content">{{ newsItem.content }}</view>
          </view>
          
          <view class="empty-hint" v-if="gameState.news.length === 0">
            暂无新闻
          </view>
        </scroll-view>
      </view>
    </view>
    
    <!-- 底部Tab导航 -->
    <view class="tab-bar" v-if="gameState">
      <view 
        class="tab-item" 
        :class="{ active: currentTab === 'products' }"
        @click="switchTab('products')"
      >
        <view class="tab-icon">📦</view>
        <view class="tab-label">产品</view>
      </view>
      <view 
        class="tab-item" 
        :class="{ active: currentTab === 'employees' }"
        @click="switchTab('employees')"
      >
        <view class="tab-icon">👥</view>
        <view class="tab-label">员工</view>
      </view>
      <view 
        class="tab-item" 
        :class="{ active: currentTab === 'news' }"
        @click="switchTab('news')"
      >
        <view class="tab-icon-wrapper">
          <view class="tab-icon">📰</view>
          <view class="tab-badge" v-if="unreadNewsCount > 0">{{ unreadNewsCount > 99 ? '99+' : unreadNewsCount }}</view>
        </view>
        <view class="tab-label">新闻</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { onLoad, onShow, onHide } from '@dcloudio/uni-app'
import { loadGameState, saveGameState, addNews, updateProduct, updateEmployee, removeProduct, removeEmployee, updateFinancingCooldown, addFinancing } from '@/utils/storage'
import { TimeManager, formatTime, getCurrentEra, formatYearMonth } from '@/utils/timeSystem'
import { updateEmployeeWeekly, getEmployeeStatusText, pepTalk as doPepTalk, walkBy as doWalkBy, fireEmployee, calculateMonthlySalaries } from '@/utils/employeeManager'
import { settleWeeklyFinance, checkBankruptcy, getMoneyStatus, formatMoney, requestFinancing, FINANCING_CONFIG } from '@/utils/financeManager'
import { updateProductWeekly, applyUpgrade, applyPromotion, PROMOTION_METHODS, calculateOperatingCost } from '@/data/growthRules'
import { getThemeByYear, getThemeChangeMessage } from '@/utils/themeSystem'
import { checkMilestoneEvent, generateProductNews } from '@/data/newsEvents'
import { getSolution, calculateInitialDAU, calculateInitialRating } from '@/data/solutions'
import { aiContentFactory } from '@/utils/aiContentFactory'
import { aiService } from '@/utils/aiService'

// 状态数据
const gameState = ref(null)
const timeManager = ref(null)
const currentTheme = ref(null)
const lastEra = ref(null)
const currentTab = ref('products')
const unreadNewsCount = ref(0)
const lastReadNewsId = ref(0)
const selectedProductFilter = ref(null)
// AI内容状态
const selectedProductComments = ref(null)
const productComments = ref({})
// 研发进度日志（每周）
const developmentLogs = ref({}) // 格式：{ productId: [{ week: 1, type: 'todo'|'log', content: 'xxx', streaming: false }] }
// 星期几显示（1-7，对应周一到周日）
const currentWeekday = ref(1)
const weekdayTimer = ref(null)

// 计算属性
const timeDisplay = computed(() => {
  if (!gameState.value) return ''
  const weekdayNames = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
  const weekdayText = weekdayNames[currentWeekday.value - 1] || '星期一'
  return `${formatTime(gameState.value.currentYear, gameState.value.currentWeek)}（${weekdayText}）`
})

const moneyStatus = computed(() => {
  if (!gameState.value) return 'safe'
  return getMoneyStatus(gameState.value.money)
})

const filteredProducts = computed(() => {
  if (!gameState.value) return []
  if (!selectedProductFilter.value) return gameState.value.products
  return gameState.value.products.filter(p => p.instanceId === selectedProductFilter.value)
})

// 安全的研发日志访问 - 确保返回的数据总是有效的
const safeDevelopmentLogs = computed(() => {
  if (!developmentLogs.value || typeof developmentLogs.value !== 'object' || Array.isArray(developmentLogs.value)) {
    return {}
  }
  return developmentLogs.value
})

// 获取反转后的日志列表（最新的在最上面）
const getReversedLogs = (productId) => {
  const logs = safeDevelopmentLogs.value[productId]
  if (!logs || !Array.isArray(logs) || logs.length === 0) {
    return []
  }
  // 过滤掉任何 null 或 undefined 元素
  const validLogs = logs.filter(log => log && typeof log === 'object')
  return [...validLogs].reverse()
}

// 辅助函数：安全保存游戏状态（包括研发日志）
const saveGameWithLogs = () => {
  if (!gameState.value) return false
  
  try {
    // 确保 developmentLogs.value 是一个对象
    let logsToSave = {}
    
    if (developmentLogs.value && typeof developmentLogs.value === 'object' && !Array.isArray(developmentLogs.value)) {
      // 清理数据：只保存有效的日志
      for (const productId in developmentLogs.value) {
        const logs = developmentLogs.value[productId]
        if (Array.isArray(logs) && logs.length > 0) {
          // 过滤掉 null、undefined 和非对象元素
          const validLogs = logs.filter(log => {
            return log && typeof log === 'object' && log.week && log.type && log.content !== undefined
          })
          if (validLogs.length > 0) {
            logsToSave[productId] = validLogs
          }
        }
      }
    }
    
    // 深拷贝研发日志，避免引用问题和响应式数据问题
    gameState.value.developmentLogs = JSON.parse(JSON.stringify(logsToSave))
    
    // 更新token统计
    const tokenUsage = aiService.getTokenUsage()
    gameState.value.statistics.totalInputTokens = tokenUsage.inputTokens
    gameState.value.statistics.totalOutputTokens = tokenUsage.outputTokens
    console.log('保存Token统计 - Input:', tokenUsage.inputTokens, 'Output:', tokenUsage.outputTokens)
    
    return saveGameState(gameState.value)
  } catch (error) {
    console.error('保存游戏状态失败:', error)
    // 如果保存失败，清空 developmentLogs 以避免污染游戏状态
    try {
      gameState.value.developmentLogs = {}
      return saveGameState(gameState.value)
    } catch (e) {
      console.error('二次保存也失败:', e)
      return false
    }
  }
}

// 方法
const initGame = () => {
  const savedState = loadGameState()
  if (!savedState) {
    uni.showToast({
      title: '未找到游戏存档',
      icon: 'none'
    })
    setTimeout(() => {
      uni.reLaunch({ url: '/pages/home/home' })
    }, 1500)
    return
  }
  
  gameState.value = savedState
  
  // 恢复token统计到aiService
  if (savedState.statistics) {
    aiService.sessionInputTokens = savedState.statistics.totalInputTokens || 0
    aiService.sessionOutputTokens = savedState.statistics.totalOutputTokens || 0
    console.log('恢复Token统计 - Input:', aiService.sessionInputTokens, 'Output:', aiService.sessionOutputTokens)
  }
  
  // 恢复研发日志数据（确保是一个对象）
  try {
    if (gameState.value.developmentLogs && typeof gameState.value.developmentLogs === 'object' && !Array.isArray(gameState.value.developmentLogs)) {
      // 深拷贝以避免引用问题，并过滤掉无效值
      const rawLogs = JSON.parse(JSON.stringify(gameState.value.developmentLogs))
      // 确保每个产品的日志都是数组
      const validLogs = {}
      for (const key in rawLogs) {
        if (Array.isArray(rawLogs[key])) {
          validLogs[key] = rawLogs[key].filter(log => log && typeof log === 'object')
        }
      }
      developmentLogs.value = validLogs
    } else {
      developmentLogs.value = {}
    }
  } catch (error) {
    console.error('恢复研发日志失败:', error)
    developmentLogs.value = {}
  }
  
  // 初始化时间管理器
  timeManager.value = new TimeManager()
  timeManager.value.setTime(gameState.value.currentYear, gameState.value.currentWeek)
  
  // 注册每周事件
  timeManager.value.on('onWeekPass', handleWeekPass)
  // 注册每月财务结算事件
  timeManager.value.on('onMonthPass', handleMonthPass)
  
  // 初始化主题
  const currentEra = getCurrentEra(gameState.value.currentYear)
  lastEra.value = currentEra
  currentTheme.value = getThemeByYear(gameState.value.currentYear)
  
  // 初始化未读新闻计数
  if (gameState.value.news.length > 0) {
    lastReadNewsId.value = gameState.value.news[0].id
  }
  
  // 启动时间流逝
  timeManager.value.start()
}

const handleWeekPass = async (timeData) => {
  if (!gameState.value) return
  
  // 更新游戏状态的时间
  gameState.value.currentYear = timeData.year
  gameState.value.currentWeek = timeData.week
  
  // 1. 更新所有员工状态
  gameState.value.employees = gameState.value.employees.map(emp => {
    const oldStatus = emp.status
    const oldStamina = emp.stamina
    const updated = updateEmployeeWeekly(emp, gameState.value.currentWeek)
    
    // 调试日志：记录状态变化
    if (oldStatus !== updated.status) {
      console.log(`[员工状态变化] ${updated.name}: ${oldStatus} -> ${updated.status}, 体力: ${oldStamina} -> ${updated.stamina}`)
    }
    
    return updated
  })
  
  // 2. 更新所有产品
  gameState.value.products.forEach(product => {
    if (product.status === 'operating') {
      const productEmployees = gameState.value.employees.filter(e => e.workingOn === product.instanceId)
      updateProductWeekly(product, productEmployees)
    } else if (product.status === 'developing') {
      // 检查是否有员工在摸鱼
      const workingEmployees = gameState.value.employees.filter(e => 
        e.workingOn === product.instanceId && e.status === 'working'
      )
      
      const slackingEmployees = gameState.value.employees.filter(e => 
        e.workingOn === product.instanceId && e.status === 'slacking'
      )
      
      // 如果有员工摸鱼，添加摸鱼日志
      if (slackingEmployees.length > 0) {
        const slackingNames = slackingEmployees.map(e => e.name).join('、')
        addDevelopmentLog(product.instanceId, {
          week: gameState.value.currentWeek,
          type: 'slack',
          content: `⚠️ ${slackingNames} 正在摸鱼，开发进度受到影响...`,
          streaming: false
        })
      }
      
      if (workingEmployees.length > 0) {
        // 推进开发进度
        const todosPerWeek = 100 / product.developmentTodos.length
        product.developmentProgress = Math.min(100, product.developmentProgress + todosPerWeek)
        
        // 更新当前todo
        const newTodoIndex = Math.floor(product.developmentProgress / todosPerWeek)
        if (newTodoIndex > product.currentTodoIndex && newTodoIndex < product.developmentTodos.length) {
          product.currentTodoIndex = newTodoIndex
          
          // 添加 todo 到研发日志
          addDevelopmentLog(product.instanceId, {
            week: gameState.value.currentWeek,
            type: 'todo',
            content: product.developmentTodos[newTodoIndex - 1],
            streaming: false
          })
          
          addNews(gameState.value, {
            content: `${product.name} 完成了"${product.developmentTodos[newTodoIndex - 1]}"`
          })
        }
        
        // 每周生成研发日志
        generateWeeklyDevLog(product)
        
        // 检查是否完成开发
        if (product.developmentProgress >= 100) {
          if (product.launchDate) {
            // 升级完成
            completeUpgrade(product)
          } else {
            // 新产品上线
            launchProduct(product)
          }
        }
      }
    }
  })
  
  // 3. 检查时代切换
  const currentEra = getCurrentEra(gameState.value.currentYear)
  if (lastEra.value !== currentEra) {
    const newTheme = getThemeByYear(gameState.value.currentYear)
    currentTheme.value = newTheme
    lastEra.value = currentEra
    
    // 添加时代切换新闻
    const message = getThemeChangeMessage(newTheme)
    if (message) {
      addNews(gameState.value, { content: message })
    }
  }
  
  // 4. 保存游戏状态（包括研发日志）
  saveGameWithLogs()
  
  // 5. 更新未读新闻计数
  updateUnreadNewsCount()
}

const handleMonthPass = async (timeData) => {
  if (!gameState.value) return
  
  gameState.value.currentYear = timeData.year
  gameState.value.currentWeek = timeData.week
  
  // 每月结算财务 - 计算整个月（4周）的收入和支出
  let monthlyIncome = 0
  let monthlyExpenses = 0
  
  // 计算本月收入（4周）
  gameState.value.products.forEach(product => {
    if (product.status === 'operating') {
      // 月收入
      monthlyIncome += product.monthlyRevenue
    }
  })
  
  // 计算本月支出（员工工资 + 产品运营成本）
  monthlyExpenses += calculateMonthlySalaries(gameState.value.employees)
  gameState.value.products.forEach(product => {
    if (product.status === 'operating') {
      const monthlyCost = calculateOperatingCost(product)
      monthlyExpenses += monthlyCost
    }
  })
  
  const monthlyNetChange = monthlyIncome - monthlyExpenses
  gameState.value.money += monthlyNetChange
  gameState.value.statistics.totalRevenue += Math.max(0, monthlyIncome)
  gameState.value.statistics.totalExpenses += Math.max(0, monthlyExpenses)
  
  // 添加月度财务新闻
  if (monthlyNetChange !== 0) {
    const sign = monthlyNetChange > 0 ? '+' : ''
    addNews(gameState.value, {
      content: `本月财务：收入¥${formatMoney(monthlyIncome)}，支出¥${formatMoney(monthlyExpenses)}，${sign}¥${formatMoney(monthlyNetChange)}`
    })
  }
  
  // 每月检查破产
  if (checkBankruptcy(gameState.value.money, monthlyExpenses)) {
    handleBankruptcy()
    return
  }
  
  // 每月检查融资冷却
  updateFinancingCooldown(gameState.value)
  
  // 每月生成随机新闻
  // 检查里程碑事件
  const milestone = checkMilestoneEvent(gameState.value.currentYear)
  if (milestone) {
    addNews(gameState.value, { content: milestone })
  }
  
  // 使用AI生成动态新闻（100% AI生成）
  aiContentFactory.generateDynamicNewsStream(
    {
      year: gameState.value.currentYear,
      era: getCurrentEra(gameState.value.currentYear),
      companyName: gameState.value.companyName,
      employeeCount: gameState.value.employees.length,
      productCount: gameState.value.products.length,
      mainProducts: gameState.value.products.slice(0, 3).map(p => ({
        name: p.name,
        category: p.category,
        dau: p.dau
      })),
      marketPosition: gameState.value.products.length > 0 ? '成长' : '新创'
    },
    (chunk, accumulated) => {
      // 流式更新时不做特殊处理（后台生成）
      // console.log('动态新闻生成中:', accumulated)
    },
    (fullContent) => {
      // 完成后添加到新闻列表
      if (fullContent) {
        addNews(gameState.value, { content: fullContent })
        saveGameWithLogs()
      }
    },
    (error) => {
      console.error('AI新闻生成失败:', error)
      // AI生成失败时添加简单提示，不使用预设新闻
      addNews(gameState.value, { content: '📰 行业资讯生成中，请稍候...' })
      saveGameWithLogs()
    }
  )
  
  // 检查产品里程碑
  gameState.value.products.forEach(product => {
    if (product.status === 'operating') {
      const productNews = generateProductNews(product)
      productNews.forEach(news => {
        addNews(gameState.value, { content: news })
      })
    }
  })
  
  saveGameWithLogs()
}

const launchProduct = (product) => {
  product.status = 'operating'
  product.launchDate = gameState.value.currentWeek
  
  // 释放员工
  gameState.value.employees.forEach(emp => {
    if (emp.workingOn === product.instanceId) {
      emp.status = 'idle'
      emp.workingOn = null
    }
  })
  
  // 设置初始DAU和评价
  const solution = getSolution(product.developmentSolution)
  product.dau = calculateInitialDAU(product.grade, solution.quality)
  product.userRating = calculateInitialRating(product.grade, solution.quality)
  
  addNews(gameState.value, {
    content: `🎉 ${product.name} 正式上线！初始DAU: ${formatNumber(product.dau)}`
  })
}

const completeUpgrade = (product) => {
  product.status = 'operating'
  
  // 释放员工
  const assignedEmployees = gameState.value.employees.filter(e => e.workingOn === product.instanceId)
  gameState.value.employees.forEach(emp => {
    if (emp.workingOn === product.instanceId) {
      emp.status = 'idle'
      emp.workingOn = null
    }
  })
  
  // 应用升级效果
  const solution = getSolution(product.developmentSolution)
  applyUpgrade(product, solution.quality)
  
  addNews(gameState.value, {
    content: `✨ ${product.name} 升级完成！用户评价提升至${product.userRating.toFixed(1)}⭐`
  })
}

const handleBankruptcy = () => {
  timeManager.value?.pause()
  
  uni.showModal({
    title: '公司破产',
    content: `资金耗尽，${gameState.value.companyName}宣布破产！`,
    showCancel: false,
    success: () => {
      // 跳转到结算页面
      uni.redirectTo({
        url: '/pages/result/result'
      })
    }
  })
}

const saveGame = () => {
  if (!gameState.value) return
  
  // 保存游戏状态（包括研发日志）
  const success = saveGameWithLogs()
  
  if (success) {
    uni.showToast({
      title: '进度已保存',
      icon: 'success',
      duration: 1500
    })
  } else {
    uni.showToast({
      title: '保存失败',
      icon: 'none'
    })
  }
}

const getProductStatus = (product) => {
  if (product.status === 'developing') return '研发中'
  if (product.status === 'operating') return '运营中'
  return '已下架'
}

const getEmployeeStatus = (employee) => {
  return getEmployeeStatusText(employee, gameState.value.products)
}

const formatNumber = (num) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toFixed(0)
}

const formatNewsTime = (week) => {
  // 根据周数计算年份和月份
  const year = Math.floor((week - 1) / 52) + 2000
  const weekOfYear = ((week - 1) % 52) + 1
  const month = Math.ceil(weekOfYear / 4)
  return `${year}年${month}月`
}

const goToNewProduct = () => {
  // 保存游戏状态
  saveGameWithLogs()
  timeManager.value?.pause()
  uni.navigateTo({
    url: '/pages/new-product/new-product'
  })
}

const goToRecruit = () => {
  // 保存游戏状态
  saveGameWithLogs()
  timeManager.value?.pause()
  uni.navigateTo({
    url: '/pages/recruit/recruit'
  })
}

const promoteProduct = (product) => {
  // 显示推广选项
  uni.showActionSheet({
    itemList: [
      '朋友圈推广 - ¥5,000 (+500 DAU)',
      '搜索引擎广告 - ¥20,000 (+3,000 DAU)',
      '电视广告 - ¥50,000 (+10,000 DAU)'
    ],
    success: (res) => {
      const promotionTypes = ['social', 'search', 'tv']
      const selectedType = promotionTypes[res.tapIndex]
      
      const method = PROMOTION_METHODS[selectedType]
      
      // 检查资金
      if (gameState.value.money < method.cost) {
        uni.showToast({
          title: '资金不足',
          icon: 'none'
        })
        return
      }
      
      // 扣除费用并增加DAU
      gameState.value.money -= method.cost
      applyPromotion(product, selectedType)
      
      addNews(gameState.value, {
        content: `${product.name} 投放${method.name}，DAU增加${method.dauBoost}`
      })
      
      saveGameWithLogs()
      
      uni.showToast({
        title: '推广成功！',
        icon: 'success'
      })
    }
  })
}

const upgradeProduct = (product) => {
  // 保存游戏状态
  saveGameWithLogs()
  timeManager.value?.pause()
  uni.navigateTo({
    url: `/pages/product-upgrade/product-upgrade?productId=${product.instanceId}`
  })
}

const offlineProduct = (product) => {
  uni.showModal({
    title: '确认下架？',
    content: `下架后${product.name}将停止运营，不再产生收入`,
    success: (res) => {
      if (res.confirm) {
        product.status = 'offline'
        // 释放员工
        gameState.value.employees.forEach(emp => {
          if (emp.workingOn === product.instanceId) {
            emp.status = 'idle'
            emp.workingOn = null
          }
        })
        addNews(gameState.value, {
          content: `${product.name} 已下架`
        })
        saveGameWithLogs()
      }
    }
  })
}

// AI生成的用户评论
const showComments = async (product) => {
  if (selectedProductComments.value === product.instanceId) {
    // 切换关闭
    selectedProductComments.value = null
    return
  }
  
  selectedProductComments.value = product.instanceId
  selectedProductLogs.value = null // 关闭日志
  
  // 检查是否已缓存
  if (!productComments.value[product.instanceId]) {
    // 初始化为空数组，标记为生成中
    productComments.value[product.instanceId] = []
    
    // 使用流式生成评论
    aiContentFactory.generateProductCommentsStream(
      {
        productName: product.name,
        category: product.category,
        grade: product.grade,
        weeksSinceLaunch: gameState.value.currentWeek - (product.launchWeek || 0),
        solution: product.solution,
        dau: product.dau,
        rating: product.userRating,
        trend: 'stable',
        revenue: product.monthlyRevenue,
        scenario: 'steady_operation'
      },
      (chunk, accumulated) => {
        // 流式生成时显示提示（JSON文本不适合直接展示）
        // console.log('评论生成中:', accumulated)
      },
      (parsedComments) => {
        // 完成后更新评论列表
        productComments.value[product.instanceId] = parsedComments || []
      },
      (error) => {
        console.error('生成用户评论失败:', error)
        productComments.value[product.instanceId] = []
      }
    )
  }
}

const pepTalk = (employee) => {
  const result = doPepTalk(employee, gameState.value.currentWeek)
  if (result.success) {
    uni.showToast({
      title: '画大饼成功！',
      icon: 'success'
    })
    saveGameWithLogs()
  } else {
    uni.showToast({
      title: result.message,
      icon: 'none'
    })
  }
}

const walkBy = (employee) => {
  const result = doWalkBy(employee)
  if (result.success) {
    uni.showToast({
      title: '员工恢复工作了',
      icon: 'success'
    })
    saveGameWithLogs()
  }
}

const confirmFire = (employee) => {
  const severancePay = fireEmployee(employee, gameState.value.currentWeek).severancePay
  uni.showModal({
    title: '确认解雇？',
    content: `需要支付赔偿金¥${severancePay}`,
    success: (res) => {
      if (res.confirm) {
        if (gameState.value.money >= severancePay) {
          gameState.value.money -= severancePay
          removeEmployee(gameState.value, employee.id)
          addNews(gameState.value, {
            content: `${employee.name} 已离职，支付赔偿金¥${severancePay}`
          })
          saveGameWithLogs()
          uni.showToast({
            title: '已解雇',
            icon: 'success'
          })
        } else {
          uni.showToast({
            title: '资金不足',
            icon: 'none'
          })
        }
      }
    }
  })
}

const showFinanceDialog = () => {
  // 检查融资历史和冷却
  const result = requestFinancing(gameState.value.money, gameState.value.financingHistory)
  
  if (!result.success) {
    uni.showToast({
      title: result.message,
      icon: 'none'
    })
    return
  }
  
  // 显示融资确认对话框
  uni.showModal({
    title: '确认融资',
    content: `获得¥${FINANCING_CONFIG.amount}应急资金\n已融资${gameState.value.financingHistory.length}次，还可融资${FINANCING_CONFIG.maxTimes - gameState.value.financingHistory.length}次`,
    confirmText: '确认',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        // 执行融资
        addFinancing(gameState.value, FINANCING_CONFIG.amount)
        
        addNews(gameState.value, {
          content: `💰 成功融资¥${FINANCING_CONFIG.amount}，当前资金¥${formatMoney(gameState.value.money)}`
        })
        
        saveGameWithLogs()
        
        uni.showToast({
          title: '融资成功！',
          icon: 'success'
        })
      }
    }
  })
}

const switchTab = (tab) => {
  console.log('切换到tab:', tab, '当前tab:', currentTab.value)
  currentTab.value = tab
  console.log('切换后currentTab:', currentTab.value)
  
  // 切换到新闻tab时，清零未读计数
  if (tab === 'news' && gameState.value && gameState.value.news.length > 0) {
    unreadNewsCount.value = 0
    lastReadNewsId.value = gameState.value.news[0].id
  }
  
  // 切换tab时，重置产品筛选
  if (tab !== 'products') {
    selectedProductFilter.value = null
  }
}

const selectProductFilter = (productInstanceId) => {
  if (selectedProductFilter.value === productInstanceId) {
    // 如果点击当前选中的产品，取消筛选
    selectedProductFilter.value = null
  } else {
    selectedProductFilter.value = productInstanceId
  }
}

const updateUnreadNewsCount = () => {
  if (!gameState.value || !gameState.value.news.length) {
    unreadNewsCount.value = 0
    return
  }
  
  // 如果当前在新闻tab，不增加未读计数
  if (currentTab.value === 'news') {
    lastReadNewsId.value = gameState.value.news[0].id
    unreadNewsCount.value = 0
    return
  }
  
  // 计算未读新闻数量
  const latestNewsId = gameState.value.news[0].id
  if (latestNewsId > lastReadNewsId.value) {
    // 找到所有新增的新闻
    let count = 0
    for (let i = 0; i < gameState.value.news.length; i++) {
      if (gameState.value.news[i].id > lastReadNewsId.value) {
        count++
      } else {
        break
      }
    }
    unreadNewsCount.value = count
  }
}

// 添加研发日志条目
const addDevelopmentLog = (productId, logItem) => {
  // 确保 developmentLogs.value 是一个对象
  if (!developmentLogs.value || typeof developmentLogs.value !== 'object') {
    developmentLogs.value = {}
  }
  
  if (!developmentLogs.value[productId]) {
    developmentLogs.value[productId] = []
  }
  
  developmentLogs.value[productId].push(logItem)
  console.log(`[研发日志] 添加日志到产品 ${productId}，当前日志数：${developmentLogs.value[productId].length}`)
}

// 初始化开发中产品的研发日志
const initDevelopmentLogs = () => {
  if (!gameState.value) return
  
  // 确保 developmentLogs.value 是一个对象
  if (!developmentLogs.value || typeof developmentLogs.value !== 'object') {
    developmentLogs.value = {}
  }
  
  gameState.value.products.forEach(product => {
    if (product.status === 'developing') {
      // 如果该产品还没有日志，初始化日志数组
      if (!developmentLogs.value[product.instanceId]) {
        developmentLogs.value[product.instanceId] = []
        
        // 只有在进度为0时才添加初始日志（说明是新产品）
        if (product.developmentProgress === 0) {
          addDevelopmentLog(product.instanceId, {
            week: gameState.value.currentWeek,
            type: 'log',
            content: `${product.name} 项目启动，开始进行需求分析和技术选型...`,
            streaming: false
          })
        }
      }
    }
  })
}

// 生成每周研发日志（AI流式生成）
const generateWeeklyDevLog = (product) => {
  // 确保 developmentLogs.value 是一个对象
  if (!developmentLogs.value || typeof developmentLogs.value !== 'object') {
    developmentLogs.value = {}
  }
  
  // 先添加一个占位日志条目
  const logIndex = (developmentLogs.value[product.instanceId] || []).length
  addDevelopmentLog(product.instanceId, {
    week: gameState.value.currentWeek,
    type: 'log',
    content: '',
    streaming: true
  })
  
  // 获取参与员工
  const assignedEmployees = gameState.value.employees.filter(e => e.workingOn === product.instanceId)
  
  // 计算团队平均能力
  const avgProgramming = assignedEmployees.length > 0 
    ? Math.round(assignedEmployees.reduce((sum, e) => sum + e.programming, 0) / assignedEmployees.length)
    : 0
  const avgArt = assignedEmployees.length > 0
    ? Math.round(assignedEmployees.reduce((sum, e) => sum + e.art, 0) / assignedEmployees.length)
    : 0
  const avgBusiness = assignedEmployees.length > 0
    ? Math.round(assignedEmployees.reduce((sum, e) => sum + e.business, 0) / assignedEmployees.length)
    : 0
  
  // 使用AI生成日志内容
  aiContentFactory.generateDevLogStream(
    {
      productName: product.name,
      category: product.category,
      grade: product.grade,
      solution: product.solution,
      year: gameState.value.currentYear,
      era: getCurrentEra(gameState.value.currentYear),
      employees: assignedEmployees,
      avgProgramming,
      avgArt,
      avgBusiness,
      teamStatus: '正常',
      currentTask: product.developmentTodos?.[product.currentTodoIndex] || '开发中',
      progress: product.developmentProgress,
      week: gameState.value.currentWeek,
      totalWeeks: 8,
      isDelayed: false,
      logType: 'task_progress'
    },
    (chunk, accumulated) => {
      // 实时更新日志内容（打字机效果）
      if (developmentLogs.value[product.instanceId] && developmentLogs.value[product.instanceId][logIndex]) {
        developmentLogs.value[product.instanceId][logIndex].content = accumulated
      }
    },
    (fullContent) => {
      // 完成后标记为非流式
      if (developmentLogs.value[product.instanceId] && developmentLogs.value[product.instanceId][logIndex]) {
        developmentLogs.value[product.instanceId][logIndex].content = fullContent
        developmentLogs.value[product.instanceId][logIndex].streaming = false
      }
    },
    (error) => {
      console.error('生成研发日志失败:', error)
      if (developmentLogs.value[product.instanceId] && developmentLogs.value[product.instanceId][logIndex]) {
        developmentLogs.value[product.instanceId][logIndex].content = '研发进展顺利'
        developmentLogs.value[product.instanceId][logIndex].streaming = false
      }
    }
  )
}

// 启动星期几循环显示
const startWeekdayTimer = () => {
  // 清除旧的定时器
  if (weekdayTimer.value) {
    clearInterval(weekdayTimer.value)
  }
  
  // 每秒切换星期几（1-7循环）
  weekdayTimer.value = setInterval(() => {
    currentWeekday.value = currentWeekday.value >= 7 ? 1 : currentWeekday.value + 1
  }, 1000)
}

// 停止星期几定时器
const stopWeekdayTimer = () => {
  if (weekdayTimer.value) {
    clearInterval(weekdayTimer.value)
    weekdayTimer.value = null
  }
}

// 监听 developmentLogs，确保它永远不会变成 null 或非对象
watch(developmentLogs, (newVal) => {
  if (!newVal || typeof newVal !== 'object' || Array.isArray(newVal)) {
    console.warn('developmentLogs 变成了无效值，重置为空对象')
    developmentLogs.value = {}
  }
}, { immediate: true })

// 生命周期
onLoad(() => {
  initGame()
  // 初始化研发日志
  initDevelopmentLogs()
  // 启动星期几显示
  startWeekdayTimer()
})

onShow(() => {
  // 重新加载游戏状态以获取最新数据
  const latestState = loadGameState()
  if (latestState) {
    gameState.value = latestState
    
    // 恢复研发日志数据（确保是一个对象）
    try {
      if (latestState.developmentLogs && typeof latestState.developmentLogs === 'object' && !Array.isArray(latestState.developmentLogs)) {
        // 深拷贝以避免引用问题，并过滤掉无效值
        const rawLogs = JSON.parse(JSON.stringify(latestState.developmentLogs))
        // 确保每个产品的日志都是数组
        const validLogs = {}
        for (const key in rawLogs) {
          if (Array.isArray(rawLogs[key])) {
            validLogs[key] = rawLogs[key].filter(log => log && typeof log === 'object')
          }
        }
        developmentLogs.value = validLogs
      } else {
        developmentLogs.value = {}
      }
    } catch (error) {
      console.error('恢复研发日志失败:', error)
      developmentLogs.value = {}
    }
    
    // 初始化开发中产品的研发日志（只初始化新产品）
    initDevelopmentLogs()
    
    // 重启时间管理器（始终继续运行）
    if (timeManager.value) {
      timeManager.value.setTime(latestState.currentYear, latestState.currentWeek)
      timeManager.value.start()
    }
  }
  
  // 重新启动星期几显示
  startWeekdayTimer()
})

onHide(() => {
  // 离开页面时保存游戏状态并暂停
  if (gameState.value) {
    saveGameWithLogs()
  }
  timeManager.value?.pause()
  // 停止星期几显示
  stopWeekdayTimer()
})

onUnmounted(() => {
  timeManager.value?.destroy()
  // 清除星期几定时器
  stopWeekdayTimer()
})
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  height: 100vh;
  background: #F4E4C1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 30rpx;
  background: #3E2723;
  color: #F4E4C1;
  position: sticky;
  top: 0;
  z-index: 100;
}

.company-info {
  flex: 1;
}

.company-name {
  font-size: 32rpx;
  font-weight: bold;
}

.time-display {
  font-size: 22rpx;
  opacity: 0.8;
  margin-top: 5rpx;
}

.money-display {
  padding: 15rpx 25rpx;
  background: #558B2F;
  border: 3px solid #33691E;
  font-weight: bold;
  margin: 0 20rpx;
}

.money-warning {
  background: #F57C00 !important;
  border-color: #E65100 !important;
}

.money-danger {
  background: #C62828 !important;
  border-color: #8E0000 !important;
  animation: blink 1s infinite;
}

.money-icon {
  font-size: 24rpx;
}

.money-value {
  font-size: 28rpx;
  margin-left: 10rpx;
}

.action-buttons {
  display: flex;
  gap: 10rpx;
}

.pixel-btn-mini {
  padding: 10rpx 20rpx;
  background: #6D4C41;
  color: #F4E4C1;
  border: 2px solid #3E2723;
  font-size: 22rpx;
  font-weight: bold;
  text-align: center;
}

.pixel-btn-success {
  background: #558B2F;
  border-color: #33691E;
}

.pixel-btn-save {
  background: #2196F3;
  border-color: #1565C0;
}

.pixel-btn-save:active {
  background: #1565C0;
  transform: scale(0.95);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tab-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #FFF9C4;
  border-top: 4px solid #3E2723;
  padding: 20rpx;
  padding-bottom: 0;
  box-sizing: border-box;
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 15rpx;
  border-bottom: 3px solid #3E2723;
}

.section-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #3E2723;
}

.content-scroll {
  flex: 1;
  height: 0;
}

.pixel-card {
  border: 3px solid #3E2723;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
}

.pixel-badge {
  padding: 5rpx 12rpx;
  font-size: 20rpx;
  font-weight: bold;
  border: 2px solid #3E2723;
  display: inline-block;
}

.badge-s {
  background: #9E9E9E;
  color: #FFF;
}

.badge-a {
  background: #42A5F5;
  color: #FFF;
}

.badge-aa {
  background: #AB47BC;
  color: #FFF;
}

.badge-aaa {
  background: #FFA726;
  color: #FFF;
}

.product-card,
.employee-card {
  margin-bottom: 20rpx;
  padding: 20rpx;
  background: #FFF;
}

.product-header,
.employee-header {
  margin-bottom: 15rpx;
}

.product-name-row,
.employee-name-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.product-name,
.employee-name {
  font-size: 26rpx;
  font-weight: bold;
  color: #3E2723;
}

.product-status,
.employee-status {
  font-size: 22rpx;
  color: #8D6E63;
}

.product-development,
.product-stats {
  margin: 15rpx 0;
}

.pixel-progress {
  background: #D7CCC8;
  border: 2px solid #3E2723;
  overflow: hidden;
}

.pixel-progress-bar {
  height: 100%;
  background: #558B2F;
  transition: width 0.3s;
}

.progress-bar-container {
  display: flex;
  align-items: center;
  gap: 15rpx;
  margin-bottom: 10rpx;
}

.progress-bar-container .pixel-progress {
  flex: 1;
  height: 30rpx;
}

.progress-text {
  font-size: 22rpx;
  font-weight: bold;
  min-width: 60rpx;
  text-align: right;
}

.current-todo {
  font-size: 22rpx;
  color: #5D4037;
  padding: 10rpx;
  background: rgba(255, 193, 7, 0.1);
  border-left: 3px solid #FFC107;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  margin: 8rpx 0;
  font-size: 24rpx;
}

.stat-label {
  color: #5D4037;
}

.stat-value {
  font-weight: bold;
  color: #3E2723;
}

.product-actions,
.employee-actions {
  display: flex;
  gap: 10rpx;
  margin-top: 15rpx;
}

.pixel-btn-tiny {
  flex: 1;
  padding: 10rpx;
  background: #6D4C41;
  color: #F4E4C1;
  border: 2px solid #3E2723;
  font-size: 20rpx;
  font-weight: bold;
  text-align: center;
}

.pixel-btn-danger {
  background: #C62828;
  border-color: #8E0000;
}

.employee-abilities {
  margin: 15rpx 0;
}

.ability-mini {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin: 8rpx 0;
}

.ability-label {
  font-size: 20rpx;
  width: 40rpx;
}

.ability-bar-mini {
  flex: 1;
  height: 20rpx;
  background: #D7CCC8;
  border: 2px solid #3E2723;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: #6D4C41;
}

.ability-num {
  font-size: 20rpx;
  font-weight: bold;
  min-width: 50rpx;
  text-align: right;
}

.stamina-bar {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin: 15rpx 0;
}

.stamina-label {
  font-size: 22rpx;
  width: 60rpx;
}

.stamina-bar .pixel-progress {
  flex: 1;
  height: 25rpx;
}

.stamina-value {
  font-size: 22rpx;
  font-weight: bold;
  min-width: 80rpx;
  text-align: right;
}

.stamina-critical {
  color: #E53935;
  animation: stamina-warning 1.5s infinite;
}

@keyframes stamina-warning {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.bar-warning {
  background: #FFA726 !important;
}

.bar-danger {
  background: #E53935 !important;
}

.news-item {
  padding: 20rpx;
  margin-bottom: 15rpx;
  background: #FFF;
  border: 2px solid #3E2723;
}

.news-time {
  font-size: 20rpx;
  color: #8D6E63;
  margin-bottom: 8rpx;
}

.news-content {
  font-size: 24rpx;
  color: #3E2723;
  line-height: 1.6;
}

.empty-hint {
  text-align: center;
  padding: 40rpx;
  color: #8D6E63;
  font-size: 24rpx;
}

.personality-tag {
  padding: 5rpx 12rpx;
  background: #558B2F;
  color: #FFF;
  border: 2px solid #33691E;
  font-size: 20rpx;
  font-weight: bold;
}

.slacking-badge {
  padding: 5rpx 12rpx;
  background: #FF5722;
  color: #FFF;
  border: 2px solid #D84315;
  font-size: 20rpx;
  font-weight: bold;
  animation: slacking-blink 2s infinite;
}

.resting-badge {
  padding: 5rpx 12rpx;
  background: #4CAF50;
  color: #FFF;
  border: 2px solid #2E7D32;
  font-size: 20rpx;
  font-weight: bold;
}

@keyframes slacking-blink {
  0%, 50%, 100% {
    opacity: 1;
  }
  25%, 75% {
    opacity: 0.6;
  }
}

.employee-slacking {
  background: #FFF3E0 !important;
  border-color: #FF9800 !important;
  box-shadow: 0 0 0 3px rgba(255, 152, 0, 0.3) !important;
}

.employee-resting {
  background: #E8F5E9 !important;
  border-color: #4CAF50 !important;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2) !important;
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background: #3E2723;
  border-top: 4px solid #F4E4C1;
  padding: 10rpx 0;
  z-index: 100;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15rpx 0;
  color: #8D6E63;
  transition: all 0.3s;
}

.tab-item.active {
  color: #F4E4C1;
}

.tab-item.active .tab-icon {
  transform: scale(1.2);
}

.tab-icon-wrapper {
  position: relative;
}

.tab-icon {
  font-size: 40rpx;
  margin-bottom: 5rpx;
  transition: transform 0.3s;
}

.tab-label {
  font-size: 22rpx;
  font-weight: bold;
}

.tab-badge {
  position: absolute;
  top: -8rpx;
  right: -20rpx;
  min-width: 32rpx;
  height: 32rpx;
  background: #E53935;
  color: #FFF;
  font-size: 18rpx;
  font-weight: bold;
  border: 2px solid #FFF;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8rpx;
  animation: badge-pulse 2s infinite;
}

@keyframes badge-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes blink {
  0%, 50%, 100% {
    opacity: 1;
  }
  25%, 75% {
    opacity: 0.6;
  }
}

/* 产品Logo滚动栏 */
.product-logo-scroll {
  width: 100%;
  white-space: nowrap;
  margin-bottom: 20rpx;
  background: #FFF;
  border: 3px solid #3E2723;
  padding: 15rpx 0;
}

.product-logo-list {
  display: inline-flex;
  gap: 15rpx;
  padding: 0 20rpx;
}

.product-logo-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 15rpx 20rpx;
  background: #FFF9C4;
  border: 3px solid #3E2723;
  min-width: 120rpx;
  transition: all 0.2s;
  cursor: pointer;
}

.product-logo-item.logo-active {
  background: #FFC107;
  border-width: 4px;
  box-shadow: 0 0 0 3px #FFA000;
  transform: scale(1.05);
}

.logo-icon {
  font-size: 48rpx;
  margin-bottom: 8rpx;
}

.logo-name {
  font-size: 20rpx;
  font-weight: bold;
  color: #3E2723;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120rpx;
}

.logo-active .logo-name {
  color: #5D4037;
}

/* AI内容样式 */
.product-details {
  margin-top: 15rpx;
  padding-top: 15rpx;
  border-top: 2px solid #E0E0E0;
}

.details-header {
  font-weight: bold;
  font-size: 24rpx;
  color: #3E2723;
  margin-bottom: 10rpx;
}

.logs-list,
.comments-list {
  max-height: 300rpx;
  overflow-y: auto;
}

.log-item {
  padding: 10rpx;
  margin-bottom: 10rpx;
  background: #F9F9F9;
  border-left: 4px solid #FF9800;
}

.log-time {
  font-size: 20rpx;
  color: #FF9800;
  font-weight: bold;
  margin-bottom: 5rpx;
}

.log-content {
  font-size: 22rpx;
  color: #5D4037;
  line-height: 1.5;
}

.comment-item {
  padding: 12rpx;
  margin-bottom: 10rpx;
  background: #F9F9F9;
  border-radius: 6rpx;
  border-left: 4px solid #9C27B0;
}

.comment-item.sentiment-positive {
  border-left-color: #4CAF50;
}

.comment-item.sentiment-negative {
  border-left-color: #F44336;
}

.comment-item.sentiment-neutral {
  border-left-color: #9E9E9E;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8rpx;
  font-size: 20rpx;
}

.comment-author {
  font-weight: bold;
  color: #3E2723;
}

.comment-rating {
  color: #FF9800;
}

.comment-content {
  font-size: 22rpx;
  color: #5D4037;
  line-height: 1.5;
}

.loading-hint {
  padding: 20rpx;
  text-align: center;
  color: #999;
  font-size: 24rpx;
}

.pixel-divider {
  height: 2px;
  background: #D7CCC8;
  margin: 10rpx 0;
}

/* 研发日志区域 */
.product-development-logs {
  margin-top: 15rpx;
}

.dev-logs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24rpx;
  font-weight: bold;
  color: #3E2723;
  padding: 10rpx 15rpx;
  background: linear-gradient(135deg, #FFF9C4 0%, #FFF59D 100%);
  border: 2px solid #FBC02D;
  border-radius: 8rpx 8rpx 0 0;
  margin-bottom: -2rpx;
}

.dev-logs-hint {
  font-size: 20rpx;
  color: #F57C00;
  font-weight: normal;
  opacity: 0.8;
}

/* 研发日志滚动区 */
.dev-logs-scroll {
  height: 400rpx;
  background: #F9F9F9;
  border: 2px solid #E0E0E0;
  border-radius: 0 0 8rpx 8rpx;
}

.dev-logs-container {
  padding: 15rpx;
}

.dev-log-item {
  margin-bottom: 15rpx;
  padding: 15rpx;
  border-radius: 6rpx;
  border-left: 4px solid #3E2723;
  background: #FFF;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
}

.dev-log-todo {
  border-left-color: #FFC107;
  background: #FFFBF0;
}

.dev-log-ai {
  border-left-color: #2196F3;
  background: #F0F8FF;
}

.dev-log-slack {
  border-left-color: #F44336;
  background: #FFEBEE;
}

.dev-log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.dev-log-time {
  font-size: 20rpx;
  color: #8D6E63;
  font-weight: bold;
}

.dev-log-type {
  font-size: 18rpx;
  padding: 4rpx 10rpx;
  border-radius: 4rpx;
  background: rgba(0, 0, 0, 0.05);
  color: #5D4037;
}

.dev-log-content {
  font-size: 22rpx;
  color: #3E2723;
  line-height: 1.6;
  word-break: break-all;
}

.streaming-cursor {
  display: inline-block;
  margin-left: 4rpx;
  animation: blink-cursor 1s infinite;
  color: #2196F3;
  font-weight: bold;
}

@keyframes blink-cursor {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

.dev-logs-empty {
  padding: 40rpx 20rpx;
  text-align: center;
  color: #999;
  font-size: 22rpx;
}
</style>

