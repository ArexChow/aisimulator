// 本地存储封装（基于 uni.storage）

const STORAGE_KEYS = {
  GAME_STATE: 'game_state',
  GAME_HISTORY: 'game_history',
  SETTINGS: 'settings'
};

// 初始游戏状态 - 增加初始资金使游戏更容易上手
const INITIAL_GAME_STATE = {
  companyName: '',
  money: 80000, // 从50000增加到80000
  currentYear: 2000,
  currentWeek: 1,
  employees: [],
  products: [],
  news: [],
  financingHistory: [],
  statistics: {
    totalRevenue: 0,
    totalExpenses: 0,
    productsLaunched: 0,
    employeesHired: 0,
    bestProduct: null,
    peakMoney: 80000, // 相应调整
    startTime: null
  }
};

// 保存游戏状态
export function saveGameState(state) {
  try {
    uni.setStorageSync(STORAGE_KEYS.GAME_STATE, JSON.stringify(state));
    return true;
  } catch (e) {
    console.error('保存游戏状态失败:', e);
    return false;
  }
}

// 读取游戏状态
export function loadGameState() {
  try {
    const data = uni.getStorageSync(STORAGE_KEYS.GAME_STATE);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('读取游戏状态失败:', e);
  }
  return null;
}

// 清除游戏状态
export function clearGameState() {
  try {
    uni.removeStorageSync(STORAGE_KEYS.GAME_STATE);
    return true;
  } catch (e) {
    console.error('清除游戏状态失败:', e);
    return false;
  }
}

// 创建新游戏
export function createNewGame(companyName) {
  const newState = {
    ...INITIAL_GAME_STATE,
    companyName,
    statistics: {
      ...INITIAL_GAME_STATE.statistics,
      startTime: Date.now()
    }
  };
  
  saveGameState(newState);
  return newState;
}

// 检查是否有存档
export function hasSavedGame() {
  const state = loadGameState();
  return state !== null && state.companyName !== '';
}

// 保存游戏历史记录（游戏结束时）
export function saveGameHistory(record) {
  try {
    let history = [];
    const data = uni.getStorageSync(STORAGE_KEYS.GAME_HISTORY);
    if (data) {
      history = JSON.parse(data);
    }
    
    history.unshift({
      ...record,
      timestamp: Date.now()
    });
    
    // 只保留最近20条记录
    if (history.length > 20) {
      history = history.slice(0, 20);
    }
    
    uni.setStorageSync(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(history));
    return true;
  } catch (e) {
    console.error('保存游戏历史失败:', e);
    return false;
  }
}

// 读取游戏历史记录
export function loadGameHistory() {
  try {
    const data = uni.getStorageSync(STORAGE_KEYS.GAME_HISTORY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('读取游戏历史失败:', e);
  }
  return [];
}

// 获取历史统计
export function getHistoryStatistics() {
  const history = loadGameHistory();
  
  if (history.length === 0) {
    return {
      gamesPlayed: 0,
      totalRevenue: 0,
      totalProducts: 0,
      longestSurvival: 0,
      peakMoney: 0,
      bestProduct: null
    };
  }
  
  return {
    gamesPlayed: history.length,
    totalRevenue: history.reduce((sum, game) => sum + (game.statistics?.totalRevenue || 0), 0),
    totalProducts: history.reduce((sum, game) => sum + (game.statistics?.productsLaunched || 0), 0),
    longestSurvival: Math.max(...history.map(game => game.weeksPlayed || 0)),
    peakMoney: Math.max(...history.map(game => game.statistics?.peakMoney || 0)),
    bestProduct: history.reduce((best, game) => {
      const gameBest = game.statistics?.bestProduct;
      if (!gameBest) return best;
      if (!best || gameBest.dau > best.dau) return gameBest;
      return best;
    }, null)
  };
}

// 更新统计数据
export function updateStatistics(state, updates) {
  state.statistics = {
    ...state.statistics,
    ...updates
  };
  
  // 更新峰值资金
  if (state.money > state.statistics.peakMoney) {
    state.statistics.peakMoney = state.money;
  }
  
  return state;
}

// 添加新闻
export function addNews(state, newsItem) {
  state.news.unshift({
    ...newsItem,
    week: state.currentWeek,
    year: state.currentYear,
    id: Date.now() + Math.random()
  });
  
  // 只保留最近50条新闻
  if (state.news.length > 50) {
    state.news = state.news.slice(0, 50);
  }
  
  return state;
}

// 添加产品到状态
export function addProduct(state, product) {
  state.products.push(product);
  state.statistics.productsLaunched++;
  return state;
}

// 更新产品
export function updateProduct(state, productInstanceId, updates) {
  const productIndex = state.products.findIndex(p => p.instanceId === productInstanceId);
  if (productIndex !== -1) {
    state.products[productIndex] = {
      ...state.products[productIndex],
      ...updates
    };
    
    // 更新最佳产品
    const product = state.products[productIndex];
    if (!state.statistics.bestProduct || product.dau > state.statistics.bestProduct.dau) {
      state.statistics.bestProduct = {
        name: product.name,
        dau: product.dau,
        revenue: product.monthlyRevenue
      };
    }
  }
  return state;
}

// 删除产品（下架）
export function removeProduct(state, productInstanceId) {
  state.products = state.products.filter(p => p.instanceId !== productInstanceId);
  return state;
}

// 添加员工到状态
export function addEmployee(state, employee) {
  employee.hireDate = state.currentWeek;
  state.employees.push(employee);
  state.statistics.employeesHired++;
  return state;
}

// 更新员工
export function updateEmployee(state, employeeId, updates) {
  const employeeIndex = state.employees.findIndex(e => e.id === employeeId);
  if (employeeIndex !== -1) {
    state.employees[employeeIndex] = {
      ...state.employees[employeeIndex],
      ...updates
    };
  }
  return state;
}

// 删除员工（解雇）
export function removeEmployee(state, employeeId) {
  state.employees = state.employees.filter(e => e.id !== employeeId);
  return state;
}

// 添加融资记录
export function addFinancing(state, amount) {
  state.financingHistory.push({
    week: state.currentWeek,
    year: state.currentYear,
    amount,
    weeksSince: 0
  });
  state.money += amount;
  return state;
}

// 更新融资冷却时间
export function updateFinancingCooldown(state) {
  state.financingHistory.forEach(record => {
    record.weeksSince = (record.weeksSince || 0) + 1;
  });
  return state;
}

// 设置/读取游戏设置
export function saveSettings(settings) {
  try {
    uni.setStorageSync(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (e) {
    console.error('保存设置失败:', e);
    return false;
  }
}

export function loadSettings() {
  try {
    const data = uni.getStorageSync(STORAGE_KEYS.SETTINGS);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('读取设置失败:', e);
  }
  return {
    soundEnabled: true,
    autoSave: true
  };
}
