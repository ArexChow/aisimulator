// 员工数据系统

// 中文姓名库
const LAST_NAMES = [
  '李', '王', '张', '刘', '陈', '杨', '黄', '赵', '周', '吴',
  '徐', '孙', '马', '朱', '胡', '郭', '何', '林', '罗', '高',
  '郑', '梁', '谢', '宋', '唐', '许', '韩', '冯', '邓', '曹',
  '彭', '曾', '肖', '田', '董', '袁', '潘', '于', '蒋', '蔡',
  '余', '杜', '叶', '程', '苏', '魏', '吕', '丁', '任', '卢'
];

const FIRST_NAMES = [
  '伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军',
  '洋', '勇', '艳', '杰', '娟', '涛', '明', '超', '秀兰', '霞',
  '平', '刚', '桂英', '建华', '文', '辉', '力', '华', '波', '宁',
  '飞', '浩', '鹏', '斌', '亮', '凯', '峰', '龙', '帆', '宇',
  '晨', '悦', '睿', '欣', '雨', '阳', '婷', '佳', '思', '诗',
  '昊', '轩', '然', '涵', '琪', '萌', '晴', '雪', '瑞', '嘉',
  '豪', '俊', '杰', '博', '琳', '薇', '颖', '慧', '敏', '洁',
  '玲', '燕', '梅', '兰', '红', '云', '鑫', '蕾', '倩', '雅',
  '楠', '馨', '萱', '怡', '彤', '晶', '娴', '婉', '莉', '丹',
  '璇', '梦', '菲', '媛', '璐', '莹', '琦', '岚', '茜', '瑶'
];

// 个性系统
export const PERSONALITIES = [
  { 
    id: 'workaholic', 
    name: '工作狂', 
    description: '体力消耗速度-30%',
    effect: { type: 'stamina_cost', value: 0.7 },
    probability: 0.08
  },
  { 
    id: 'genius', 
    name: '天才', 
    description: '所有能力+10%',
    effect: { type: 'ability_boost', value: 1.1 },
    probability: 0.05
  },
  { 
    id: 'efficient', 
    name: '高效', 
    description: '工作效率+20%',
    effect: { type: 'efficiency', value: 1.2 },
    probability: 0.10
  },
  { 
    id: 'lazy', 
    name: '懒散', 
    description: '体力消耗速度+20%',
    effect: { type: 'stamina_cost', value: 1.2 },
    probability: 0.12
  },
  { 
    id: 'passionate', 
    name: '热情', 
    description: '摸鱼概率-50%',
    effect: { type: 'slack_resistance', value: 0.5 },
    probability: 0.10
  },
  { 
    id: 'pessimistic', 
    name: '悲观', 
    description: '摸鱼概率+30%',
    effect: { type: 'slack_prone', value: 1.3 },
    probability: 0.08
  },
  { 
    id: 'programmer', 
    name: '技术宅', 
    description: '编程能力+15',
    effect: { type: 'skill_boost', skill: 'programming', value: 15 },
    probability: 0.08
  },
  { 
    id: 'designer', 
    name: '艺术家', 
    description: '美术能力+15',
    effect: { type: 'skill_boost', skill: 'art', value: 15 },
    probability: 0.08
  },
  { 
    id: 'businessman', 
    name: '商业精英', 
    description: '商业能力+15',
    effect: { type: 'skill_boost', skill: 'business', value: 15 },
    probability: 0.08
  },
  { 
    id: 'allrounder', 
    name: '全能', 
    description: '所有能力+5',
    effect: { type: 'all_boost', value: 5 },
    probability: 0.06
  },
  { 
    id: 'normal', 
    name: '普通', 
    description: '没有特殊效果',
    effect: { type: 'none' },
    probability: 0.17
  }
];

// 招聘渠道
export const RECRUITMENT_CHANNELS = {
  friend: {
    id: 'friend',
    name: '朋友介绍',
    cost: 0,
    description: '免费但候选人能力较低',
    abilityRange: { min: 20, max: 45 }
  },
  website: {
    id: 'website',
    name: '招聘网站',
    cost: 5000,
    description: '中等费用，候选人能力中等',
    abilityRange: { min: 35, max: 65 }
  },
  headhunter: {
    id: 'headhunter',
    name: '猎头公司',
    cost: 20000,
    description: '高额费用，候选人能力较高',
    abilityRange: { min: 55, max: 85 }
  }
};

// 生成随机姓名
export function generateRandomName() {
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  return lastName + firstName;
}

// 生成随机个性
export function generateRandomPersonality() {
  const rand = Math.random();
  let cumulative = 0;
  
  for (const personality of PERSONALITIES) {
    cumulative += personality.probability;
    if (rand <= cumulative) {
      return { ...personality };
    }
  }
  
  return { ...PERSONALITIES[PERSONALITIES.length - 1] }; // 默认返回普通
}

// 根据能力计算月薪 - 调整工资基数使游戏更平衡
export function calculateSalary(programming, art, business) {
  const avgAbility = (programming + art + business) / 3;
  // 基础薪资 = 平均能力 * 80（降低基数）+ 随机浮动
  const baseSalary = avgAbility * 80;
  const randomFactor = 0.9 + Math.random() * 0.2; // 0.9-1.1倍
  return Math.round(baseSalary * randomFactor / 100) * 100; // 四舍五入到百位
}

// 应用个性效果到能力值
export function applyPersonalityToAbilities(programming, art, business, personality) {
  let p = programming;
  let a = art;
  let b = business;
  
  if (personality.effect.type === 'ability_boost') {
    p = Math.round(p * personality.effect.value);
    a = Math.round(a * personality.effect.value);
    b = Math.round(b * personality.effect.value);
  } else if (personality.effect.type === 'skill_boost') {
    if (personality.effect.skill === 'programming') p += personality.effect.value;
    if (personality.effect.skill === 'art') a += personality.effect.value;
    if (personality.effect.skill === 'business') b += personality.effect.value;
  } else if (personality.effect.type === 'all_boost') {
    p += personality.effect.value;
    a += personality.effect.value;
    b += personality.effect.value;
  }
  
  // 限制在20-95范围内
  p = Math.max(20, Math.min(95, p));
  a = Math.max(20, Math.min(95, a));
  b = Math.max(20, Math.min(95, b));
  
  return { programming: p, art: a, business: b };
}

// 生成候选人
export function generateCandidate(channel, customName = null) {
  const channelData = RECRUITMENT_CHANNELS[channel];
  const range = channelData.abilityRange;
  
  // 生成基础能力值
  let programming = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  let art = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  let business = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  
  // 生成个性
  const personality = generateRandomPersonality();
  
  // 应用个性效果
  const abilities = applyPersonalityToAbilities(programming, art, business, personality);
  
  // 生成姓名
  const name = customName || generateRandomName();
  
  // 生成初始体力（60-100）
  const stamina = Math.floor(Math.random() * 41) + 60;
  
  // 计算月薪
  const salary = calculateSalary(abilities.programming, abilities.art, abilities.business);
  
  return {
    id: Date.now() * 1000 + Math.floor(Math.random() * 1000), // 临时ID（整数，避免小数点）
    name,
    programming: abilities.programming,
    art: abilities.art,
    business: abilities.business,
    stamina,
    maxStamina: 100,
    personality,
    salary,
    status: 'idle', // idle, working, slacking
    workingOn: null, // 正在工作的产品ID
    hireDate: null, // 雇佣日期（周数）
    lastPepTalkWeek: -999 // 上次画大饼的周数
  };
}

// 生成多个候选人
export function generateCandidates(channel, count = 3) {
  const candidates = [];
  for (let i = 0; i < count; i++) {
    candidates.push(generateCandidate(channel));
  }
  return candidates;
}

// 创建初始员工（公司创建时）
export function createInitialEmployee(companyName) {
  const name = generateRandomName();
  const personality = { 
    id: 'passionate', 
    name: '热情', 
    description: '摸鱼概率-50%',
    effect: { type: 'slack_resistance', value: 0.5 }
  };
  
  return {
    id: 'initial_' + Date.now(),
    name,
    programming: 50,
    art: 50,
    business: 50,
    stamina: 100,
    maxStamina: 100,
    personality,
    salary: 8000,
    status: 'idle',
    workingOn: null,
    hireDate: 0,
    lastPepTalkWeek: -999
  };
}

// 计算解雇赔偿金
export function calculateSeverancePay(employee, currentWeek) {
  const weeksWorked = currentWeek - employee.hireDate;
  const monthsWorked = Math.ceil(weeksWorked / 4); // 4周=1个月
  const compensationMonths = Math.max(1, monthsWorked); // 至少1个月
  return employee.salary * compensationMonths;
}

