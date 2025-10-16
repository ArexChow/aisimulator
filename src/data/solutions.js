// 产品研发方案

// 研发方案类型
export const SOLUTION_TYPES = {
  quick: {
    id: 'quick',
    name: '快速方案',
    description: '用最快速度完成，采用成熟方案快速上线',
    weeks: 4,
    quality: 1,
    requiredEmployees: 1
  },
  balanced: {
    id: 'balanced',
    name: '平衡方案',
    description: '按照标准流程完成，保证基本质量和稳定性',
    weeks: 8,
    quality: 2,
    requiredEmployees: 2
  },
  quality: {
    id: 'quality',
    name: '精益方案',
    description: '深入打磨细节，追求极致的用户体验',
    weeks: 12,
    quality: 3,
    requiredEmployees: 3
  }
};

// 通用研发任务模板（根据方案类型生成不同数量）
const DEVELOPMENT_TASKS = {
  quick: [
    '需求分析',
    '技术选型',
    '快速原型开发',
    '基础测试',
    '上线部署'
  ],
  balanced: [
    '需求分析',
    '技术方案设计',
    '数据库设计',
    '核心功能开发',
    'UI界面开发',
    '功能测试',
    '性能优化',
    '上线准备',
    '正式发布'
  ],
  quality: [
    '深入需求调研',
    '技术架构设计',
    '数据库设计与优化',
    '核心功能开发',
    '高级功能开发',
    'UI/UX精细设计',
    '用户体验测试',
    '性能压力测试',
    '安全测试',
    '代码审查优化',
    '文档编写',
    '灰度发布',
    '正式上线'
  ]
};

// 升级任务模板
const UPGRADE_TASKS = {
  quick: [
    '分析用户反馈',
    '快速迭代优化',
    '功能修复',
    '版本发布'
  ],
  balanced: [
    '需求整理',
    '新功能开发',
    'Bug修复',
    '性能优化',
    '测试验证',
    '版本升级',
    '用户通知',
    '数据监控'
  ],
  quality: [
    '深度数据分析',
    '用户调研',
    '新功能设计',
    '架构升级',
    '核心优化',
    '全面测试',
    'A/B测试',
    '细节打磨',
    '文档更新',
    '灰度升级',
    '全量发布',
    '效果跟踪'
  ]
};

// 获取研发方案
export function getSolution(solutionType) {
  return SOLUTION_TYPES[solutionType];
}

// 获取所有研发方案
export function getAllSolutions() {
  return Object.values(SOLUTION_TYPES);
}

// 生成研发任务列表
export function generateDevelopmentTasks(solutionType, isUpgrade = false) {
  const tasks = isUpgrade ? UPGRADE_TASKS[solutionType] : DEVELOPMENT_TASKS[solutionType];
  return [...tasks]; // 返回副本
}

// 根据产品等级和方案计算初始用户评价
export function calculateInitialRating(productGrade, solutionQuality) {
  const baseRatings = {
    'C': 2.5,
    'B': 3.0,
    'A': 3.5,
    'S': 4.0
  };
  
  const qualityBonus = {
    1: 0,      // 快速方案无加成
    2: 0.3,    // 平衡方案+0.3
    3: 0.7     // 精益方案+0.7
  };
  
  const rating = baseRatings[productGrade] + qualityBonus[solutionQuality];
  return Math.min(5, Math.max(1, rating));
}

// 根据产品等级和方案计算初始DAU
export function calculateInitialDAU(productGrade, solutionQuality) {
  const baseDau = {
    'C': 100,
    'B': 500,
    'A': 2000,
    'S': 10000
  };
  
  const qualityMultiplier = {
    1: 0.8,    // 快速方案80%
    2: 1.0,    // 平衡方案100%
    3: 1.3     // 精益方案130%
  };
  
  const dau = baseDau[productGrade] * qualityMultiplier[solutionQuality];
  
  // 添加随机波动 ±20%
  const randomFactor = 0.8 + Math.random() * 0.4;
  
  return Math.round(dau * randomFactor);
}

// 检查员工数量是否满足方案需求
export function checkEmployeeRequirement(solutionType, availableEmployees) {
  const solution = SOLUTION_TYPES[solutionType];
  return availableEmployees.length >= solution.requiredEmployees;
}

// 获取方案推荐（根据可用员工数）
export function getRecommendedSolution(availableEmployeesCount) {
  if (availableEmployeesCount >= 3) {
    return 'quality';
  } else if (availableEmployeesCount >= 2) {
    return 'balanced';
  } else {
    return 'quick';
  }
}
