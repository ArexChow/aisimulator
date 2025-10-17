// 新闻事件系统
// 注意：市场动态新闻已改为100% AI生成，不再使用预制新闻数据

// 时代里程碑事件（重要历史节点，保留作为游戏背景）
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

