// 新闻事件系统

// 时代里程碑事件
export const ERA_MILESTONES = {
  2000: '🌐 新千年到来，互联网泡沫高峰',
  2001: '💥 互联网泡沫破裂，行业进入寒冬',
  2003: '🦠 非典疫情促进了电商和在线服务发展',
  2005: '📱 Web 2.0时代来临，用户生成内容兴起',
  2007: '📱 iPhone发布，移动互联网时代拉开序幕',
  2009: '💰 4G网络开始普及',
  2010: '📲 移动支付开始流行',
  2011: '📱 微信诞生，改变了社交方式',
  2012: '🎮 移动游戏市场爆发',
  2014: '🚗 O2O模式成为热点',
  2015: '📹 短视频平台崛起',
  2016: '🤖 人工智能成为焦点',
  2017: '🔥 共享经济进入黄金期',
  2018: '💎 区块链和加密货币热潮',
  2019: '📱 5G时代开始',
  2020: '🏠 疫情推动远程办公普及',
  2021: '🌟 元宇宙概念爆火',
  2022: '🤖 ChatGPT引发AI革命',
  2023: '🚀 大模型竞赛白热化'
}

// 市场趋势事件（按时代分类）
export const MARKET_TRENDS = {
  pc: [
    '📊 搜索引擎流量成为互联网入口',
    '💻 开源软件运动蓬勃发展',
    '🎮 网络游戏开始流行',
    '📰 门户网站竞争激烈',
    '💬 即时通讯成为刚需',
    '🛒 电子商务逐渐被接受',
    '📱 博客成为主流表达方式',
    '🎵 数字音乐颠覆传统唱片业'
  ],
  mobile: [
    '📱 App Store生态繁荣',
    '💰 移动支付改变消费习惯',
    '🍔 外卖市场快速增长',
    '🚗 网约车改变出行方式',
    '📹 直播经济兴起',
    '🎬 短视频席卷全网',
    '🛍️ 社交电商成为新趋势',
    '🏠 共享经济模式创新'
  ],
  ai: [
    '🤖 AI助手进入千家万户',
    '🎨 AI绘画工具爆火',
    '💬 大语言模型能力飙升',
    '🚀 自动驾驶技术突破',
    '🏥 AI医疗诊断应用广泛',
    '📚 个性化教育AI普及',
    '🎮 AI游戏NPC更加智能',
    '💼 企业AI化转型加速'
  ]
}

// 竞争对手动态
export const COMPETITOR_EVENTS = [
  '🏢 某竞争对手获得千万融资',
  '📈 行业领头羊用户量突破千万',
  '💡 新创公司推出创新功能',
  '🎯 某大厂进军这个领域',
  '📉 某知名产品宣布关闭',
  '🤝 两家公司宣布战略合并',
  '🌟 某产品获得年度最佳应用',
  '💰 某公司完成IPO上市'
]

// 政策法规事件
export const POLICY_EVENTS = [
  '📜 新的互联网管理条例出台',
  '🔒 隐私保护法规更新',
  '💳 电子支付监管加强',
  '🎮 游戏防沉迷系统升级',
  '📱 应用商店审核标准提高',
  '🌐 跨境数据传输新规发布',
  '💰 税收优惠政策支持科技企业',
  '🏢 创业园区扶持政策出台'
]

// 用户行为趋势
export const USER_BEHAVIOR_EVENTS = [
  '📊 用户平均在线时长增加',
  '💸 用户付费意愿提升',
  '🎯 年轻用户群体扩大',
  '📱 下沉市场潜力巨大',
  '🌙 夜间流量高峰显现',
  '👴 银发族成为新增长点',
  '🎮 用户对内容质量要求提高',
  '🔒 用户隐私意识增强'
]

// 技术创新事件
export const TECH_INNOVATION_EVENTS = [
  '⚡ 新的前端框架发布',
  '☁️ 云计算成本大幅下降',
  '🔐 新的加密技术突破',
  '📶 网络带宽大幅提升',
  '💾 存储成本持续降低',
  '🖥️ 新一代服务器架构问世',
  '🌐 CDN服务覆盖更广',
  '🔧 开发工具效率提升'
]

// 员工相关事件
export const EMPLOYEE_EVENTS = [
  '💼 行业平均薪资上涨',
  '🎓 技术人才竞争加剧',
  '🏢 大厂开始裁员',
  '💡 创业热情高涨',
  '📚 新的技能培训课程火爆',
  '🎯 远程工作模式流行',
  '⚖️ 加班文化引发讨论',
  '🌟 00后开始进入职场'
]

// 根据当前年份和时代生成随机新闻
export function generateRandomNews(year, currentEra) {
  const random = Math.random()
  
  // 30%概率：市场趋势
  if (random < 0.3) {
    const trends = MARKET_TRENDS[currentEra]
    return trends[Math.floor(Math.random() * trends.length)]
  }
  
  // 20%概率：竞争对手
  if (random < 0.5) {
    return COMPETITOR_EVENTS[Math.floor(Math.random() * COMPETITOR_EVENTS.length)]
  }
  
  // 15%概率：政策法规
  if (random < 0.65) {
    return POLICY_EVENTS[Math.floor(Math.random() * POLICY_EVENTS.length)]
  }
  
  // 15%概率：用户行为
  if (random < 0.8) {
    return USER_BEHAVIOR_EVENTS[Math.floor(Math.random() * USER_BEHAVIOR_EVENTS.length)]
  }
  
  // 10%概率：技术创新
  if (random < 0.9) {
    return TECH_INNOVATION_EVENTS[Math.floor(Math.random() * TECH_INNOVATION_EVENTS.length)]
  }
  
  // 10%概率：员工相关
  return EMPLOYEE_EVENTS[Math.floor(Math.random() * EMPLOYEE_EVENTS.length)]
}

// 检查并生成里程碑事件
export function checkMilestoneEvent(year) {
  return ERA_MILESTONES[year] || null
}

// 根据产品表现生成特殊新闻
export function generateProductNews(product) {
  const news = []
  
  // DAU突破
  if (product.dau >= 10000 && product.dau < 15000) {
    news.push(`🎉 ${product.name} DAU突破1万，进入快速增长期`)
  } else if (product.dau >= 100000 && product.dau < 150000) {
    news.push(`🚀 ${product.name} DAU突破10万，成为现象级产品`)
  } else if (product.dau >= 1000000) {
    news.push(`⭐ ${product.name} DAU突破100万，跻身行业头部`)
  }
  
  // 收入里程碑
  if (product.monthlyRevenue >= 10000 && product.monthlyRevenue < 20000) {
    news.push(`💰 ${product.name} 月收入突破1万元`)
  } else if (product.monthlyRevenue >= 100000 && product.monthlyRevenue < 200000) {
    news.push(`💎 ${product.name} 月收入突破10万元`)
  } else if (product.monthlyRevenue >= 1000000) {
    news.push(`🏆 ${product.name} 月收入突破100万元`)
  }
  
  // 评价变化
  if (product.userRating >= 4.5) {
    news.push(`🌟 ${product.name} 获得用户高度好评，评分达到${product.userRating.toFixed(1)}`)
  } else if (product.userRating <= 2.0) {
    news.push(`⚠️ ${product.name} 用户评价下滑，需要改进`)
  }
  
  return news
}

// 生成公司成立新闻（游戏开始）
export function generateCompanyFoundedNews(companyInfo) {
  const { name, year, founder, initialFunds } = companyInfo
  
  return `🎊 ${year}年，${founder}创立了${name}，初始资金¥${initialFunds.toLocaleString()}，开启创业征程！`
}

// 生成员工相关新闻
export function generateEmployeeNews(employee, eventType) {
  switch (eventType) {
    case 'join':
      return `👋 ${employee.name}加入了团队，月薪¥${employee.salary}`
    case 'fire':
      return `👋 ${employee.name}离开了公司`
    case 'slack':
      return `😴 ${employee.name}开始摸鱼，工作效率下降`
    case 'recover':
      return `💪 ${employee.name}恢复了工作状态`
    case 'training':
      return `📚 ${employee.name}完成了培训，能力得到提升`
    default:
      return `${employee.name}的状态发生了变化`
  }
}

