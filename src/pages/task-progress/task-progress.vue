<template>
  <view class="task-progress-page">
    <!-- CRT屏幕效果 -->
    <view v-if="solution" class="crt-screen main-screen">
      <view class="terminal-header">
        <text>{{ solution.name }}</text>
        <text class="blink ml-20">█</text>
      </view>

      <!-- Todo列表 -->
      <view class="todos-container mt-40">
        <view 
          v-for="(todo, index) in solution.todos" 
          :key="index"
          class="todo-line"
          :class="{ 
            'todo-completed': index < completedCount,
            'todo-current': index === completedCount && !isFinished
          }"
        >
          <text class="todo-status">
            {{ index < completedCount ? '[✓]' : '[ ]' }}
          </text>
          <text 
            class="todo-content"
            :class="{ 'strikethrough': index < completedCount }"
          >
            {{ todo }}
          </text>
        </view>
      </view>

      <!-- 进度信息 -->
      <view class="progress-info mt-40">
        <view class="progress-text">
          进度: {{ currentProgress.toFixed(1) }}%
        </view>
        <view class="pixel-progress mt-20">
          <view 
            class="pixel-progress-bar"
            :style="{width: currentProgress + '%'}"
          ></view>
        </view>
      </view>

      <!-- 体力条 -->
      <view class="stamina-display mt-30">
        <view class="stamina-label">体力: {{ currentStamina }} / {{ maxStamina }}</view>
        <view class="pixel-progress mt-10">
          <view 
            class="pixel-progress-bar"
            :class="{ 
              'bar-warning': staminaPercent < 60,
              'bar-danger': staminaPercent < 30 
            }"
            :style="{width: staminaPercent + '%'}"
          ></view>
        </view>
      </view>

      <!-- 状态信息 -->
      <view class="status-message mt-40" v-if="statusMessage">
        <text>{{ statusMessage }}</text>
        <text class="blink ml-10">█</text>
      </view>
    </view>

    <!-- 完成提示 -->
    <view class="pixel-card mt-40" v-if="isFinished">
      <view class="finish-message">
        <view class="finish-icon">{{ isSuccess ? '✓' : '✗' }}</view>
        <view class="finish-title">
          {{ isSuccess ? '任务完成！' : '任务失败...' }}
        </view>
        <view class="finish-desc" v-if="isSuccess">
          恭喜完成第{{ quarterIndex + 1 }}季度任务
        </view>
        <view class="finish-desc" v-else>
          体力耗尽，项目失败
        </view>
      </view>

      <view 
        class="pixel-btn pixel-btn-success mt-30"
        v-if="isSuccess"
        @click="continueGame"
      >
        继续 →
      </view>
      <view 
        class="pixel-btn pixel-btn-danger mt-30"
        v-else
        @click="goToResult"
      >
        查看结果
      </view>
    </view>
  </view>
</template>

<script>
import { loadGameState, saveGameState } from '@/utils/storage'
import { generateTodoTimings } from '@/utils/gameLogic'

export default {
  data() {
    return {
      gameState: null,
      solution: null,
      quarterIndex: 0,
      completedCount: 0,
      currentProgress: 0,
      currentStamina: 50,
      maxStamina: 50,
      isFinished: false,
      isSuccess: false,
      statusMessage: '正在初始化开发环境...',
      timers: []
    }
  },
  computed: {
    staminaPercent() {
      return (this.currentStamina / this.maxStamina * 100)
    }
  },
  onLoad() {
    this.initTask()
    setTimeout(() => {
      this.startTask()
    }, 1000)
  },
  onUnload() {
    // 清理所有定时器
    this.timers.forEach(timer => clearTimeout(timer))
  },
  methods: {
    initTask() {
      this.gameState = loadGameState()
      
      if (!this.gameState) {
        uni.showToast({
          title: '游戏状态错误',
          icon: 'none'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
        return
      }
      
      // 验证玩家状态
      if (!this.gameState.playerStats) {
        uni.showToast({
          title: '玩家状态错误',
          icon: 'none'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
        return
      }
      
      this.quarterIndex = this.gameState.quarterIndex || 0
      this.currentStamina = this.gameState.playerStats.stamina || 50
      this.maxStamina = this.gameState.playerStats.maxStamina || 50
      
      // 获取最新选择的方案
      const solutions = this.gameState.selectedSolutions
      if (!solutions || solutions.length === 0) {
        uni.showToast({
          title: '未找到选择的方案',
          icon: 'none'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
        return
      }
      
      this.solution = solutions[solutions.length - 1]
      
      // 验证方案数据
      if (!this.solution || !this.solution.todos || this.solution.todos.length === 0) {
        uni.showToast({
          title: '方案数据错误',
          icon: 'none'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
        return
      }
    },
    startTask() {
      this.statusMessage = '开始开发...'
      
      // 计算每个todo的时间间隔
      const totalTime = 8000 // 总共8秒完成
      const timings = generateTodoTimings(this.solution.todos, totalTime)
      
      // 计算体力消耗速度
      const staminaPerTodo = this.solution.stamina / this.solution.todos.length
      
      let currentTime = 0
      
      this.solution.todos.forEach((todo, index) => {
        currentTime += timings[index]
        
        const timer = setTimeout(() => {
          this.completeTodo(index, staminaPerTodo)
        }, currentTime)
        
        this.timers.push(timer)
      })
      
      // 任务完成
      const finishTimer = setTimeout(() => {
        this.finishTask()
      }, currentTime + 500)
      
      this.timers.push(finishTimer)
    },
    completeTodo(index, staminaCost) {
      // 完成一个todo
      this.completedCount = index + 1
      
      // 消耗体力
      this.currentStamina = Math.max(0, this.currentStamina - staminaCost)
      
      // 更新进度
      this.currentProgress = (this.completedCount / this.solution.todos.length) * 100
      
      // 更新状态消息
      const messages = [
        '编写代码中...',
        '调试功能...',
        '优化性能...',
        '编写测试...',
        '修复bug...',
        '代码审查...',
        '部署准备...'
      ]
      this.statusMessage = messages[index % messages.length]
      
      // 震动反馈
      uni.vibrateShort({
        type: 'light'
      })
      
      // 检查体力
      if (this.currentStamina <= 0 && this.completedCount < this.solution.todos.length) {
        // 体力耗尽，任务失败
        this.failTask()
      }
    },
    finishTask() {
      if (this.currentStamina <= 0) {
        this.failTask()
        return
      }
      
      this.isFinished = true
      this.isSuccess = true
      this.statusMessage = '任务完成！'
      this.currentProgress = 100
      
      // 更新游戏状态
      this.gameState.playerStats.stamina = Math.round(this.currentStamina)
      this.gameState.quarterIndex += 1
      
      saveGameState(this.gameState)
      
      // 震动反馈
      uni.vibrateShort()
    },
    failTask() {
      // 清除所有定时器
      this.timers.forEach(timer => clearTimeout(timer))
      this.timers = []
      
      this.isFinished = true
      this.isSuccess = false
      this.statusMessage = '体力耗尽...'
      this.currentStamina = 0
      
      // 震动反馈
      uni.vibrateLong()
    },
    continueGame() {
      // 判断是否还有季度任务
      if (this.gameState.quarterIndex < 3) {
        // 返回游戏主界面
        uni.navigateBack({
          delta: 2
        })
      } else {
        // 进入Boss战准备
        uni.navigateBack({
          delta: 2
        })
      }
    },
    goToResult() {
      // 跳转到结算页面（失败）
      uni.redirectTo({
        url: '/pages/result/result?success=false'
      })
    }
  }
}
</script>

<style scoped>
.task-progress-page {
  min-height: 100vh;
  padding: 40rpx;
  background: #F4E4C1;
}

.main-screen {
  min-height: 700rpx;
}

.terminal-header {
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
}

.ml-20 {
  margin-left: 20rpx;
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

.mt-10 {
  margin-top: 10rpx;
}

.todos-container {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.todo-line {
  display: flex;
  gap: 15rpx;
  font-size: 28rpx;
  opacity: 0.5;
  transition: all 0.3s;
}

.todo-current {
  opacity: 1;
  animation: pulse-green 1s infinite;
}

.todo-completed {
  opacity: 0.7;
}

@keyframes pulse-green {
  0%, 100% { color: #00FF00; }
  50% { color: #00AA00; }
}

.todo-status {
  font-weight: bold;
}

.todo-content {
  flex: 1;
  line-height: 1.6;
}

.strikethrough {
  text-decoration: line-through;
}

.progress-info {
  border-top: 2px solid #00FF00;
  padding-top: 30rpx;
}

.progress-text {
  font-size: 32rpx;
  font-weight: bold;
}

.stamina-display {
  border-top: 2px solid #00FF00;
  padding-top: 20rpx;
}

.stamina-label {
  font-size: 28rpx;
  font-weight: bold;
}

.bar-warning .pixel-progress-bar {
  background: #FFEB3B !important;
}

.bar-danger .pixel-progress-bar {
  background: #FF5252 !important;
}

.status-message {
  font-size: 26rpx;
  font-style: italic;
  opacity: 0.8;
}

.ml-10 {
  margin-left: 10rpx;
}

.finish-message {
  text-align: center;
  padding: 40rpx 0;
}

.finish-icon {
  font-size: 120rpx;
  margin-bottom: 30rpx;
}

.finish-title {
  font-size: 48rpx;
  font-weight: bold;
  color: #3E2723;
  margin-bottom: 20rpx;
}

.finish-desc {
  font-size: 28rpx;
  color: #5D4037;
}
</style>

