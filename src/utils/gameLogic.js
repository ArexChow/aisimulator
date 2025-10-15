// 游戏核心逻辑

// 计算任务进度（基于体力消耗）
export function calculateProgress(currentStamina, totalStamina, solution) {
  const staminaUsed = totalStamina - currentStamina;
  const progressSpeed = solution.progressSpeed || 1.0;
  
  // 进度 = (消耗体力 / 总需求体力) * 进度速度
  const progress = (staminaUsed / solution.stamina) * 100 * progressSpeed;
  
  return Math.min(progress, 100);
}

// 计算Boss战完成度
export function calculateBossCompletion(currentStamina, totalStamina, bossSolution, luck) {
  const staminaUsed = totalStamina - currentStamina;
  const staminaProgress = staminaUsed / bossSolution.stamina;
  
  // 基础完成度
  let completion = bossSolution.baseCompletionRate;
  
  // 体力进度影响（50%权重）
  completion += staminaProgress * 50;
  
  // 质量加成
  completion += bossSolution.qualityBonus;
  
  // 运气影响（±10%随机波动，运气值影响波动范围）
  const luckFactor = (luck - 50) / 100; // -0.5 到 0.5
  const luckBonus = (Math.random() * 20 - 10) + (luckFactor * 10);
  completion += luckBonus;
  
  return Math.max(0, Math.min(100, completion));
}

// 判断Boss战是否成功
export function isBossSuccess(completion, tempUpgrades = []) {
  const threshold = 80;
  
  // 检查是否有冒险家buff
  const hasRiskTaker = tempUpgrades.some(u => u.effect.type === 'risk');
  const adjustedCompletion = hasRiskTaker 
    ? completion + 10 
    : completion;
  
  return adjustedCompletion >= threshold;
}

// 计算产品评级
export function calculateProductGrade(product, completion, luck, tempUpgrades = []) {
  const baseGrade = product.grade;
  let finalGrade = baseGrade;
  
  // 根据完成度和运气调整评级
  let gradeScore = 0;
  
  if (completion >= 95) gradeScore += 2;
  else if (completion >= 90) gradeScore += 1;
  else if (completion >= 85) gradeScore += 0;
  else gradeScore -= 1;
  
  if (luck >= 80) gradeScore += 1;
  else if (luck >= 60) gradeScore += 0;
  else gradeScore -= 1;
  
  // 检查是否有完美主义buff
  const hasPerfectionist = tempUpgrades.some(u => u.effect.type === 'grade_boost');
  if (hasPerfectionist) {
    gradeScore += 1;
  }
  
  // 评级提升或下降
  const grades = ['C', 'B', 'A', 'S'];
  const currentIndex = grades.indexOf(baseGrade);
  const newIndex = Math.max(0, Math.min(grades.length - 1, currentIndex + gradeScore));
  finalGrade = grades[newIndex];
  
  return {
    grade: finalGrade,
    gradeChange: newIndex - currentIndex
  };
}

// 计算奖励晶核
export function calculateReward(product, finalGrade, completion) {
  const gradeRewards = {
    'C': { base: 5, bonus: 2 },
    'B': { base: 15, bonus: 5 },
    'A': { base: 50, bonus: 15 },
    'S': { base: 150, bonus: 30 }
  };
  
  const reward = gradeRewards[finalGrade] || gradeRewards['C'];
  let crystals = reward.base;
  
  // 完成度加成
  if (completion >= 95) {
    crystals += reward.bonus * 2;
  } else if (completion >= 90) {
    crystals += reward.bonus;
  }
  
  return crystals;
}

// 计算失败奖励（安慰奖）
export function calculateFailureReward(product, completion) {
  const baseReward = {
    'C': 2,
    'B': 5,
    'A': 10,
    'S': 15
  };
  
  let crystals = baseReward[product.grade] || 2;
  
  // 如果完成度接近成功，多给一点
  if (completion >= 75) {
    crystals += 3;
  } else if (completion >= 60) {
    crystals += 1;
  }
  
  return crystals;
}

// 生成市场反响描述
export function generateMarketResponse(product, finalGrade, completion) {
  const responses = {
    'S': {
      title: '现象级产品！',
      descriptions: [
        `${product.name}横空出世，震惊业界！`,
        '用户数量呈指数级增长，服务器被挤爆了！',
        '各大媒体争相报道，投资人蜂拥而至。',
        '这款产品改变了整个行业的格局。',
        '你的名字将被写入互联网历史！'
      ],
      emoji: '🏆'
    },
    'A': {
      title: '风靡全国！',
      descriptions: [
        `${product.name}迅速走红，成为现象级应用。`,
        '朋友圈到处都在讨论你的产品。',
        '用户口碑爆棚，日活跃用户突破百万。',
        '获得了多家知名投资机构的青睐。',
        '你成为了行业内的新星！'
      ],
      emoji: '🌟'
    },
    'B': {
      title: '小有名气',
      descriptions: [
        `${product.name}获得了不错的市场反响。`,
        '在垂直领域内获得了一批忠实用户。',
        '虽然不是爆款，但稳定增长。',
        '开始有媒体关注和报道。',
        '为下一个项目积累了宝贵经验。'
      ],
      emoji: '👍'
    },
    'C': {
      title: '勉强及格',
      descriptions: [
        `${product.name}成功上线，但反响平平。`,
        '只有小部分用户在使用。',
        '产品还需要继续打磨和优化。',
        '至少完成了一个完整的产品。',
        '这是一次宝贵的学习经历。'
      ],
      emoji: '📝'
    }
  };
  
  const response = responses[finalGrade] || responses['C'];
  
  return {
    title: response.title,
    emoji: response.emoji,
    description: response.descriptions.join('\n')
  };
}

// 生成失败描述
export function generateFailureResponse(product, completion) {
  let title = '项目失败';
  let description = '';
  let emoji = '😢';
  
  if (completion >= 75) {
    title = '功亏一篑';
    description = `${product.name}差一点就能成功上线...\n体力耗尽，项目被迫中止。\n完成度：${completion.toFixed(1)}%\n\n虽然失败了，但你已经很接近成功了。总结经验，下次一定能做得更好！`;
    emoji = '😔';
  } else if (completion >= 60) {
    title = '半途而废';
    description = `${product.name}在开发过程中遇到了太多困难。\n体力不支，无法继续。\n完成度：${completion.toFixed(1)}%\n\n选择合适的开发方案很重要。记住这次的教训，调整策略再来！`;
    emoji = '😥';
  } else {
    title = '惨遭失败';
    description = `${product.name}的开发严重偏离预期。\n项目早早就陷入困境。\n完成度：${completion.toFixed(1)}%\n\n也许这个项目对现在的你来说太困难了。提升能力后再挑战吧！`;
    emoji = '😭';
  }
  
  return { title, description, emoji };
}

// 应用临时升级对方案的影响
export function applySolutionModifiers(solution, tempUpgrades = []) {
  const modified = { ...solution };
  
  tempUpgrades.forEach(upgrade => {
    switch (upgrade.effect.type) {
      case 'efficiency':
        modified.stamina = Math.round(modified.stamina * upgrade.effect.value);
        break;
      case 'quality':
        modified.qualityImpact *= upgrade.effect.value;
        break;
      case 'speed':
        modified.progressSpeed *= upgrade.effect.value;
        break;
    }
  });
  
  return modified;
}

// 生成Todo列表的随机时间间隔（模拟开发过程）
export function generateTodoTimings(todos, totalTime = 5000) {
  const timings = [];
  const baseInterval = totalTime / todos.length;
  
  todos.forEach((todo, index) => {
    // 添加一些随机性
    const variance = baseInterval * 0.3;
    const delay = baseInterval + (Math.random() * variance * 2 - variance);
    timings.push(Math.round(delay));
  });
  
  return timings;
}

// 验证游戏状态
export function validateGameState(state) {
  if (!state || !state.product || !state.playerStats) {
    return false;
  }
  
  if (state.quarterIndex < 0 || state.quarterIndex > 3) {
    return false;
  }
  
  if (state.playerStats.stamina < 0) {
    return false;
  }
  
  return true;
}

// 比较产品等级
export function compareGrade(grade1, grade2) {
  const grades = ['C', 'B', 'A', 'S'];
  const index1 = grades.indexOf(grade1);
  const index2 = grades.indexOf(grade2);
  
  if (index1 === -1 || index2 === -1) return 0;
  return index1 - index2;
}

