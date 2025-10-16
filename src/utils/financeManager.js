// 资金管理系统

import { calculateOperatingCost, calculateMonthlyRevenue, PROMOTION_METHODS } from '@/data/growthRules';
import { calculateMonthlySalaries } from './employeeManager';

// 融资配置 - 调整融资参数使游戏更平衡
export const FINANCING_CONFIG = {
  amount: 30000,        // 每次融资金额（从10000增加到30000）
  maxTimes: 8,          // 最多融资次数（从5增加到8）
  cooldown: 8           // 冷却周数（从12减少到8，2个月）
};

// 计算本周收入
export function calculateWeeklyIncome(products, employees) {
  let totalRevenue = 0;
  
  // 计算所有运营中产品的收入
  products.forEach(product => {
    if (product.status === 'operating') {
      // 每周收入 = 月收入 / 4
      const weeklyRevenue = product.monthlyRevenue / 4;
      totalRevenue += weeklyRevenue;
    }
  });
  
  return Math.round(totalRevenue);
}

// 计算本周支出
export function calculateWeeklyExpenses(products, employees) {
  let totalExpenses = 0;
  
  // 员工工资（按周计算：月薪/4）
  const weeklySalaries = calculateMonthlySalaries(employees) / 4;
  totalExpenses += weeklySalaries;
  
  // 产品运营成本（按周计算：月成本/4）
  products.forEach(product => {
    if (product.status === 'operating') {
      const monthlyCost = calculateOperatingCost(product);
      const weeklyCost = monthlyCost / 4;
      totalExpenses += weeklyCost;
    }
  });
  
  return Math.round(totalExpenses);
}

// 结算本周财务
export function settleWeeklyFinance(currentMoney, products, employees) {
  const income = calculateWeeklyIncome(products, employees);
  const expenses = calculateWeeklyExpenses(products, employees);
  const netChange = income - expenses;
  const newMoney = currentMoney + netChange;
  
  return {
    income,
    expenses,
    netChange,
    newMoney,
    profit: netChange > 0
  };
}

// 检查是否破产
export function checkBankruptcy(currentMoney, nextWeekExpenses) {
  // 资金不足以支付下周开支
  return currentMoney < 0 && currentMoney + nextWeekExpenses < 0;
}

// 融资
export function requestFinancing(currentMoney, financingHistory) {
  const { amount, maxTimes, cooldown } = FINANCING_CONFIG;
  
  // 检查融资次数
  if (financingHistory.length >= maxTimes) {
    return {
      success: false,
      message: `已达到最大融资次数（${maxTimes}次）`
    };
  }
  
  // 检查冷却时间
  if (financingHistory.length > 0) {
    const lastFinancing = financingHistory[financingHistory.length - 1];
    const weeksSince = lastFinancing.weeksSince || 0;
    
    if (weeksSince < cooldown) {
      return {
        success: false,
        message: `融资冷却中，还需等待${cooldown - weeksSince}周`
      };
    }
  }
  
  // 融资成功
  return {
    success: true,
    amount,
    newMoney: currentMoney + amount
  };
}

// 推广产品
export function promoteProduct(product, promotionType, currentMoney) {
  const promotion = PROMOTION_METHODS[promotionType];
  
  if (!promotion) {
    return {
      success: false,
      message: '无效的推广方式'
    };
  }
  
  // 检查资金
  if (currentMoney < promotion.cost) {
    return {
      success: false,
      message: '资金不足'
    };
  }
  
  // 增加DAU
  product.dau += promotion.dauBoost;
  
  return {
    success: true,
    cost: promotion.cost,
    dauBoost: promotion.dauBoost,
    newMoney: currentMoney - promotion.cost,
    product
  };
}

// 招聘费用
export function hireEmployee(currentMoney, recruitmentCost, employeeSalary) {
  const totalCost = recruitmentCost;
  
  if (currentMoney < totalCost) {
    return {
      success: false,
      message: '资金不足'
    };
  }
  
  return {
    success: true,
    cost: totalCost,
    newMoney: currentMoney - totalCost
  };
}

// 解雇赔偿
export function fireEmployeeCost(currentMoney, severancePay) {
  if (currentMoney < severancePay) {
    return {
      success: false,
      message: '资金不足支付赔偿金'
    };
  }
  
  return {
    success: true,
    cost: severancePay,
    newMoney: currentMoney - severancePay
  };
}

// 培训费用
export function trainEmployeeCost(currentMoney, trainingType) {
  const costs = {
    programming: 10000,
    art: 10000,
    business: 10000,
    all: 25000
  };
  
  const cost = costs[trainingType] || 10000;
  
  if (currentMoney < cost) {
    return {
      success: false,
      message: '资金不足'
    };
  }
  
  return {
    success: true,
    cost,
    newMoney: currentMoney - cost
  };
}

// 获取资金状态
export function getMoneyStatus(money) {
  if (money < 10000) return 'danger';   // 危险
  if (money < 30000) return 'warning';  // 警告
  return 'safe';                        // 安全
}

// 格式化金额显示
export function formatMoney(amount) {
  if (amount >= 10000) {
    return (amount / 10000).toFixed(1) + '万';
  }
  return amount.toFixed(0);
}

// 计算盈利能力（每周净利润）
export function calculateProfitability(products, employees) {
  const weeklyIncome = calculateWeeklyIncome(products, employees);
  const weeklyExpenses = calculateWeeklyExpenses(products, employees);
  return weeklyIncome - weeklyExpenses;
}

// 预测未来N周的资金状况
export function predictFutureFinance(currentMoney, products, employees, weeks) {
  const weeklyProfit = calculateProfitability(products, employees);
  const predictions = [];
  
  for (let i = 1; i <= weeks; i++) {
    const predictedMoney = currentMoney + (weeklyProfit * i);
    predictions.push({
      week: i,
      money: predictedMoney,
      status: getMoneyStatus(predictedMoney)
    });
  }
  
  return predictions;
}

// 计算产品投资回报率
export function calculateProductROI(product, developmentCost) {
  const totalRevenue = product.monthlyRevenue * (product.weeksSinceLaunch / 4);
  const roi = ((totalRevenue - developmentCost) / developmentCost) * 100;
  return Math.round(roi);
}

// 获取财务报表
export function getFinancialReport(products, employees, history) {
  const totalIncome = history.reduce((sum, record) => sum + (record.income || 0), 0);
  const totalExpenses = history.reduce((sum, record) => sum + (record.expenses || 0), 0);
  const netProfit = totalIncome - totalExpenses;
  
  const currentWeeklyIncome = calculateWeeklyIncome(products, employees);
  const currentWeeklyExpenses = calculateWeeklyExpenses(products, employees);
  
  return {
    totalIncome: Math.round(totalIncome),
    totalExpenses: Math.round(totalExpenses),
    netProfit: Math.round(netProfit),
    currentWeeklyIncome: Math.round(currentWeeklyIncome),
    currentWeeklyExpenses: Math.round(currentWeeklyExpenses),
    currentProfitability: Math.round(currentWeeklyIncome - currentWeeklyExpenses),
    operatingProducts: products.filter(p => p.status === 'operating').length,
    employeeCount: employees.length
  };
}

