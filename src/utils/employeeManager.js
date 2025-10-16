// 员工管理系统

// 员工状态常量
export const EMPLOYEE_STATUS = {
  IDLE: 'idle',           // 空闲
  WORKING: 'working',     // 工作中
  SLACKING: 'slacking'    // 摸鱼中
};

// 获取员工状态描述
export function getEmployeeStatusText(employee, products) {
  if (employee.status === EMPLOYEE_STATUS.SLACKING) {
    return '摸鱼中 😴';
  }
  
  if (employee.status === EMPLOYEE_STATUS.WORKING && employee.workingOn) {
    const product = products.find(p => p.instanceId === employee.workingOn);
    if (product) {
      return `开发 ${product.name}`;
    }
    return '工作中';
  }
  
  return '空闲中';
}

// 更新员工每周状态
export function updateEmployeeWeekly(employee, currentWeek) {
  // 只有工作中的员工才消耗体力
  if (employee.status === EMPLOYEE_STATUS.WORKING) {
    // 计算体力消耗
    let staminaCost = 20;
    
    // 应用个性效果
    if (employee.personality.effect.type === 'stamina_cost') {
      staminaCost = Math.round(staminaCost * employee.personality.effect.value);
    }
    
    employee.stamina = Math.max(0, employee.stamina - staminaCost);
    
    // 检查是否进入摸鱼状态
    if (employee.stamina <= 20) {
      checkSlackingCondition(employee);
    }
  }
  
  // 如果在摸鱼，恢复体力
  if (employee.status === EMPLOYEE_STATUS.SLACKING) {
    employee.stamina = Math.min(employee.maxStamina, employee.stamina + 15);
    
    // 体力恢复到100后自动恢复工作
    if (employee.stamina >= employee.maxStamina) {
      employee.status = EMPLOYEE_STATUS.WORKING;
    }
  }
  
  return employee;
}

// 检查摸鱼条件
function checkSlackingCondition(employee) {
  // 基础摸鱼概率50%
  let slackProbability = 0.5;
  
  // 应用个性效果
  if (employee.personality.effect.type === 'slack_resistance') {
    slackProbability *= employee.personality.effect.value;
  } else if (employee.personality.effect.type === 'slack_prone') {
    slackProbability *= employee.personality.effect.value;
  }
  
  // 随机判断是否摸鱼
  if (Math.random() < slackProbability) {
    employee.status = EMPLOYEE_STATUS.SLACKING;
  }
}

// 分配员工到产品
export function assignEmployeeToProduct(employee, productInstanceId) {
  if (employee.status !== EMPLOYEE_STATUS.IDLE) {
    return { success: false, message: '员工当前不可用' };
  }
  
  employee.status = EMPLOYEE_STATUS.WORKING;
  employee.workingOn = productInstanceId;
  
  return { success: true, employee };
}

// 释放员工（产品完成或下架）
export function releaseEmployee(employee) {
  employee.status = EMPLOYEE_STATUS.IDLE;
  employee.workingOn = null;
  
  return employee;
}

// 画大饼（恢复体力）
export function pepTalk(employee, currentWeek) {
  // 检查是否可以画大饼（一周只能一次）
  if (currentWeek - employee.lastPepTalkWeek < 1) {
    return { success: false, message: '本周已经画过大饼了' };
  }
  
  // 恢复体力
  employee.stamina = Math.min(employee.maxStamina, employee.stamina + 30);
  employee.lastPepTalkWeek = currentWeek;
  
  // 如果在摸鱼，立即恢复工作状态
  if (employee.status === EMPLOYEE_STATUS.SLACKING) {
    employee.status = EMPLOYEE_STATUS.WORKING;
  }
  
  return { success: true, employee };
}

// 从工位路过（中断摸鱼）
export function walkBy(employee) {
  if (employee.status !== EMPLOYEE_STATUS.SLACKING) {
    return { success: false, message: '员工没有在摸鱼' };
  }
  
  // 恢复工作状态
  employee.status = EMPLOYEE_STATUS.WORKING;
  
  return { success: true, employee };
}

// 解雇员工
export function fireEmployee(employee, currentWeek) {
  const weeksWorked = currentWeek - employee.hireDate;
  const monthsWorked = Math.ceil(weeksWorked / 4);
  const compensationMonths = Math.max(1, monthsWorked);
  const severancePay = employee.salary * compensationMonths;
  
  return {
    success: true,
    severancePay,
    employee
  };
}

// 计算员工每月工资
export function calculateMonthlySalaries(employees) {
  return employees.reduce((total, emp) => total + emp.salary, 0);
}

// 获取空闲员工列表
export function getIdleEmployees(employees) {
  return employees.filter(emp => emp.status === EMPLOYEE_STATUS.IDLE);
}

// 获取工作中的员工列表
export function getWorkingEmployees(employees) {
  return employees.filter(emp => emp.status === EMPLOYEE_STATUS.WORKING);
}

// 获取摸鱼中的员工列表
export function getSlackingEmployees(employees) {
  return employees.filter(emp => emp.status === EMPLOYEE_STATUS.SLACKING);
}

// 获取参与某个产品开发的员工
export function getProductEmployees(employees, productInstanceId) {
  return employees.filter(emp => emp.workingOn === productInstanceId);
}

// 检查员工是否可以工作（不在摸鱼）
export function isEmployeeWorking(employee) {
  return employee.status === EMPLOYEE_STATUS.WORKING;
}

// 应用个性效果到工作效率
export function applyPersonalityToEfficiency(employee) {
  let efficiency = 1.0;
  
  if (employee.personality.effect.type === 'efficiency') {
    efficiency = employee.personality.effect.value;
  }
  
  return efficiency;
}

// 计算员工综合能力
export function calculateEmployeeOverallAbility(employee) {
  const avg = (employee.programming + employee.art + employee.business) / 3;
  
  // 应用个性加成
  if (employee.personality.effect.type === 'ability_boost') {
    return Math.round(avg * employee.personality.effect.value);
  }
  
  return Math.round(avg);
}

// 培训员工
export function trainEmployee(employee, trainType) {
  const improvement = Math.floor(Math.random() * 6) + 5; // 5-10点提升
  
  switch (trainType) {
    case 'programming':
      employee.programming = Math.min(95, employee.programming + improvement);
      break;
    case 'art':
      employee.art = Math.min(95, employee.art + improvement);
      break;
    case 'business':
      employee.business = Math.min(95, employee.business + improvement);
      break;
    case 'all':
      const allImprovement = Math.floor(improvement / 2); // 全面培训每项提升较少
      employee.programming = Math.min(95, employee.programming + allImprovement);
      employee.art = Math.min(95, employee.art + allImprovement);
      employee.business = Math.min(95, employee.business + allImprovement);
      break;
  }
  
  // 重新计算月薪
  const avgAbility = (employee.programming + employee.art + employee.business) / 3;
  const baseSalary = avgAbility * 100;
  employee.salary = Math.round(baseSalary / 100) * 100;
  
  return employee;
}

