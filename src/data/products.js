// 游戏产品数据库 - 30+ 个历史互联网产品
// 等级分布：C级(15个) B级(10个) A级(8个) S级(3个)

export const products = [
  // ========== C级产品 (独立作品、外包产品) ==========
  {
    id: 'social_im_2000',
    name: '企鹅聊天',
    description: '一款即时通讯软件，支持文字、表情、文件传输',
    year: 2000,
    category: 'social',
    grade: 'C',
    visionRequired: 20,
    baseStamina: 30,
    quarters: [
      { name: '用户系统', desc: '实现用户注册、登录、好友列表' },
      { name: '消息系统', desc: '实现即时消息发送和接收' },
      { name: '界面优化', desc: '设计友好的聊天界面' }
    ]
  },
  {
    id: 'blog_2002',
    name: '博客空间',
    description: '个人博客发布平台',
    year: 2002,
    category: 'content',
    grade: 'C',
    visionRequired: 25,
    baseStamina: 28,
    quarters: [
      { name: '文章系统', desc: '实现文章发布、编辑、删除' },
      { name: '评论互动', desc: '添加评论和访客留言功能' },
      { name: '模板美化', desc: '提供多套博客模板' }
    ]
  },
  {
    id: 'forum_2001',
    name: '天涯论坛',
    description: '网络社区论坛',
    year: 2001,
    category: 'social',
    grade: 'C',
    visionRequired: 22,
    baseStamina: 32,
    quarters: [
      { name: '板块系统', desc: '创建不同主题的讨论板块' },
      { name: '帖子功能', desc: '发帖、回帖、引用功能' },
      { name: '积分体系', desc: '设计用户等级和积分系统' }
    ]
  },
  {
    id: 'download_2003',
    name: '迅雷下载',
    description: '多线程下载工具',
    year: 2003,
    category: 'tool',
    grade: 'C',
    visionRequired: 28,
    baseStamina: 35,
    quarters: [
      { name: '下载引擎', desc: '实现多线程下载核心' },
      { name: '任务管理', desc: '下载队列和断点续传' },
      { name: 'UI界面', desc: '简洁的任务管理界面' }
    ]
  },
  {
    id: 'music_player_2002',
    name: '千千静听',
    description: '本地音乐播放器',
    year: 2002,
    category: 'media',
    grade: 'C',
    visionRequired: 23,
    baseStamina: 26,
    quarters: [
      { name: '播放引擎', desc: '支持多种音频格式播放' },
      { name: '歌词显示', desc: '实现歌词同步显示' },
      { name: '界面设计', desc: '设计美观的播放界面' }
    ]
  },
  {
    id: 'rss_reader_2004',
    name: 'RSS阅读器',
    description: '订阅网站更新的RSS工具',
    year: 2004,
    category: 'tool',
    grade: 'C',
    visionRequired: 26,
    baseStamina: 29,
    quarters: [
      { name: 'RSS解析', desc: '实现RSS订阅源解析' },
      { name: '内容展示', desc: '清晰展示文章列表' },
      { name: '订阅管理', desc: '管理和分类订阅源' }
    ]
  },
  {
    id: 'email_client_2001',
    name: 'Foxmail客户端',
    description: '邮件收发客户端',
    year: 2001,
    category: 'tool',
    grade: 'C',
    visionRequired: 24,
    baseStamina: 31,
    quarters: [
      { name: '邮件协议', desc: '实现POP3/SMTP协议' },
      { name: '邮件管理', desc: '收件箱、发件箱管理' },
      { name: '附件处理', desc: '支持附件上传下载' }
    ]
  },
  {
    id: 'photo_editor_2003',
    name: '美图看看',
    description: '简单的图片查看编辑工具',
    year: 2003,
    category: 'tool',
    grade: 'C',
    visionRequired: 27,
    baseStamina: 30,
    quarters: [
      { name: '图片浏览', desc: '快速图片浏览功能' },
      { name: '基础编辑', desc: '裁剪、旋转、调色' },
      { name: '批量处理', desc: '批量重命名和格式转换' }
    ]
  },
  {
    id: 'input_method_2003',
    name: '搜狗拼音',
    description: '智能拼音输入法',
    year: 2003,
    category: 'tool',
    grade: 'C',
    visionRequired: 29,
    baseStamina: 34,
    quarters: [
      { name: '拼音引擎', desc: '实现拼音转汉字核心算法' },
      { name: '词库优化', desc: '构建常用词库' },
      { name: '智能联想', desc: '添加智能词语联想' }
    ]
  },
  {
    id: 'bookmark_2002',
    name: '网络收藏夹',
    description: '在线书签管理工具',
    year: 2002,
    category: 'tool',
    grade: 'C',
    visionRequired: 21,
    baseStamina: 25,
    quarters: [
      { name: '书签保存', desc: '保存网页链接' },
      { name: '分类管理', desc: '创建文件夹分类' },
      { name: '云端同步', desc: '多设备同步功能' }
    ]
  },
  {
    id: 'weather_app_2004',
    name: '天气通',
    description: '城市天气查询软件',
    year: 2004,
    category: 'tool',
    grade: 'C',
    visionRequired: 20,
    baseStamina: 24,
    quarters: [
      { name: '天气数据', desc: '接入气象数据API' },
      { name: '城市管理', desc: '添加多个城市' },
      { name: '界面设计', desc: '直观的天气展示' }
    ]
  },
  {
    id: 'flashget_2001',
    name: '快车下载',
    description: '网络文件下载工具',
    year: 2001,
    category: 'tool',
    grade: 'C',
    visionRequired: 25,
    baseStamina: 28,
    quarters: [
      { name: '下载核心', desc: '实现HTTP/FTP下载' },
      { name: '速度优化', desc: '多线程加速下载' },
      { name: '任务队列', desc: '管理下载任务' }
    ]
  },
  {
    id: 'notepad_2003',
    name: '云笔记',
    description: '在线记事本工具',
    year: 2003,
    category: 'tool',
    grade: 'C',
    visionRequired: 22,
    baseStamina: 27,
    quarters: [
      { name: '编辑器', desc: '富文本编辑器' },
      { name: '笔记管理', desc: '分类和标签管理' },
      { name: '云端存储', desc: '笔记云端保存' }
    ]
  },
  {
    id: 'antivirus_2002',
    name: '瑞星杀毒',
    description: '计算机病毒查杀软件',
    year: 2002,
    category: 'security',
    grade: 'C',
    visionRequired: 30,
    baseStamina: 36,
    quarters: [
      { name: '病毒扫描', desc: '文件扫描引擎' },
      { name: '病毒库', desc: '建立病毒特征库' },
      { name: '实时防护', desc: '后台实时监控' }
    ]
  },
  {
    id: 'screen_capture_2004',
    name: '屏幕截图工具',
    description: '快捷截图和标注工具',
    year: 2004,
    category: 'tool',
    grade: 'C',
    visionRequired: 21,
    baseStamina: 23,
    quarters: [
      { name: '截图功能', desc: '区域截图、窗口截图' },
      { name: '标注工具', desc: '文字、箭头、马赛克' },
      { name: '快速分享', desc: '一键上传和分享' }
    ]
  },

  // ========== B级产品 (有市场反响的小产品) ==========
  {
    id: 'ecommerce_taobao_2003',
    name: '淘宝网',
    description: 'C2C电子商务平台',
    year: 2003,
    category: 'ecommerce',
    grade: 'B',
    visionRequired: 45,
    baseStamina: 55,
    quarters: [
      { name: '商品系统', desc: '商品发布、搜索、分类' },
      { name: '交易系统', desc: '下单、支付、物流跟踪' },
      { name: '信用体系', desc: '买卖双方评价系统' }
    ]
  },
  {
    id: 'video_youku_2006',
    name: '优酷视频',
    description: '在线视频分享平台',
    year: 2006,
    category: 'video',
    grade: 'B',
    visionRequired: 48,
    baseStamina: 60,
    quarters: [
      { name: '视频上传', desc: '实现视频上传和转码' },
      { name: '播放器', desc: '流畅的在线播放器' },
      { name: '推荐系统', desc: '视频推荐算法' }
    ]
  },
  {
    id: 'weibo_2009',
    name: '新浪微博',
    description: '社交媒体平台',
    year: 2009,
    category: 'social',
    grade: 'B',
    visionRequired: 50,
    baseStamina: 58,
    quarters: [
      { name: '发布系统', desc: '140字微博发布' },
      { name: '关注机制', desc: '关注和粉丝系统' },
      { name: '互动功能', desc: '评论、转发、点赞' }
    ]
  },
  {
    id: 'group_buy_2010',
    name: '美团团购',
    description: '本地生活团购平台',
    year: 2010,
    category: 'ecommerce',
    grade: 'B',
    visionRequired: 47,
    baseStamina: 56,
    quarters: [
      { name: '团购系统', desc: '限时团购和成团机制' },
      { name: '商家入驻', desc: '商家管理后台' },
      { name: '地图定位', desc: '基于位置的服务' }
    ]
  },
  {
    id: 'online_music_2013',
    name: '网易云音乐',
    description: '在线音乐流媒体平台',
    year: 2013,
    category: 'media',
    grade: 'B',
    visionRequired: 49,
    baseStamina: 57,
    quarters: [
      { name: '音乐库', desc: '建立海量曲库' },
      { name: '播放功能', desc: '在线播放和缓存' },
      { name: '社交互动', desc: '歌单分享和评论' }
    ]
  },
  {
    id: 'news_app_2011',
    name: '今日头条',
    description: '个性化新闻推荐',
    year: 2011,
    category: 'content',
    grade: 'B',
    visionRequired: 51,
    baseStamina: 59,
    quarters: [
      { name: '内容聚合', desc: '抓取各类新闻源' },
      { name: '推荐算法', desc: '基于兴趣的推荐' },
      { name: '评论系统', desc: '用户互动评论' }
    ]
  },
  {
    id: 'online_education_2012',
    name: '慕课网',
    description: '在线教育平台',
    year: 2012,
    category: 'education',
    grade: 'B',
    visionRequired: 46,
    baseStamina: 54,
    quarters: [
      { name: '课程系统', desc: '视频课程播放' },
      { name: '练习测试', desc: '在线编程环境' },
      { name: '证书系统', desc: '学习进度和证书' }
    ]
  },
  {
    id: 'short_video_2016',
    name: '快手短视频',
    description: '短视频分享社区',
    year: 2016,
    category: 'video',
    grade: 'B',
    visionRequired: 52,
    baseStamina: 61,
    quarters: [
      { name: '视频拍摄', desc: '内置拍摄和滤镜' },
      { name: '推荐流', desc: '瀑布流视频推荐' },
      { name: '互动功能', desc: '点赞、评论、关注' }
    ]
  },
  {
    id: 'food_delivery_2013',
    name: '饿了么外卖',
    description: '在线订餐配送平台',
    year: 2013,
    category: 'ecommerce',
    grade: 'B',
    visionRequired: 48,
    baseStamina: 56,
    quarters: [
      { name: '商家系统', desc: '餐厅入驻和菜单管理' },
      { name: '订单系统', desc: '下单和支付流程' },
      { name: '配送系统', desc: '骑手调度和配送' }
    ]
  },
  {
    id: 'live_streaming_2015',
    name: '斗鱼直播',
    description: '游戏直播平台',
    year: 2015,
    category: 'video',
    grade: 'B',
    visionRequired: 50,
    baseStamina: 62,
    quarters: [
      { name: '直播技术', desc: '低延迟直播推流' },
      { name: '互动功能', desc: '弹幕和礼物系统' },
      { name: '主播系统', desc: '主播认证和分成' }
    ]
  },

  // ========== A级产品 (风靡全国) ==========
  {
    id: 'wechat_2011',
    name: '微信',
    description: '移动即时通讯应用',
    year: 2011,
    category: 'social',
    grade: 'A',
    visionRequired: 65,
    baseStamina: 85,
    quarters: [
      { name: '通讯核心', desc: '消息、语音、视频通话' },
      { name: '朋友圈', desc: '社交分享功能' },
      { name: '支付功能', desc: '移动支付和红包' }
    ]
  },
  {
    id: 'alipay_2004',
    name: '支付宝',
    description: '第三方支付平台',
    year: 2004,
    category: 'fintech',
    grade: 'A',
    visionRequired: 62,
    baseStamina: 82,
    quarters: [
      { name: '支付系统', desc: '担保交易和快捷支付' },
      { name: '账户安全', desc: '多重安全验证' },
      { name: '金融服务', desc: '余额宝、花呗等' }
    ]
  },
  {
    id: 'baidu_search_2000',
    name: '百度搜索',
    description: '中文搜索引擎',
    year: 2000,
    category: 'search',
    grade: 'A',
    visionRequired: 63,
    baseStamina: 80,
    quarters: [
      { name: '搜索引擎', desc: '网页爬虫和索引' },
      { name: '排序算法', desc: '相关性排序优化' },
      { name: '广告系统', desc: '竞价排名系统' }
    ]
  },
  {
    id: 'didi_2012',
    name: '滴滴出行',
    description: '网约车平台',
    year: 2012,
    category: 'transport',
    grade: 'A',
    visionRequired: 66,
    baseStamina: 86,
    quarters: [
      { name: '订单匹配', desc: '乘客和司机智能匹配' },
      { name: '路线规划', desc: '最优路线算法' },
      { name: '支付结算', desc: '自动计费和分账' }
    ]
  },
  {
    id: 'douyin_2016',
    name: '抖音短视频',
    description: '音乐短视频社交平台',
    year: 2016,
    category: 'video',
    grade: 'A',
    visionRequired: 68,
    baseStamina: 88,
    quarters: [
      { name: '拍摄剪辑', desc: '强大的视频编辑功能' },
      { name: '推荐算法', desc: '精准的内容推荐' },
      { name: '社交网络', desc: '关注、互动、挑战' }
    ]
  },
  {
    id: 'jd_ecommerce_2004',
    name: '京东商城',
    description: 'B2C电商平台',
    year: 2004,
    category: 'ecommerce',
    grade: 'A',
    visionRequired: 64,
    baseStamina: 83,
    quarters: [
      { name: '商品系统', desc: '海量SKU管理' },
      { name: '物流系统', desc: '自建物流配送网络' },
      { name: '会员体系', desc: 'Plus会员和积分' }
    ]
  },
  {
    id: 'xiaohongshu_2013',
    name: '小红书',
    description: '生活方式分享社区',
    year: 2013,
    category: 'social',
    grade: 'A',
    visionRequired: 61,
    baseStamina: 81,
    quarters: [
      { name: '内容社区', desc: '笔记发布和浏览' },
      { name: '电商系统', desc: '社区电商转化' },
      { name: '推荐算法', desc: '兴趣内容推荐' }
    ]
  },
  {
    id: 'pinduoduo_2015',
    name: '拼多多',
    description: '社交电商平台',
    year: 2015,
    category: 'ecommerce',
    grade: 'A',
    visionRequired: 67,
    baseStamina: 84,
    quarters: [
      { name: '拼团系统', desc: '社交拼团机制' },
      { name: '供应链', desc: '工厂直供模式' },
      { name: '游戏化', desc: '签到、游戏互动' }
    ]
  },

  // ========== S级产品 (世界级) ==========
  {
    id: 'tiktok_2017',
    name: 'TikTok',
    description: '全球短视频平台',
    year: 2017,
    category: 'video',
    grade: 'S',
    visionRequired: 85,
    baseStamina: 120,
    quarters: [
      { name: '全球化', desc: '多语言、多地区适配' },
      { name: 'AI推荐', desc: '全球领先的推荐算法' },
      { name: '创作工具', desc: '丰富的特效和编辑' }
    ]
  },
  {
    id: 'game_honor_2015',
    name: '王者荣耀',
    description: 'MOBA手游',
    year: 2015,
    category: 'game',
    grade: 'S',
    visionRequired: 82,
    baseStamina: 115,
    quarters: [
      { name: '游戏引擎', desc: '流畅的战斗系统' },
      { name: '英雄设计', desc: '平衡性和多样性' },
      { name: '社交系统', desc: '组队、语音、赛季' }
    ]
  },
  {
    id: 'zoom_china_2013',
    name: '视频会议系统',
    description: '企业级视频会议',
    year: 2013,
    category: 'enterprise',
    grade: 'S',
    visionRequired: 80,
    baseStamina: 110,
    quarters: [
      { name: '音视频技术', desc: '高清稳定的通话' },
      { name: '会议功能', desc: '屏幕共享、录制' },
      { name: '企业服务', desc: '安全、管理、集成' }
    ]
  }
];

// 根据眼界值筛选合适的产品
export function getAvailableProducts(vision, currentGrade = null) {
  return products.filter(p => {
    // 眼界值足够
    if (p.visionRequired > vision) return false;
    
    // 如果指定了当前等级，只返回该等级的产品
    if (currentGrade) {
      return p.grade === currentGrade;
    }
    
    // 根据眼界范围推荐产品等级
    if (vision < 40) return p.grade === 'C';
    if (vision < 60) return ['C', 'B'].includes(p.grade);
    if (vision < 75) return ['B', 'A'].includes(p.grade);
    return true; // 高眼界可以选择所有等级
  });
}

// 随机选择一个产品
export function selectRandomProduct(vision, preferredGrade = null) {
  const available = getAvailableProducts(vision, preferredGrade);
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

