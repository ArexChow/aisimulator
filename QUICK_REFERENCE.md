# AI增强模块快速参考

## 导入

```javascript
import { aiContentFactory } from '@/utils/aiContentFactory.js';
import { aiContentCache } from '@/utils/aiContentCache.js';
import { aiContentValidator } from '@/utils/aiContentValidator.js';
```

## 5个模块一览

| 模块 | 方法 | 返回类型 | 场景 |
|-----|-----|--------|------|
| 产品创意 | `generateProductIdeas(params)` | JSON数组 | 新建产品时获取灵感 |
| 开发日志 | `generateDevLog(params)` | 文本字符串 | 产品开发过程中 |
| 员工背景 | `generateEmployeeStory(params)` | 文本字符串 | 招聘页面显示候选人 |
| 用户评论 | `generateProductComments(params)` | JSON数组 | 产品上线后显示反馈 |
| 动态新闻 | `generateDynamicNews(params)` | 文本字符串 | 每4周触发一次 |

## 使用模板

### 1. 产品创意（返回3个JSON对象）

```javascript
const ideas = await aiContentFactory.generateProductIdeas({
  year: 2015,
  era: "移动互联网时代",
  companyName: "公司名",
  existingProducts: ["产品1", "产品2"],
  companyStrength: "技术导向",
  category: "social",
  grade: "A",
  monetization: "ad"
});

// 返回结构
[
  { name: "名称", slogan: "标语", description: "描述", highlights: ["亮点"] },
  ...
]
```

### 2. 开发日志（返回文本）

```javascript
const log = await aiContentFactory.generateDevLog({
  productName: "产品名",
  category: "video",
  grade: "A",
  solution: "balanced",
  employees: [{name: "张三"}, ...],
  avgProgramming: 68,
  teamStatus: "正常",
  currentTask: "核心功能",
  progress: 65,
  week: 4,
  totalWeeks: 8
});

// 返回: "第4周进度：核心功能已完成65%，团队配合默契..."
```

### 3. 员工背景（返回文本）

```javascript
const story = await aiContentFactory.generateEmployeeStory({
  name: "张伟",
  personality: "技术宅",
  programming: 72,
  art: 35,
  business: 28,
  salary: 9000,
  channel: "朋友介绍",
  year: 2015,
  era: "移动互联网时代"
});

// 返回: "大三开始接触iOS开发，毕业后在一家外包公司待了两年..."
```

### 4. 用户评论（返回3个JSON对象）

```javascript
const comments = await aiContentFactory.generateProductComments({
  productName: "外卖平台",
  category: "ecommerce",
  grade: "B",
  weeksSinceLaunch: 8,
  solution: "balanced",
  dau: 25000,
  rating: 3.8,
  trend: "stable",
  revenue: 35000,
  scenario: "steady_operation"
});

// 返回结构
[
  { author: "用户名", rating: 4, content: "评论内容", sentiment: "positive" },
  ...
]
```

### 5. 动态新闻（返回文本）

```javascript
const news = await aiContentFactory.generateDynamicNews({
  year: 2015,
  era: "移动互联网时代",
  companyName: "公司名",
  employeeCount: 5,
  productCount: 3,
  mainProducts: [{name: "产品1", dau: 50000}, ...],
  marketPosition: "成长"
});

// 返回: "📱 短视频平台获千万用户，用户时长激增300%"
```

## 缓存操作

```javascript
// 检查缓存命中
const cached = aiContentCache.get('productIdeas', params);
if (cached) console.log('缓存命中！');

// 手动保存到缓存
aiContentCache.set('productIdeas', params, content);

// 查看缓存统计
const stats = aiContentCache.getStats();
// { totalSize: 12345, itemCount: 5, types: { productIdeas: 2, ... } }

// 清除所有AI缓存
aiContentCache.clear();

// 清除特定类型缓存
aiContentCache.clear('productIdeas');

// 清除单个缓存项
aiContentCache.clearByKey('productIdeas', params);
```

## 验证操作

```javascript
import { aiContentValidator } from '@/utils/aiContentValidator.js';

// 验证内容
const result = aiContentValidator.validate('productIdeas', content);
// { valid: true, errors: [] }

// 查看验证规则
const rule = aiContentValidator.getRule('productIdeas');

// 尝试修复JSON
const fixed = aiContentValidator.tryFixJSON(jsonString);

// 添加自定义验证规则
aiContentValidator.addRule('custom', {
  minLength: 100,
  maxLength: 500,
  format: 'text'
});

// 添加违禁词
aiContentValidator.addForbiddenWord('违禁词');
```

## 错误处理

```javascript
// 方式1: try-catch
try {
  const content = await aiContentFactory.generateProductIdeas({...});
  // 使用content
} catch (error) {
  console.error('生成失败，已自动使用降级方案', error);
}

// 方式2: 带加载状态
this.loading = true;
try {
  this.content = await aiContentFactory.generateProductIdeas({...});
  uni.showToast({ title: '生成成功' });
} catch (error) {
  uni.showToast({ title: '使用预设内容' });
} finally {
  this.loading = false;
}

// 方式3: Promise链
aiContentFactory.generateProductIdeas({...})
  .then(content => {
    // 处理成功情况
  })
  .catch(error => {
    console.error('错误已处理，已返回降级方案');
  });
```

## 常用参数组合

### 新产品创意（完整参数）

```javascript
{
  year: 2018,
  era: "移动互联网时代",
  companyName: "创新科技",
  existingProducts: ["短视频APP", "外卖平台"],
  companyStrength: "技术导向",
  category: "social",
  grade: "A",
  monetization: "ad",
  trendingTopics: ["知识付费", "社区团购"],
  competitors: ["微信", "微博"],
  userPainPoints: ["社交疲劳", "信息过载"]
}
```

### 产品开发日志（最小参数）

```javascript
{
  productName: "短视频APP",
  category: "video",
  grade: "A",
  solution: "balanced",
  employees: this.gameState.employees,
  avgProgramming: 68,
  avgArt: 55,
  avgBusiness: 45,
  teamStatus: "正常",
  currentTask: "核心功能开发",
  progress: 65,
  week: 4,
  totalWeeks: 8
}
```

## 性能提示

| 场景 | 推荐做法 |
|-----|--------|
| 首次生成 | 显示loading，异步调用 |
| 相同参数再次查询 | 自动从缓存返回（<50ms） |
| 批量生成（如招聘5人） | 使用Promise.all并发调用 |
| 非关键路径 | 延迟生成，不阻塞主流程 |
| 长会话 | 定期清除过期缓存 |

## 故障排查

| 现象 | 原因 | 解决 |
|-----|------|------|
| 生成超过3秒 | 网络慢或API繁忙 | 等待或重试 |
| 返回预设内容 | AI失败或验证失败 | 检查日志 |
| 缓存总是未命中 | 参数不完全相同 | 检查参数差异 |
| 内容格式错误 | AI输出不规范 | 自动修复已启用 |

## 完整工作流示例

```javascript
export default {
  data() {
    return {
      loading: false,
      productIdeas: [],
      error: null
    }
  },
  methods: {
    async getProductIdeas() {
      this.loading = true;
      this.error = null;
      
      try {
        // 调用AI工厂
        this.productIdeas = await aiContentFactory.generateProductIdeas({
          year: this.gameState.currentYear,
          era: this.gameState.era,
          companyName: this.gameState.companyName,
          existingProducts: this.gameState.products.map(p => p.name),
          category: this.selectedCategory,
          grade: 'A'
        });
        
        // 显示结果
        uni.showToast({ title: '已生成3个创意方案' });
        
      } catch (error) {
        // 错误已自动降级
        console.error('创意生成异常:', error);
        this.error = '生成失败，已使用默认方案';
      } finally {
        this.loading = false;
      }
    }
  }
}
```

## 配置调整

```javascript
// 修改重试次数（默认2次）
aiContentFactory.maxRetries = 3;

// 修改请求超时（默认30秒）
aiContentFactory.requestTimeout = 60000;

// 修改缓存有效期（默认24小时）
aiContentCache.TTL = 48 * 60 * 60 * 1000;
```

## 监控和调试

```javascript
// 在浏览器console中
// 查看所有缓存统计
aiContentCache.getStats()

// 清除所有缓存（测试用）
aiContentCache.clear()

// 启用详细日志（已默认启用）
// 查看浏览器console观察 [缓存命中]/[缓存保存]/[缓存过期] 等日志
```

---

💡 **完整文档**: 查看 `AI_INTEGRATION_GUIDE.md`  
📊 **性能分析**: 查看 `AI_IMPLEMENTATION_SUMMARY.md`  
🔧 **API文档**: 查看 `AI增强系统设计.md`
