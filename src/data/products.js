// 软件产品数据库 - 按时代分类

// 产品大类
export const PRODUCT_CATEGORIES = {
  social: { name: '社交', icon: '💬' },
  ecommerce: { name: '电商', icon: '🛒' },
  tool: { name: '工具', icon: '🔧' },
  media: { name: '媒体', icon: '🎵' },
  video: { name: '视频', icon: '📹' },
  content: { name: '内容', icon: '📝' },
  game: { name: '游戏', icon: '🎮' },
  education: { name: '教育', icon: '📚' },
  fintech: { name: '金融', icon: '💰' },
  other: { name: '其他', icon: '⭐' }
};

// PC互联网时代产品 (2000-2010)
const PC_ERA_PRODUCTS = [
  {
    id: 'im_software',
    name: '即时通讯软件',
    description: '让用户可以在线聊天、发送文件的软件',
    category: 'social',
    grade: 'C',
    year: 2000,
    minEmployees: 1,
    recommendedEmployees: 2,
    defaultMonetization: 'paid'
  },
  {
    id: 'forum',
    name: '网络论坛',
    description: '用户可以发帖讨论的社区平台',
    category: 'social',
    grade: 'C',
    year: 2001,
    minEmployees: 1,
    recommendedEmployees: 2,
    defaultMonetization: 'paid'
  },
  {
    id: 'blog',
    name: '博客平台',
    description: '个人博客发布和管理系统',
    category: 'content',
    grade: 'C',
    year: 2002,
    minEmployees: 1,
    recommendedEmployees: 2,
    defaultMonetization: 'paid'
  },
  {
    id: 'download_tool',
    name: '下载工具',
    description: '多线程下载管理软件',
    category: 'tool',
    grade: 'C',
    year: 2003,
    minEmployees: 1,
    recommendedEmployees: 2,
    defaultMonetization: 'paid'
  },
  {
    id: 'music_player',
    name: '音乐播放器',
    description: '本地音乐播放和管理软件',
    category: 'media',
    grade: 'C',
    year: 2002,
    minEmployees: 1,
    recommendedEmployees: 2,
    defaultMonetization: 'paid'
  },
  {
    id: 'email_client',
    name: '邮件客户端',
    description: '邮件收发管理软件',
    category: 'tool',
    grade: 'C',
    year: 2001,
    minEmployees: 1,
    recommendedEmployees: 2,
    defaultMonetization: 'paid'
  },
  {
    id: 'antivirus',
    name: '杀毒软件',
    description: '计算机病毒查杀和防护',
    category: 'other',
    grade: 'C',
    year: 2002,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'paid'
  },
  {
    id: 'input_method',
    name: '输入法',
    description: '智能拼音输入法',
    category: 'tool',
    grade: 'C',
    year: 2003,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'paid'
  },
  {
    id: 'search_engine',
    name: '搜索引擎',
    description: '网页搜索服务',
    category: 'other',
    grade: 'A',
    year: 2000,
    minEmployees: 3,
    recommendedEmployees: 4,
    defaultMonetization: 'ad'
  },
  {
    id: 'ecommerce_c2c',
    name: 'C2C电商平台',
    description: '个人之间的在线交易平台',
    category: 'ecommerce',
    grade: 'B',
    year: 2003,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'ad'
  },
  {
    id: 'payment',
    name: '在线支付',
    description: '第三方支付平台',
    category: 'fintech',
    grade: 'A',
    year: 2004,
    minEmployees: 3,
    recommendedEmployees: 4,
    defaultMonetization: 'ad'
  },
  {
    id: 'video_share',
    name: '视频分享网站',
    description: '用户上传和分享视频的平台',
    category: 'video',
    grade: 'B',
    year: 2006,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'ad'
  }
];

// 移动互联网时代产品 (2011-2016)
const MOBILE_ERA_PRODUCTS = [
  {
    id: 'mobile_im',
    name: '移动聊天应用',
    description: '手机上的即时通讯应用',
    category: 'social',
    grade: 'A',
    year: 2011,
    minEmployees: 3,
    recommendedEmployees: 4,
    defaultMonetization: 'ad'
  },
  {
    id: 'weibo',
    name: '微博平台',
    description: '社交媒体和信息分享平台',
    category: 'social',
    grade: 'B',
    year: 2009,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'ad'
  },
  {
    id: 'group_buy',
    name: '团购平台',
    description: '本地生活服务团购',
    category: 'ecommerce',
    grade: 'B',
    year: 2010,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'ad'
  },
  {
    id: 'ride_hailing',
    name: '网约车平台',
    description: '打车出行服务平台',
    category: 'other',
    grade: 'A',
    year: 2012,
    minEmployees: 3,
    recommendedEmployees: 4,
    defaultMonetization: 'ad'
  },
  {
    id: 'food_delivery',
    name: '外卖平台',
    description: '在线订餐配送服务',
    category: 'ecommerce',
    grade: 'B',
    year: 2013,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'ad'
  },
  {
    id: 'online_music',
    name: '在线音乐',
    description: '音乐流媒体平台',
    category: 'media',
    grade: 'B',
    year: 2013,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'subscription'
  },
  {
    id: 'short_video',
    name: '短视频平台',
    description: '短视频拍摄和分享社区',
    category: 'video',
    grade: 'A',
    year: 2016,
    minEmployees: 3,
    recommendedEmployees: 4,
    defaultMonetization: 'ad'
  },
  {
    id: 'lifestyle_share',
    name: '生活分享社区',
    description: '用户分享生活方式的平台',
    category: 'social',
    grade: 'A',
    year: 2013,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'ad'
  },
  {
    id: 'social_ecommerce',
    name: '社交电商',
    description: '社交拼团购物平台',
    category: 'ecommerce',
    grade: 'A',
    year: 2015,
    minEmployees: 3,
    recommendedEmployees: 4,
    defaultMonetization: 'ad'
  },
  {
    id: 'mobile_game',
    name: 'MOBA手游',
    description: '多人在线战术竞技手游',
    category: 'game',
    grade: 'S',
    year: 2015,
    minEmployees: 4,
    recommendedEmployees: 5,
    defaultMonetization: 'ad'
  }
];

// AI时代产品 (2017+)
const AI_ERA_PRODUCTS = [
  {
    id: 'ai_assistant',
    name: 'AI智能助手',
    description: '基于AI的语音助手应用',
    category: 'tool',
    grade: 'B',
    year: 2017,
    minEmployees: 3,
    recommendedEmployees: 4,
    defaultMonetization: 'subscription'
  },
  {
    id: 'global_short_video',
    name: '全球短视频',
    description: '面向全球市场的短视频平台',
    category: 'video',
    grade: 'S',
    year: 2017,
    minEmployees: 4,
    recommendedEmployees: 5,
    defaultMonetization: 'ad'
  },
  {
    id: 'ai_recommendation',
    name: 'AI推荐引擎',
    description: '智能内容推荐系统',
    category: 'tool',
    grade: 'A',
    year: 2018,
    minEmployees: 3,
    recommendedEmployees: 4,
    defaultMonetization: 'subscription'
  },
  {
    id: 'smart_home',
    name: '智能家居平台',
    description: 'IoT智能家居控制系统',
    category: 'tool',
    grade: 'B',
    year: 2018,
    minEmployees: 3,
    recommendedEmployees: 4,
    defaultMonetization: 'subscription'
  },
  {
    id: 'online_education',
    name: '在线教育平台',
    description: 'AI驱动的个性化学习平台',
    category: 'education',
    grade: 'B',
    year: 2019,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'subscription'
  },
  {
    id: 'ai_chat',
    name: 'AI对话系统',
    description: '大语言模型对话应用',
    category: 'tool',
    grade: 'A',
    year: 2022,
    minEmployees: 4,
    recommendedEmployees: 5,
    defaultMonetization: 'subscription'
  },
  {
    id: 'ai_image',
    name: 'AI绘图工具',
    description: 'AI生成图像的创作工具',
    category: 'tool',
    grade: 'B',
    year: 2022,
    minEmployees: 3,
    recommendedEmployees: 4,
    defaultMonetization: 'subscription'
  },
  {
    id: 'metaverse',
    name: '元宇宙平台',
    description: '虚拟世界社交平台',
    category: 'social',
    grade: 'S',
    year: 2021,
    minEmployees: 5,
    recommendedEmployees: 5,
    defaultMonetization: 'subscription'
  }
];

// 合并所有产品
export const ALL_PRODUCTS = [
  ...PC_ERA_PRODUCTS,
  ...MOBILE_ERA_PRODUCTS,
  ...AI_ERA_PRODUCTS
];

// 根据年份获取可用产品
export function getAvailableProducts(currentYear) {
  return ALL_PRODUCTS.filter(product => product.year <= currentYear);
}

// 根据分类获取产品
export function getProductsByCategory(currentYear, category = null) {
  const available = getAvailableProducts(currentYear);
  if (!category) return available;
  return available.filter(product => product.category === category);
}

// 获取当前可用的产品分类
export function getAvailableCategories(currentYear) {
  const available = getAvailableProducts(currentYear);
  const categorySet = new Set(available.map(p => p.category));
  return Array.from(categorySet).map(cat => ({
    id: cat,
    ...PRODUCT_CATEGORIES[cat]
  }));
}

// 根据ID获取产品模板
export function getProductById(productId) {
  return ALL_PRODUCTS.find(p => p.id === productId);
}

// 创建产品实例（用于实际游戏中）
export function createProductInstance(templateId, customName, monetization, assignedEmployees, solution) {
  const template = getProductById(templateId);
  if (!template) return null;
  
  return {
    instanceId: Date.now() + Math.random(),
    templateId: template.id,
    name: customName || template.name,
    description: template.description,
    category: template.category,
    grade: template.grade,
    monetization: monetization || template.defaultMonetization,
    
    // 研发相关
    status: 'developing', // developing, operating, offline
    developmentSolution: solution, // quick, balanced, quality
    assignedEmployees: assignedEmployees, // 员工ID数组
    developmentProgress: 0, // 0-100
    developmentTodos: [], // 待完成的任务列表
    currentTodoIndex: 0,
    
    // 商业数据
    dau: 0,
    monthlyRevenue: 0,
    userRating: 3.0, // 初始3星
    weeksSinceLaunch: 0,
    
    launchDate: null // 上线日期（周数）
  };
}
