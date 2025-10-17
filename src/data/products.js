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
  healthcare: { name: '医疗', icon: '🏥' },
  lifestyle: { name: '生活', icon: '🏠' },
  transport: { name: '出行', icon: '🚗' },
  other: { name: '其他', icon: '⭐' }
};

// PC互联网时代产品 (2000-2010)
const PC_ERA_PRODUCTS = [
  {
    id: 'im_software',
    name: '即时通讯软件',
    description: '让用户可以在线聊天、发送文件的软件',
    category: 'social',
    grade: 'S', // QQ类产品，最终成为国民级应用
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
    grade: 'B', // 中等用户基数
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
    grade: 'B', // 中等用户基数
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
    grade: 'S', // 百度/Google级别的国民级产品
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
    grade: 'S', // 支付宝级别的国民级产品
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
    grade: 'A', // B站/优酷级别的高用户基数
    year: 2006,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'ad'
  },
  {
    id: 'weibo',
    name: '微博平台',
    description: '社交媒体和信息分享平台',
    category: 'social',
    grade: 'A', // 微博级别的高用户基数
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
  // 游戏类扩充
  {
    id: 'mmorpg',
    name: 'MMORPG网游',
    description: '大型多人在线角色扮演游戏',
    category: 'game',
    grade: 'A',
    year: 2004,
    minEmployees: 3,
    recommendedEmployees: 4,
    defaultMonetization: 'subscription'
  },
  {
    id: 'casual_game',
    name: '休闲小游戏平台',
    description: '网页小游戏集合平台',
    category: 'game',
    grade: 'C',
    year: 2005,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'ad'
  },
  {
    id: 'web_game',
    name: '网页游戏平台',
    description: '基于网页的在线游戏',
    category: 'game',
    grade: 'B',
    year: 2008,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'ad'
  },
  // 金融类扩充
  {
    id: 'online_banking',
    name: '网银系统',
    description: '在线银行服务系统',
    category: 'fintech',
    grade: 'B',
    year: 2002,
    minEmployees: 3,
    recommendedEmployees: 4,
    defaultMonetization: 'subscription'
  },
  {
    id: 'stock_trading',
    name: '股票交易软件',
    description: '在线炒股交易平台',
    category: 'fintech',
    grade: 'B',
    year: 2003,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'subscription'
  },
  // 教育类扩充
  {
    id: 'online_exam',
    name: '在线题库系统',
    description: '在线刷题和考试平台',
    category: 'education',
    grade: 'C',
    year: 2006,
    minEmployees: 1,
    recommendedEmployees: 2,
    defaultMonetization: 'subscription'
  },
  {
    id: 'distance_learning',
    name: '远程教育平台',
    description: '在线视频课程学习平台',
    category: 'education',
    grade: 'B',
    year: 2008,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'subscription'
  },
  // 内容类扩充
  {
    id: 'online_novel',
    name: '网络小说平台',
    description: '在线小说阅读和创作平台',
    category: 'content',
    grade: 'B',
    year: 2004,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'subscription'
  },
  {
    id: 'ebook_reader',
    name: '电子书阅读器',
    description: '数字图书阅读软件',
    category: 'content',
    grade: 'C',
    year: 2007,
    minEmployees: 1,
    recommendedEmployees: 2,
    defaultMonetization: 'paid'
  },
  {
    id: 'photo_sharing',
    name: '图片分享社区',
    description: '用户上传和分享照片的社区',
    category: 'content',
    grade: 'B',
    year: 2009,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'ad'
  },
  // 媒体类扩充
  {
    id: 'podcast_platform',
    name: '播客平台',
    description: '音频节目发布和收听平台',
    category: 'media',
    grade: 'C',
    year: 2005,
    minEmployees: 1,
    recommendedEmployees: 2,
    defaultMonetization: 'ad'
  },
  {
    id: 'online_radio',
    name: '网络电台',
    description: '在线音乐电台服务',
    category: 'media',
    grade: 'C',
    year: 2006,
    minEmployees: 1,
    recommendedEmployees: 2,
    defaultMonetization: 'ad'
  },
  // 出行物流类
  {
    id: 'logistics_system',
    name: '物流管理系统',
    description: '快递物流跟踪管理',
    category: 'transport',
    grade: 'B',
    year: 2008,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'subscription'
  }
];

// 移动互联网时代产品 (2011-2020)
const MOBILE_ERA_PRODUCTS = [
  {
    id: 'mobile_im',
    name: '移动聊天应用',
    description: '手机上的即时通讯应用',
    category: 'social',
    grade: 'S', // 微信级别的国民级应用
    year: 2011,
    minEmployees: 3,
    recommendedEmployees: 4,
    defaultMonetization: 'ad'
  },
  {
    id: 'ride_hailing',
    name: '网约车平台',
    description: '打车出行服务平台',
    category: 'other',
    grade: 'A', // 滴滴级别的高用户基数
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
    grade: 'A', // 美团外卖/饿了么级别的高用户基数
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
    grade: 'A', // 网易云音乐/QQ音乐级别的高用户基数
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
    grade: 'S', // 抖音/快手级别的国民级应用
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
    grade: 'A', // 小红书级别的高用户基数
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
    grade: 'A', // 拼多多级别的高用户基数
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
  },
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
    grade: 'B', // 技术工具类产品，中等用户基数
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
  // 游戏类扩充
  {
    id: 'casual_mobile_game',
    name: '休闲手游',
    description: '轻度休闲手机游戏',
    category: 'game',
    grade: 'C',
    year: 2012,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'ad'
  },
  {
    id: 'card_game',
    name: '卡牌手游',
    description: '收集养成类卡牌游戏',
    category: 'game',
    grade: 'B',
    year: 2014,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'subscription'
  },
  {
    id: 'sandbox_game',
    name: '沙盒创造游戏',
    description: '自由创造类手机游戏',
    category: 'game',
    grade: 'A',
    year: 2016,
    minEmployees: 3,
    recommendedEmployees: 4,
    defaultMonetization: 'ad'
  },
  // 金融类扩充
  {
    id: 'mobile_payment',
    name: '移动支付',
    description: '手机扫码支付工具',
    category: 'fintech',
    grade: 'S', // 支付宝/微信支付级别的国民级应用
    year: 2011,
    minEmployees: 3,
    recommendedEmployees: 4,
    defaultMonetization: 'ad'
  },
  {
    id: 'wealth_management',
    name: '互联网理财',
    description: '手机理财投资平台',
    category: 'fintech',
    grade: 'B',
    year: 2013,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'ad'
  },
  {
    id: 'p2p_lending',
    name: 'P2P借贷平台',
    description: '个人对个人借贷平台',
    category: 'fintech',
    grade: 'B',
    year: 2014,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'ad'
  },
  {
    id: 'digital_wallet',
    name: '数字钱包',
    description: '电子钱包和支付管理',
    category: 'fintech',
    grade: 'B',
    year: 2016,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'ad'
  },
  // 教育类扩充
  {
    id: 'vocabulary_app',
    name: '背单词APP',
    description: '英语单词记忆应用',
    category: 'education',
    grade: 'C',
    year: 2012,
    minEmployees: 1,
    recommendedEmployees: 2,
    defaultMonetization: 'subscription'
  },
  {
    id: 'k12_tutoring',
    name: 'K12在线辅导',
    description: '中小学在线教育平台',
    category: 'education',
    grade: 'A', // 作业帮/猿辅导级别的高用户基数
    year: 2014,
    minEmployees: 3,
    recommendedEmployees: 4,
    defaultMonetization: 'subscription'
  },
  {
    id: 'skill_training',
    name: '职业技能培训',
    description: '在线职业教育平台',
    category: 'education',
    grade: 'B',
    year: 2015,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'subscription'
  },
  {
    id: 'kids_coding',
    name: '儿童编程',
    description: '少儿编程学习平台',
    category: 'education',
    grade: 'B',
    year: 2017,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'subscription'
  },
  // 内容类扩充
  {
    id: 'qa_community',
    name: '知识问答社区',
    description: '知识分享问答平台',
    category: 'content',
    grade: 'B',
    year: 2011,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'ad'
  },
  {
    id: 'news_app',
    name: '新闻资讯APP',
    description: '个性化新闻推荐应用',
    category: 'content',
    grade: 'B',
    year: 2012,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'ad'
  },
  {
    id: 'audiobook_app',
    name: '有声读物APP',
    description: '有声书和广播剧平台',
    category: 'content',
    grade: 'B',
    year: 2015,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'subscription'
  },
  {
    id: 'paid_content',
    name: '内容付费平台',
    description: '知识付费和内容变现',
    category: 'content',
    grade: 'A', // 得到/知识星球级别的高用户基数
    year: 2016,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'subscription'
  },
  // 媒体类扩充
  {
    id: 'live_streaming',
    name: '直播平台',
    description: '视频直播互动平台',
    category: 'media',
    grade: 'A', // 斗鱼/虎牙级别的高用户基数
    year: 2014,
    minEmployees: 3,
    recommendedEmployees: 4,
    defaultMonetization: 'ad'
  },
  {
    id: 'audio_social',
    name: '音频社交',
    description: '语音聊天室社交应用',
    category: 'media',
    grade: 'B',
    year: 2017,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'ad'
  },
  {
    id: 'podcast_app',
    name: '播客APP',
    description: '移动播客收听应用',
    category: 'media',
    grade: 'B',
    year: 2018,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'ad'
  },
  // 医疗健康类
  {
    id: 'online_consultation',
    name: '在线问诊',
    description: '移动医疗咨询平台',
    category: 'healthcare',
    grade: 'B',
    year: 2015,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'subscription'
  },
  {
    id: 'health_management',
    name: '健康管理APP',
    description: '运动健康数据管理',
    category: 'healthcare',
    grade: 'C',
    year: 2016,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'subscription'
  },
  // 生活服务类
  {
    id: 'local_social',
    name: '同城社交',
    description: '本地交友社交平台',
    category: 'lifestyle',
    grade: 'B',
    year: 2011,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'ad'
  },
  {
    id: 'secondhand_market',
    name: '二手交易平台',
    description: '闲置物品交易社区',
    category: 'lifestyle',
    grade: 'B',
    year: 2013,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'ad'
  },
  {
    id: 'home_service',
    name: '家政服务平台',
    description: '上门家政预约平台',
    category: 'lifestyle',
    grade: 'B',
    year: 2014,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'ad'
  },
  // 出行物流类
  {
    id: 'bike_sharing',
    name: '共享单车',
    description: '无桩共享单车服务',
    category: 'transport',
    grade: 'A', // ofo/摩拜级别的高用户基数
    year: 2015,
    minEmployees: 3,
    recommendedEmployees: 4,
    defaultMonetization: 'subscription'
  },
  {
    id: 'smart_parking',
    name: '智能停车',
    description: '停车位查询和预约',
    category: 'transport',
    grade: 'C',
    year: 2019,
    minEmployees: 2,
    recommendedEmployees: 3,
    defaultMonetization: 'ad'
  }
];

// 智能物联时代产品 (2021-2030)
const IOT_ERA_PRODUCTS = [
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
  },
  {
    id: 'ai_chat',
    name: 'AI对话系统',
    description: '大语言模型对话应用',
    category: 'tool',
    grade: 'A', // ChatGPT级别的高用户基数
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
  // 游戏类扩充
  {
    id: 'cloud_gaming',
    name: '云游戏平台',
    description: '基于云端的游戏串流服务',
    category: 'game',
    grade: 'A', // 云游戏具有高用户基数潜力
    year: 2021,
    minEmployees: 4,
    recommendedEmployees: 5,
    defaultMonetization: 'subscription'
  },
  {
    id: 'vr_game',
    name: 'VR游戏',
    description: '虚拟现实游戏体验',
    category: 'game',
    grade: 'A', // VR游戏具有高用户基数潜力
    year: 2023,
    minEmployees: 4,
    recommendedEmployees: 5,
    defaultMonetization: 'subscription'
  },
  // 金融类扩充
  {
    id: 'blockchain_wallet',
    name: '区块链钱包',
    description: '加密货币数字钱包',
    category: 'fintech',
    grade: 'B',
    year: 2021,
    minEmployees: 3,
    recommendedEmployees: 4,
    defaultMonetization: 'subscription'
  },
  {
    id: 'crypto_exchange',
    name: '数字货币交易所',
    description: '加密货币交易平台',
    category: 'fintech',
    grade: 'A', // 币安级别的高用户基数
    year: 2022,
    minEmployees: 4,
    recommendedEmployees: 5,
    defaultMonetization: 'ad'
  },
  {
    id: 'ai_investment',
    name: 'AI投顾',
    description: '智能投资理财顾问',
    category: 'fintech',
    grade: 'B',
    year: 2023,
    minEmployees: 3,
    recommendedEmployees: 4,
    defaultMonetization: 'subscription'
  },
  // 教育类扩充
  {
    id: 'ai_tutor',
    name: 'AI家教',
    description: '人工智能个性化辅导',
    category: 'education',
    grade: 'A', // AI教育具有高用户基数潜力
    year: 2023,
    minEmployees: 3,
    recommendedEmployees: 4,
    defaultMonetization: 'subscription'
  },
  {
    id: 'vr_education',
    name: 'VR教学',
    description: '虚拟现实沉浸式教学',
    category: 'education',
    grade: 'B',
    year: 2024,
    minEmployees: 3,
    recommendedEmployees: 4,
    defaultMonetization: 'subscription'
  },
  // 内容类扩充
  {
    id: 'nft_platform',
    name: '数字藏品平台',
    description: 'NFT数字资产交易平台',
    category: 'content',
    grade: 'B',
    year: 2021,
    minEmployees: 3,
    recommendedEmployees: 4,
    defaultMonetization: 'ad'
  },
  {
    id: 'aigc_platform',
    name: 'AIGC创作平台',
    description: 'AI生成内容创作工具',
    category: 'content',
    grade: 'A', // Midjourney/Stable Diffusion级别的高用户基数
    year: 2023,
    minEmployees: 4,
    recommendedEmployees: 5,
    defaultMonetization: 'subscription'
  },
  {
    id: 'ai_video',
    name: 'AI视频生成',
    description: 'AI自动生成视频工具',
    category: 'video',
    grade: 'A', // Sora级别的高用户基数潜力
    year: 2024,
    minEmployees: 4,
    recommendedEmployees: 5,
    defaultMonetization: 'subscription'
  },
  // 媒体类扩充
  {
    id: 'virtual_idol',
    name: '虚拟偶像平台',
    description: '虚拟主播和偶像运营',
    category: 'media',
    grade: 'B',
    year: 2022,
    minEmployees: 3,
    recommendedEmployees: 4,
    defaultMonetization: 'ad'
  },
  {
    id: 'ai_music',
    name: 'AI作曲工具',
    description: '人工智能音乐创作',
    category: 'media',
    grade: 'B',
    year: 2023,
    minEmployees: 3,
    recommendedEmployees: 4,
    defaultMonetization: 'subscription'
  },
  // 医疗健康类
  {
    id: 'ai_diagnosis',
    name: 'AI诊断系统',
    description: '人工智能辅助诊疗',
    category: 'healthcare',
    grade: 'A', // 医疗AI具有高用户基数潜力
    year: 2022,
    minEmployees: 4,
    recommendedEmployees: 5,
    defaultMonetization: 'subscription'
  },
  {
    id: 'smart_wearable',
    name: '智能穿戴平台',
    description: '健康监测智能设备',
    category: 'healthcare',
    grade: 'B',
    year: 2023,
    minEmployees: 3,
    recommendedEmployees: 4,
    defaultMonetization: 'subscription'
  },
  {
    id: 'telemedicine',
    name: '远程医疗',
    description: '在线远程诊疗系统',
    category: 'healthcare',
    grade: 'B',
    year: 2024,
    minEmployees: 3,
    recommendedEmployees: 4,
    defaultMonetization: 'subscription'
  },
  // 生活服务类
  {
    id: 'smart_assistant',
    name: '智能生活助手',
    description: '全场景AI生活管家',
    category: 'lifestyle',
    grade: 'B',
    year: 2022,
    minEmployees: 3,
    recommendedEmployees: 4,
    defaultMonetization: 'subscription'
  },
  {
    id: 'virtual_try_on',
    name: '虚拟试衣',
    description: 'AR虚拟试衣购物',
    category: 'lifestyle',
    grade: 'B',
    year: 2023,
    minEmployees: 3,
    recommendedEmployees: 4,
    defaultMonetization: 'ad'
  },
  // 出行物流类
  {
    id: 'autonomous_taxi',
    name: '无人驾驶出租车',
    description: '自动驾驶出行服务',
    category: 'transport',
    grade: 'S',
    year: 2024,
    minEmployees: 5,
    recommendedEmployees: 5,
    defaultMonetization: 'subscription'
  },
  {
    id: 'drone_delivery',
    name: '无人机配送',
    description: '智能无人机物流',
    category: 'transport',
    grade: 'A', // 未来物流具有高用户基数潜力
    year: 2023,
    minEmployees: 4,
    recommendedEmployees: 5,
    defaultMonetization: 'subscription'
  },
  {
    id: 'flying_taxi',
    name: '空中出租车',
    description: '城市空中交通服务',
    category: 'transport',
    grade: 'S',
    year: 2025,
    minEmployees: 5,
    recommendedEmployees: 5,
    defaultMonetization: 'subscription'
  },
  // 工具类扩充
  {
    id: 'ai_coding',
    name: 'AI编程助手',
    description: '智能代码生成工具',
    category: 'tool',
    grade: 'A', // GitHub Copilot级别的高用户基数
    year: 2023,
    minEmployees: 4,
    recommendedEmployees: 5,
    defaultMonetization: 'subscription'
  },
  {
    id: 'ai_translation',
    name: 'AI实时翻译',
    description: '多语言实时翻译器',
    category: 'tool',
    grade: 'B',
    year: 2024,
    minEmployees: 3,
    recommendedEmployees: 4,
    defaultMonetization: 'subscription'
  }
];

// 合并所有产品
export const ALL_PRODUCTS = [
  ...PC_ERA_PRODUCTS,
  ...MOBILE_ERA_PRODUCTS,
  ...IOT_ERA_PRODUCTS
];

// 时代定义
export const ERAS = {
  PC: { name: 'PC互联网时代', start: 2000, end: 2010 },
  MOBILE: { name: '移动互联网时代', start: 2011, end: 2020 },
  IOT: { name: '智能物联时代', start: 2021, end: 2030 }
};

// 获取当前所处的时代
function getCurrentEra(year) {
  if (year >= ERAS.IOT.start) return 'IOT';
  if (year >= ERAS.MOBILE.start) return 'MOBILE';
  return 'PC';
}

// 获取上一个时代
function getPreviousEra(currentEra) {
  if (currentEra === 'IOT') return 'MOBILE';
  if (currentEra === 'MOBILE') return 'PC';
  return null; // PC时代没有上一个时代
}

// 根据年份获取可用产品（当前时代及之前所有时代）
export function getAvailableProducts(currentYear) {
  const currentEra = getCurrentEra(currentYear);
  
  // 定义每个时代包含的产品
  const eraProducts = {
    PC: PC_ERA_PRODUCTS,
    MOBILE: MOBILE_ERA_PRODUCTS,
    IOT: IOT_ERA_PRODUCTS
  };
  
  let availableProducts = [];
  
  // 根据当前时代，返回该时代及之前所有时代的产品
  if (currentEra === 'PC') {
    // PC时代：只能做PC时代的产品
    availableProducts = [...PC_ERA_PRODUCTS];
  } else if (currentEra === 'MOBILE') {
    // MOBILE时代：可以做PC和MOBILE时代的产品
    availableProducts = [...PC_ERA_PRODUCTS, ...MOBILE_ERA_PRODUCTS];
  } else if (currentEra === 'IOT') {
    // IOT时代：可以做所有三个时代的产品
    availableProducts = [...PC_ERA_PRODUCTS, ...MOBILE_ERA_PRODUCTS, ...IOT_ERA_PRODUCTS];
  }
  
  return availableProducts;
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
export function createProductInstance(templateId, customName, monetization, assignedEmployees, solution, slogan = '', description = '') {
  const template = getProductById(templateId);
  if (!template) return null;
  
  return {
    instanceId: Date.now() + Math.random(),
    templateId: template.id,
    name: customName || template.name,
    slogan: slogan, // AI生成的产品口号
    description: description || template.description, // AI生成的产品描述，或使用模板描述
    category: template.category,
    grade: template.grade,
    logo: PRODUCT_CATEGORIES[template.category].icon, // 产品logo，使用分类图标
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
