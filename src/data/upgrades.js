// 能力升级配置

// 永久升级（使用晶核购买）
export const permanentUpgrades = {
  vision: {
    name: '眼界',
    description: '提升眼界可以发掘更好的产品需求',
    icon: '👁️',
    levels: [
      { level: 1, cost: 10, bonus: 5, desc: '眼界 +5' },
      { level: 2, cost: 20, bonus: 5, desc: '眼界 +5' },
      { level: 3, cost: 35, bonus: 5, desc: '眼界 +5' },
      { level: 4, cost: 50, bonus: 5, desc: '眼界 +5' },
      { level: 5, cost: 70, bonus: 5, desc: '眼界 +5' },
      { level: 6, cost: 100, bonus: 10, desc: '眼界 +10' },
      { level: 7, cost: 150, bonus: 10, desc: '眼界 +10' },
      { level: 8, cost: 200, bonus: 10, desc: '眼界 +10' },
      { level: 9, cost: 300, bonus: 10, desc: '眼界 +10' },
      { level: 10, cost: 500, bonus: 10, desc: '眼界 +10（满级）' }
    ]
  },
  luck: {
    name: '运气',
    description: '提升运气可以获得更好的市场反响',
    icon: '🍀',
    levels: [
      { level: 1, cost: 10, bonus: 5, desc: '运气 +5' },
      { level: 2, cost: 20, bonus: 5, desc: '运气 +5' },
      { level: 3, cost: 35, bonus: 5, desc: '运气 +5' },
      { level: 4, cost: 50, bonus: 5, desc: '运气 +5' },
      { level: 5, cost: 70, bonus: 5, desc: '运气 +5' },
      { level: 6, cost: 100, bonus: 10, desc: '运气 +10' },
      { level: 7, cost: 150, bonus: 10, desc: '运气 +10' },
      { level: 8, cost: 200, bonus: 10, desc: '运气 +10' },
      { level: 9, cost: 300, bonus: 10, desc: '运气 +10' },
      { level: 10, cost: 500, bonus: 10, desc: '运气 +10（满级）' }
    ]
  },
  stamina: {
    name: '体力',
    description: '提升体力上限可以挑战更高难度的产品',
    icon: '💪',
    levels: [
      { level: 1, cost: 10, bonus: 10, desc: '体力上限 +10' },
      { level: 2, cost: 20, bonus: 10, desc: '体力上限 +10' },
      { level: 3, cost: 35, bonus: 10, desc: '体力上限 +10' },
      { level: 4, cost: 50, bonus: 15, desc: '体力上限 +15' },
      { level: 5, cost: 70, bonus: 15, desc: '体力上限 +15' },
      { level: 6, cost: 100, bonus: 20, desc: '体力上限 +20' },
      { level: 7, cost: 150, bonus: 20, desc: '体力上限 +20' },
      { level: 8, cost: 200, bonus: 25, desc: '体力上限 +25' },
      { level: 9, cost: 300, bonus: 30, desc: '体力上限 +30' },
      { level: 10, cost: 500, bonus: 50, desc: '体力上限 +50（满级）' }
    ]
  }
};

// 临时升级（Boss战后三选一）
export const temporaryUpgrades = [
  {
    id: 'vision_boost',
    name: '灵光一现',
    description: '眼界临时 +15',
    icon: '💡',
    effect: { type: 'vision', value: 15 }
  },
  {
    id: 'luck_boost',
    name: '好运连连',
    description: '运气临时 +15',
    icon: '🎰',
    effect: { type: 'luck', value: 15 }
  },
  {
    id: 'stamina_boost',
    name: '精力充沛',
    description: '体力上限临时 +30',
    icon: '⚡',
    effect: { type: 'stamina', value: 30 }
  },
  {
    id: 'stamina_restore',
    name: '休息恢复',
    description: '立即恢复50点体力',
    icon: '🛌',
    effect: { type: 'restore', value: 50 }
  },
  {
    id: 'efficiency',
    name: '高效开发',
    description: '下一个项目所有任务体力消耗 -20%',
    icon: '⚙️',
    effect: { type: 'efficiency', value: 0.8 }
  },
  {
    id: 'quality_master',
    name: '品质大师',
    description: '下一个项目所有任务质量影响 +30%',
    icon: '⭐',
    effect: { type: 'quality', value: 1.3 }
  },
  {
    id: 'fast_learner',
    name: '快速学习',
    description: '下一个项目进度速度 +20%',
    icon: '📚',
    effect: { type: 'speed', value: 1.2 }
  },
  {
    id: 'risk_taker',
    name: '冒险家',
    description: 'Boss战成功率 +10%，失败不扣晶核',
    icon: '🎲',
    effect: { type: 'risk', value: 0.1 }
  },
  {
    id: 'perfectionist',
    name: '完美主义',
    description: '项目评级提升一个小等级',
    icon: '💎',
    effect: { type: 'grade_boost', value: 1 }
  }
];

// 随机选择三个临时升级选项
export function getRandomTempUpgrades(count = 3) {
  const shuffled = [...temporaryUpgrades].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// 计算永久升级的总加成
export function calculatePermanentBonus(upgrades) {
  const bonus = { vision: 0, luck: 0, stamina: 0 };
  
  for (const [attr, level] of Object.entries(upgrades)) {
    if (level > 0 && permanentUpgrades[attr]) {
      const upgrade = permanentUpgrades[attr];
      for (let i = 0; i < level && i < upgrade.levels.length; i++) {
        bonus[attr] += upgrade.levels[i].bonus;
      }
    }
  }
  
  return bonus;
}

// 计算下一级升级需要的晶核
export function getUpgradeCost(attr, currentLevel) {
  const upgrade = permanentUpgrades[attr];
  if (!upgrade || currentLevel >= upgrade.levels.length) {
    return null; // 已满级
  }
  return upgrade.levels[currentLevel];
}

// 应用临时升级效果
export function applyTempUpgrade(playerStats, upgrade) {
  const newStats = { ...playerStats };
  
  switch (upgrade.effect.type) {
    case 'vision':
      newStats.vision += upgrade.effect.value;
      break;
    case 'luck':
      newStats.luck += upgrade.effect.value;
      break;
    case 'stamina':
      newStats.maxStamina = (newStats.maxStamina || 50) + upgrade.effect.value;
      break;
    case 'restore':
      newStats.stamina = Math.min(
        newStats.stamina + upgrade.effect.value,
        newStats.maxStamina || 50
      );
      break;
    case 'efficiency':
    case 'quality':
    case 'speed':
    case 'risk':
    case 'grade_boost':
      // 这些效果会在游戏逻辑中检查并应用
      if (!newStats.tempUpgrades) {
        newStats.tempUpgrades = [];
      }
      newStats.tempUpgrades.push(upgrade);
      break;
  }
  
  return newStats;
}

