# 快速启动指南

## 🚀 快速开始

### 1. 安装依赖
```bash
pnpm install
```

### 2. 运行开发服务器

#### H5开发（推荐首次测试）
```bash
pnpm dev:h5
```
打开浏览器访问：http://localhost:5173

#### 微信小程序开发
```bash
pnpm dev:mp-weixin
```
然后在微信开发者工具中打开 `dist/dev/mp-weixin` 目录

## 🎮 游戏测试流程

### 完整流程测试
1. **首页** → 查看初始属性（眼界50、运气50、体力50）
2. **开始游戏** → 自动选择一个C级产品
3. **游戏主界面** → 查看产品信息和当前状态
4. **开始Q1** → 选择一个开发方案
5. **任务进行** → 观察todo-list逐个划掉动画
6. **返回主界面** → 继续Q2、Q3
7. **Boss战** → 观察最终发布流程
8. **结算** → 查看市场反响和奖励
9. **选择临时升级** → 继续下一局

### 失败流程测试
1. 故意选择高体力消耗的方案
2. 让体力在Boss战前耗尽
3. 观察失败结算页面

### 升级系统测试
1. 完成几局游戏积累晶核
2. 进入能力升级页面
3. 升级眼界、运气或体力
4. 观察属性提升效果

### 通关流程测试
1. 升级属性到较高级别
2. 挑战A级或S级产品
3. 成功后观察通关奖励

## 🐛 常见问题

### 1. 页面跳转失败
- 检查 `pages.json` 是否正确配置所有页面路由
- 确保页面路径与实际文件路径一致

### 2. 数据不保存
- uni-app在H5环境下使用localStorage
- 可以在浏览器开发者工具中查看 Storage
- 清除缓存：localStorage.clear()

### 3. 样式显示异常
- 检查 rpx 单位是否正确
- H5环境下 1rpx = 0.5px
- 确保全局样式在 App.vue 中正确引入

### 4. 动画不流畅
- 检查定时器是否正确清理
- 调整 todo 划掉的时间间隔
- 在 `gameLogic.js` 的 `generateTodoTimings` 函数中调整 totalTime

## 🎯 数值调试

### 修改初始属性
编辑 `src/utils/storage.js` 中的 `INITIAL_PLAYER_DATA`：
```javascript
const INITIAL_PLAYER_DATA = {
  vision: 80,      // 修改初始眼界
  luck: 80,        // 修改初始运气
  stamina: 100,    // 修改初始体力
  maxStamina: 100,
  crystals: 1000,  // 修改初始晶核（用于测试升级）
  // ...
}
```

### 修改产品数据
编辑 `src/data/products.js`：
- 调整 `visionRequired`：眼界要求
- 调整 `baseStamina`：基础体力需求
- 添加新产品或修改现有产品

### 修改方案配置
编辑 `src/data/solutions.js`：
- 调整 `staminaMultiplier`：体力消耗倍数
- 调整 `qualityImpact`：质量影响系数
- 调整 `progressSpeed`：进度速度倍数

### 修改升级配置
编辑 `src/data/upgrades.js`：
- 调整永久升级的 `cost`：购买成本
- 调整永久升级的 `bonus`：属性加成
- 添加新的临时升级效果

## 📱 平台适配

### H5平台
- 最佳测试环境
- 支持浏览器开发者工具
- localStorage 可直接查看

### 微信小程序
- 需要在微信开发者工具中测试
- 使用 wx.setStorageSync 存储
- 注意小程序的包体积限制

### APP
- 需要HBuilderX编译
- 支持更丰富的原生API
- 震动反馈效果更好

## 🎨 自定义主题

### 修改配色
编辑 `src/App.vue` 的全局样式：
```css
page {
  background-color: #F4E4C1;  /* 背景色 */
  color: #3E2723;              /* 文字色 */
}

.crt-screen {
  background: #1B1B1B;         /* CRT屏幕背景 */
  color: #00FF00;              /* CRT屏幕文字 */
}
```

### 修改字体
修改 `font-family` 为你喜欢的等宽字体：
```css
font-family: 'Courier New', 'Consolas', monospace;
```

## 🔍 调试技巧

### 查看游戏状态
在浏览器控制台执行：
```javascript
// 查看玩家数据
console.log(uni.getStorageSync('player_data'))

// 查看游戏状态
console.log(uni.getStorageSync('game_state'))

// 查看游戏历史
console.log(uni.getStorageSync('game_history'))
```

### 重置游戏数据
```javascript
uni.clearStorageSync()
```

### 快速获得晶核（测试用）
在首页或升级页面的控制台执行：
```javascript
let data = JSON.parse(uni.getStorageSync('player_data'))
data.crystals = 10000
uni.setStorageSync('player_data', JSON.stringify(data))
location.reload()
```

## ✅ 功能检查清单

### 核心功能
- [x] 产品随机选择
- [x] 季度任务方案生成
- [x] Todo-list划掉动画
- [x] 体力消耗计算
- [x] Boss战完成度计算
- [x] 产品评级系统
- [x] 市场反响生成
- [x] 晶核奖励计算
- [x] 临时升级选择
- [x] 永久升级购买
- [x] 数据持久化

### UI/UX
- [x] 复古像素风格
- [x] CRT屏幕效果
- [x] 进度条动画
- [x] 震动反馈
- [x] 页面跳转流畅
- [x] 弹窗交互

### 数据完整性
- [x] 36个历史产品
- [x] 分类方案模板
- [x] 9种临时升级
- [x] 3种永久升级
- [x] 游戏历史记录

## 🚦 性能优化建议

1. **图片优化**：如果后续添加图片资源，使用压缩后的图片
2. **动画优化**：使用 CSS transform 而不是 position
3. **内存管理**：及时清理定时器和事件监听
4. **包体积**：定期清理未使用的代码和资源

## 📝 下一步开发建议

1. **音效系统**：添加背景音乐和音效
2. **成就系统**：完成特定条件解锁成就
3. **排行榜**：记录最快通关时间等
4. **更多产品**：扩充产品库到50+
5. **历史事件**：添加随机历史事件影响游戏
6. **多结局**：根据选择的产品类型展现不同结局

---

祝你开发愉快！🎉

