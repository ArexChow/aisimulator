// 本地存储封装（基于 uni.storage）

const STORAGE_KEYS = {
  PLAYER_DATA: 'player_data',
  GAME_STATE: 'game_state',
  GAME_HISTORY: 'game_history'
};

// 初始玩家数据
const INITIAL_PLAYER_DATA = {
  vision: 50,
  luck: 50,
  stamina: 50,
  maxStamina: 50,
  crystals: 0,
  permanentUpgrades: {
    vision: 0,
    luck: 0,
    stamina: 0
  },
  tempUpgrades: [],
  gamesPlayed: 0,
  gamesWon: 0,
  bestGrade: null,
  totalCrystals: 0
};

// 保存玩家数据
export function savePlayerData(data) {
  try {
    uni.setStorageSync(STORAGE_KEYS.PLAYER_DATA, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('保存玩家数据失败:', e);
    return false;
  }
}

// 读取玩家数据
export function loadPlayerData() {
  try {
    const data = uni.getStorageSync(STORAGE_KEYS.PLAYER_DATA);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('读取玩家数据失败:', e);
  }
  return { ...INITIAL_PLAYER_DATA };
}

// 重置玩家数据（保留晶核和永久升级）
export function resetPlayerData() {
  const current = loadPlayerData();
  const newData = {
    ...INITIAL_PLAYER_DATA,
    crystals: current.crystals,
    permanentUpgrades: current.permanentUpgrades,
    gamesPlayed: current.gamesPlayed,
    gamesWon: current.gamesWon,
    bestGrade: current.bestGrade,
    totalCrystals: current.totalCrystals
  };
  
  // 应用永久升级
  const bonus = calculatePermanentBonus(newData.permanentUpgrades);
  newData.vision += bonus.vision;
  newData.luck += bonus.luck;
  newData.maxStamina += bonus.stamina;
  newData.stamina = newData.maxStamina;
  
  savePlayerData(newData);
  return newData;
}

// 计算永久升级加成
function calculatePermanentBonus(upgrades) {
  // 这里简化处理，每级加固定值
  return {
    vision: upgrades.vision * 5,
    luck: upgrades.luck * 5,
    stamina: upgrades.stamina * 10
  };
}

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

// 保存游戏历史记录
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

// 更新晶核数量
export function updateCrystals(amount) {
  const playerData = loadPlayerData();
  playerData.crystals += amount;
  playerData.totalCrystals += amount;
  savePlayerData(playerData);
  return playerData.crystals;
}

// 购买永久升级
export function purchaseUpgrade(attr, cost) {
  const playerData = loadPlayerData();
  
  if (playerData.crystals < cost) {
    return { success: false, message: '晶核不足' };
  }
  
  playerData.crystals -= cost;
  playerData.permanentUpgrades[attr] += 1;
  
  savePlayerData(playerData);
  return { success: true, data: playerData };
}

