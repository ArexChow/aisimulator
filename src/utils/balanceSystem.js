// 数值平衡系统 - 定义员工能力如何影响产品表现

import { calculateTeamAbilities } from '@/data/growthRules';

// 计算团队对产品的影响
export function calculateTeamImpact(employees, product) {
  if (employees.length === 0) {
    return {
      programming: 0,
      art: 0,
      business: 0,
      teamBonus: 1.0
    };
  }
  
  // 获取团队平均能力（含协作加成）
  const teamAbilities = calculateTeamAbilities(employees);
  
  return teamAbilities;
}

// 计算开发效率（影响研发进度）
export function calculateDevelopmentEfficiency(employees) {
  if (employees.length === 0) return 0;
  
  let totalEfficiency = 0;
  
  employees.forEach(emp => {
    // 基础效率 = 编程能力 / 50（标准值）
    let efficiency = emp.programming / 50;
    
    // 应用个性效果
    if (emp.personality.effect.type === 'efficiency') {
      efficiency *= emp.personality.effect.value;
    }
    
    // 如果在摸鱼，效率为0
    if (emp.status === 'slacking') {
      efficiency = 0;
    }
    
    // 体力影响效率（体力低于50时开始下降）
    if (emp.stamina < 50) {
      const staminaFactor = emp.stamina / 50;
      efficiency *= staminaFactor;
    }
    
    totalEfficiency += efficiency;
  });
  
  // 返回平均效率
  return totalEfficiency / employees.length;
}

// 预测产品发布后的初始表现
export function predictProductPerformance(product, employees, solutionQuality) {
  const teamAbilities = calculateTeamAbilities(employees);
  
  // 基础DAU根据产品等级
  const baseDau = {
    'C': 100,
    'B': 500,
    'A': 2000,
    'S': 10000
  }[product.grade] || 100;
  
  // 方案质量影响
  const qualityMultiplier = {
    1: 0.8,   // 快速方案
    2: 1.0,   // 平衡方案
    3: 1.3    // 精益方案
  }[solutionQuality] || 1.0;
  
  // 编程能力影响
  const programmingFactor = teamAbilities.programming / 50;
  
  // 预测DAU
  const predictedDau = Math.round(baseDau * qualityMultiplier * programmingFactor);
  
  // 预测用户评价
  const baseRating = {
    'C': 2.5,
    'B': 3.0,
    'A': 3.5,
    'S': 4.0
  }[product.grade] || 3.0;
  
  const ratingBonus = (teamAbilities.art - 50) / 100; // ±0.5
  const qualityRatingBonus = (solutionQuality - 1) * 0.3;
  const predictedRating = Math.max(1, Math.min(5, baseRating + ratingBonus + qualityRatingBonus));
  
  return {
    predictedDau,
    predictedRating: Math.round(predictedRating * 10) / 10,
    teamAbilities
  };
}

// 计算升级效果
export function calculateUpgradeEffect(product, employees, upgradeSolution) {
  const teamAbilities = calculateTeamAbilities(employees);
  
  // 升级后的提升幅度
  const upgradeBonus = {
    1: 0.1,   // 快速：10%
    2: 0.25,  // 平衡：25%
    3: 0.5    // 精益：50%
  }[upgradeSolution] || 0.25;
  
  // DAU提升
  const dauIncrease = Math.round(product.dau * upgradeBonus * (teamAbilities.programming / 50));
  
  // 评价提升
  const ratingIncrease = upgradeBonus * (teamAbilities.art / 50);
  
  return {
    dauIncrease,
    ratingIncrease: Math.round(ratingIncrease * 10) / 10,
    newDau: product.dau + dauIncrease,
    newRating: Math.min(5, product.userRating + ratingIncrease)
  };
}

// 评估团队是否适合开发某个产品
export function evaluateTeamFitness(employees, product) {
  if (employees.length < product.minEmployees) {
    return {
      suitable: false,
      reason: `至少需要${product.minEmployees}名员工`,
      score: 0
    };
  }
  
  const teamAbilities = calculateTeamAbilities(employees);
  const avgAbility = (teamAbilities.programming + teamAbilities.art + teamAbilities.business) / 3;
  
  // 根据产品等级评估
  const requiredAbility = {
    'C': 30,
    'B': 45,
    'A': 60,
    'S': 75
  }[product.grade] || 30;
  
  const score = (avgAbility / requiredAbility) * 100;
  
  let suitable = true;
  let reason = '团队能力充足';
  
  if (score < 60) {
    suitable = false;
    reason = '团队能力不足，建议提升员工能力或选择更简单的产品';
  } else if (score < 80) {
    reason = '团队能力勉强够用，产品表现可能不理想';
  } else if (score >= 120) {
    reason = '团队能力过剩，可以挑战更高级的产品';
  }
  
  return {
    suitable,
    reason,
    score: Math.round(score),
    teamAbilities,
    requiredAbility
  };
}

// 计算最佳员工组合（用于推荐）
export function recommendBestTeam(allEmployees, requiredCount) {
  // 按综合能力排序
  const sortedEmployees = [...allEmployees]
    .filter(emp => emp.status === 'idle')
    .sort((a, b) => {
      const avgA = (a.programming + a.art + a.business) / 3;
      const avgB = (b.programming + b.art + b.business) / 3;
      return avgB - avgA;
    });
  
  return sortedEmployees.slice(0, requiredCount);
}

// 计算产品价值（用于决策）
export function calculateProductValue(product) {
  // 综合考虑DAU、收入、用户评价
  const dauScore = product.dau / 1000; // DAU越高越好
  const revenueScore = product.monthlyRevenue / 10000; // 收入越高越好
  const ratingScore = product.userRating; // 评价越高越好
  
  // 加权计算
  const value = dauScore * 0.3 + revenueScore * 0.5 + ratingScore * 0.2;
  
  return Math.round(value * 100) / 100;
}

// 判断产品是否需要升级
export function shouldUpgradeProduct(product) {
  // 用户评价低于3星，建议升级
  if (product.userRating < 3) {
    return {
      should: true,
      reason: '用户评价较低，建议升级改善体验'
    };
  }
  
  // 运营超过26周（半年），DAU开始衰减，建议升级
  if (product.weeksSinceLaunch > 26) {
    return {
      should: true,
      reason: '产品已运营较长时间，建议升级保持竞争力'
    };
  }
  
  return {
    should: false,
    reason: '产品表现良好，暂不需要升级'
  };
}

// 计算人力成本效益比
export function calculateLaborCostEfficiency(employees, products) {
  const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);
  const totalRevenue = products
    .filter(p => p.status === 'operating')
    .reduce((sum, p) => sum + p.monthlyRevenue, 0);
  
  if (totalSalary === 0) return 0;
  
  // 收入/工资比
  const efficiency = totalRevenue / totalSalary;
  
  return Math.round(efficiency * 100) / 100;
}

// 获取能力提升建议
export function getAbilityImprovementSuggestion(employee, targetProduct) {
  const suggestions = [];
  
  // 根据产品类型建议提升相应能力
  const categoryFocus = {
    'social': ['programming', 'art'],
    'ecommerce': ['business', 'programming'],
    'tool': ['programming', 'art'],
    'media': ['art', 'business'],
    'video': ['programming', 'art'],
    'content': ['art', 'business'],
    'game': ['programming', 'art'],
    'education': ['business', 'art'],
    'fintech': ['programming', 'business']
  };
  
  const focusAbilities = categoryFocus[targetProduct?.category] || ['programming', 'art', 'business'];
  
  if (focusAbilities.includes('programming') && employee.programming < 70) {
    suggestions.push({
      type: 'programming',
      reason: '提升编程能力可以提高产品稳定性和DAU增长'
    });
  }
  
  if (focusAbilities.includes('art') && employee.art < 70) {
    suggestions.push({
      type: 'art',
      reason: '提升美术能力可以改善用户评价和留存率'
    });
  }
  
  if (focusAbilities.includes('business') && employee.business < 70) {
    suggestions.push({
      type: 'business',
      reason: '提升商业能力可以提高产品收入和变现效率'
    });
  }
  
  return suggestions;
}

