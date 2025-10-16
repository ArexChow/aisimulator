// 时间流逝系统

// 时间配置
export const TIME_CONFIG = {
  WEEK_DURATION: 8000, // 8秒 = 1周
  WEEKS_PER_MONTH: 4,
  WEEKS_PER_YEAR: 52
};

// 时间状态管理
export class TimeManager {
  constructor() {
    this.currentYear = 2000;
    this.currentWeek = 1;
    this.isRunning = false;
    this.timer = null;
    this.callbacks = {
      onWeekPass: [],
      onMonthPass: [],
      onYearPass: []
    };
  }
  
  // 启动时间流逝
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.timer = setInterval(() => {
      this.tick();
    }, TIME_CONFIG.WEEK_DURATION);
  }
  
  // 暂停时间流逝
  pause() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  
  // 时间推进一周
  tick() {
    this.currentWeek++;
    
    // 触发周回调
    this.triggerCallbacks('onWeekPass', {
      year: this.currentYear,
      week: this.currentWeek
    });
    
    // 检查是否跨月（每4周）
    if (this.currentWeek % TIME_CONFIG.WEEKS_PER_MONTH === 0) {
      this.triggerCallbacks('onMonthPass', {
        year: this.currentYear,
        week: this.currentWeek
      });
    }
    
    // 检查是否跨年（每52周）
    if (this.currentWeek % TIME_CONFIG.WEEKS_PER_YEAR === 0) {
      this.currentYear++;
      this.currentWeek = 1;
      this.triggerCallbacks('onYearPass', {
        year: this.currentYear,
        week: this.currentWeek
      });
    }
  }
  
  // 注册回调
  on(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event].push(callback);
    }
  }
  
  // 移除回调
  off(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
    }
  }
  
  // 触发回调
  triggerCallbacks(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} callback:`, error);
        }
      });
    }
  }
  
  // 设置时间
  setTime(year, week) {
    this.currentYear = year;
    this.currentWeek = week;
  }
  
  // 获取当前时间描述
  getTimeDescription() {
    const weekOfYear = this.currentWeek % TIME_CONFIG.WEEKS_PER_YEAR || TIME_CONFIG.WEEKS_PER_YEAR;
    return `${this.currentYear}年 第${weekOfYear}周`;
  }
  
  // 获取经过的总周数（从2000年开始）
  getTotalWeeks() {
    const yearsPassed = this.currentYear - 2000;
    return yearsPassed * TIME_CONFIG.WEEKS_PER_YEAR + this.currentWeek;
  }
  
  // 销毁
  destroy() {
    this.pause();
    this.callbacks = {
      onWeekPass: [],
      onMonthPass: [],
      onYearPass: []
    };
  }
}

// 计算两个时间点之间的周数差
export function calculateWeeksDiff(year1, week1, year2, week2) {
  const totalWeeks1 = (year1 - 2000) * TIME_CONFIG.WEEKS_PER_YEAR + week1;
  const totalWeeks2 = (year2 - 2000) * TIME_CONFIG.WEEKS_PER_YEAR + week2;
  return totalWeeks2 - totalWeeks1;
}

// 格式化时间显示
export function formatTime(year, week) {
  const weekOfYear = week % TIME_CONFIG.WEEKS_PER_YEAR || TIME_CONFIG.WEEKS_PER_YEAR;
  const month = Math.ceil(weekOfYear / TIME_CONFIG.WEEKS_PER_MONTH);
  return `${year}年${month}月 第${weekOfYear}周`;
}

// 判断当前时代
export function getCurrentEra(year) {
  if (year >= 2017) return 'ai';
  if (year >= 2011) return 'mobile';
  return 'pc';
}

// 获取时代名称
export function getEraName(era) {
  const names = {
    'pc': 'PC互联网时代',
    'mobile': '移动互联网时代',
    'ai': 'AI时代'
  };
  return names[era] || 'PC互联网时代';
}

