// 产品增长规则

// 变现方式配置 - 调整收入系数使经济更平衡
export const MONETIZATION_METHODS = {
  paid: {
    id: 'paid',
    name: '付费软件',
    description: '用户付费购买',
    revenuePerDAU: 0.3, // 每个DAU每月贡献0.3元（降低）
    unlockYear: 2000
  },
  ad: {
    id: 'ad',
    name: '免费+广告',
    description: '免费使用，广告收入',
    revenuePerDAU: 0.2, // 每个DAU每月贡献0.2元（降低）
    unlockYear: 2005
  },
  subscription: {
    id: 'subscription',
    name: '订阅制',
    description: '按月/年订阅',
    revenuePerDAU: 0.5, // 每个DAU每月贡献0.5元（降低）
    unlockYear: 2010
  }
};

// 获取当前年份已解锁的变现方式
export function getUnlockedMonetizationMethods(currentYear) {
  return Object.values(MONETIZATION_METHODS).filter(
    method => method.unlockYear <= currentYear
  );
}

// 计算产品DAU增长
export function calculateDAUGrowth(product, teamAbilities) {
  // 基础增长率（根据产品等级）- 调整为更合理的增长速度
  const baseGrowthRates = {
    'C': 30,     // C级产品每周基础增长30 DAU
    'B': 100,    // B级产品每周基础增长100 DAU
    'A': 500,    // A级产品每周基础增长500 DAU
    'S': 2000    // S级产品每周基础增长2000 DAU
  };
  
  const baseGrowth = baseGrowthRates[product.grade] || 30;
  
  // 团队编程能力影响（技术稳定性）
  const programmingFactor = teamAbilities.programming / 50; // 50为基准，1.0倍率
  
  // 用户评价影响
  const ratingFactor = product.userRating / 3; // 3星为基准，1.0倍率
  
  // 综合增长率
  let growth = baseGrowth * programmingFactor * ratingFactor;
  
  // 产品生命周期衰减（周数越大衰减越多）- 放缓衰减速度
  const weeksSinceLaunch = product.weeksSinceLaunch || 0;
  const decayFactor = Math.max(0.5, 1 - weeksSinceLaunch * 0.003); // 每周衰减0.3%，最低50%
  growth *= decayFactor;
  
  // 添加随机波动 ±15%（减少随机性）
  const randomFactor = 0.85 + Math.random() * 0.3;
  growth *= randomFactor;
  
  return Math.round(growth);
}

// 计算产品月收入
export function calculateMonthlyRevenue(product, teamAbilities) {
  // 基础收入 = DAU × 变现系数
  const monetization = MONETIZATION_METHODS[product.monetization];
  const baseRevenue = product.dau * monetization.revenuePerDAU;
  
  // 商业能力影响收入转化
  const businessFactor = teamAbilities.business / 50;
  
  // 用户评价影响付费意愿
  const ratingFactor = product.userRating / 3;
  
  const revenue = baseRevenue * businessFactor * ratingFactor;
  
  return Math.round(revenue);
}

// 计算用户评价（1-5星）
export function calculateUserRating(product, teamAbilities, developmentQuality) {
  // 基础评分（基于开发质量）
  let rating = developmentQuality; // 1-5
  
  // 美术能力影响UI/UX体验
  const artBonus = (teamAbilities.art - 50) / 100; // ±0.5
  rating += artBonus;
  
  // 产品等级自带评分加成
  const gradeBonus = {
    'C': 0,
    'B': 0.3,
    'A': 0.6,
    'S': 1.0
  };
  rating += gradeBonus[product.grade] || 0;
  
  // 限制在1-5范围内
  rating = Math.max(1, Math.min(5, rating));
  
  return Math.round(rating * 10) / 10; // 保留一位小数
}

// 计算运营成本 - 降低运营成本使游戏更容易生存
export function calculateOperatingCost(product) {
  // 每千个DAU的月运营成本（已降低）
  const costPer1000DAU = {
    'C': 50,    // C级产品运营成本低
    'B': 100,   // B级降低
    'A': 150,   // A级降低
    'S': 250    // S级降低
  };
  
  const baseCost = costPer1000DAU[product.grade] || 50;
  const cost = (product.dau / 1000) * baseCost;
  
  return Math.round(cost);
}

// 推广效果
export const PROMOTION_METHODS = {
  social: {
    id: 'social',
    name: '朋友圈推广',
    cost: 5000,
    dauBoost: 500,
    description: '在社交网络推广，获得500 DAU'
  },
  search: {
    id: 'search',
    name: '搜索引擎广告',
    cost: 20000,
    dauBoost: 3000,
    description: '搜索引擎投放广告，获得3000 DAU'
  },
  tv: {
    id: 'tv',
    name: '电视广告',
    cost: 50000,
    dauBoost: 10000,
    description: '电视广告投放，获得10000 DAU'
  }
};

// 应用推广效果
export function applyPromotion(product, promotionType) {
  const promotion = PROMOTION_METHODS[promotionType];
  if (!promotion) return product;
  
  // 增加DAU
  product.dau += promotion.dauBoost;
  
  return product;
}

// 产品升级效果
export function applyUpgrade(product, upgradeQuality) {
  // 升级质量：1-3（快速/平衡/精益）
  const qualityBonus = {
    1: 0.1,   // 快速方案：10%提升
    2: 0.25,  // 平衡方案：25%提升
    3: 0.5    // 精益方案：50%提升
  };
  
  const bonus = qualityBonus[upgradeQuality] || 0.25;
  
  // 提升基础增长率（重置部分衰减）
  product.weeksSinceLaunch = Math.max(0, product.weeksSinceLaunch - 20);
  
  // 提升用户评价
  product.userRating = Math.min(5, product.userRating + bonus);
  
  return product;
}

// 团队能力计算（多人协作加成）
export function calculateTeamAbilities(employees) {
  if (employees.length === 0) {
    return { programming: 0, art: 0, business: 0 };
  }
  
  // 计算平均能力
  let totalProgramming = 0;
  let totalArt = 0;
  let totalBusiness = 0;
  
  employees.forEach(emp => {
    totalProgramming += emp.programming;
    totalArt += emp.art;
    totalBusiness += emp.business;
  });
  
  const avgProgramming = totalProgramming / employees.length;
  const avgArt = totalArt / employees.length;
  const avgBusiness = totalBusiness / employees.length;
  
  // 协作加成
  const teamBonus = {
    1: 1.0,   // 1人无加成
    2: 1.05,  // 2人105%
    3: 1.10,  // 3人110%
    4: 1.12,  // 4人112%
    5: 1.13   // 5人及以上113%
  };
  
  const bonus = teamBonus[Math.min(5, employees.length)] || 1.13;
  
  return {
    programming: Math.round(avgProgramming * bonus),
    art: Math.round(avgArt * bonus),
    business: Math.round(avgBusiness * bonus)
  };
}

// 更新产品每周数据
export function updateProductWeekly(product, employees) {
  // 计算团队能力
  const teamAbilities = calculateTeamAbilities(employees);
  
  // 更新DAU
  const dauGrowth = calculateDAUGrowth(product, teamAbilities);
  product.dau = Math.max(0, product.dau + dauGrowth);
  
  // 更新周龄
  product.weeksSinceLaunch = (product.weeksSinceLaunch || 0) + 1;
  
  // 更新月收入（每4周结算一次）
  if (product.weeksSinceLaunch % 4 === 0) {
    product.monthlyRevenue = calculateMonthlyRevenue(product, teamAbilities);
  }
  
  return product;
}

