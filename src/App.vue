<script>
export default {
  onLaunch: function () {
    console.log('程序员模拟器启动')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style>
/* 全局样式 - 复古像素风格 */

/* 导入像素字体（使用系统等宽字体模拟） */
page {
  background-color: #F4E4C1;
  color: #3E2723;
  font-family: 'Courier New', Courier, monospace;
  line-height: 1.6;
}

/* 重置样式 */
page, view, text, image, button, input, textarea, scroll-view {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* 像素风格容器 */
.pixel-container {
  background: #F4E4C1;
  border: 4px solid #3E2723;
  box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.2);
  padding: 20rpx;
}

/* 像素按钮 */
.pixel-btn {
  display: inline-block;
  padding: 20rpx 40rpx;
  background: #3E2723;
  color: #F4E4C1;
  border: 4px solid #3E2723;
  font-size: 28rpx;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  position: relative;
  transition: all 0.1s;
  font-family: 'Courier New', Courier, monospace;
}

.pixel-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.3);
}

.pixel-btn-primary {
  background: #6D4C41;
  border-color: #3E2723;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
}

.pixel-btn-success {
  background: #558B2F;
  border-color: #33691E;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
}

.pixel-btn-danger {
  background: #C62828;
  border-color: #8E0000;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
}

.pixel-btn-disabled {
  background: #9E9E9E;
  border-color: #616161;
  opacity: 0.5;
  cursor: not-allowed;
}

/* CRT 显示器效果 */
.crt-screen {
  background: #1B1B1B;
  color: #00FF00;
  border: 12rpx solid #3E2723;
  border-radius: 20rpx;
  padding: 40rpx;
  position: relative;
  box-shadow: inset 0 0 50rpx rgba(0, 255, 0, 0.1);
}

.crt-screen::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    transparent 50%,
    rgba(0, 0, 0, 0.1) 50%
  );
  background-size: 100% 4px;
  pointer-events: none;
  animation: scan 8s linear infinite;
}

@keyframes scan {
  0% { transform: translateY(0); }
  100% { transform: translateY(4px); }
}

/* 像素标题 */
.pixel-title {
  font-size: 48rpx;
  font-weight: bold;
  color: #3E2723;
  text-align: center;
  margin: 40rpx 0;
  text-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
  letter-spacing: 4rpx;
}

.pixel-subtitle {
  font-size: 32rpx;
  font-weight: bold;
  color: #5D4037;
  margin: 30rpx 0;
}

/* 进度条 */
.pixel-progress {
  height: 40rpx;
  background: #D7CCC8;
  border: 4px solid #3E2723;
  position: relative;
  overflow: hidden;
}

.pixel-progress-bar {
  height: 100%;
  background: #6D4C41;
  transition: width 0.3s ease;
  position: relative;
}

.pixel-progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 10rpx,
    rgba(255, 255, 255, 0.1) 10rpx,
    rgba(255, 255, 255, 0.1) 20rpx
  );
}

/* 卡片 */
.pixel-card {
  background: #FFF9C4;
  border: 4px solid #3E2723;
  padding: 30rpx;
  margin: 20rpx 0;
  box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.15);
}

.pixel-card-active {
  background: #FFE082;
  box-shadow: 0 0 0 4px #FFC107, 6px 6px 0 rgba(0, 0, 0, 0.15);
}

/* 徽章 */
.pixel-badge {
  display: inline-block;
  padding: 8rpx 16rpx;
  border: 3px solid #3E2723;
  font-size: 24rpx;
  font-weight: bold;
  margin: 0 10rpx;
}

.badge-c { background: #90A4AE; color: #263238; }
.badge-b { background: #66BB6A; color: #1B5E20; }
.badge-a { background: #42A5F5; color: #0D47A1; }
.badge-s { background: #FFA726; color: #E65100; }

/* 文本 */
.text-center { text-align: center; }
.text-bold { font-weight: bold; }
.text-large { font-size: 36rpx; }
.text-small { font-size: 24rpx; }

/* 间距 */
.mt-10 { margin-top: 10rpx; }
.mt-20 { margin-top: 20rpx; }
.mt-30 { margin-top: 30rpx; }
.mt-40 { margin-top: 40rpx; }
.mb-10 { margin-bottom: 10rpx; }
.mb-20 { margin-bottom: 20rpx; }
.mb-30 { margin-bottom: 30rpx; }
.mb-40 { margin-bottom: 40rpx; }
.p-20 { padding: 20rpx; }
.p-30 { padding: 30rpx; }

/* 闪烁动画 */
@keyframes blink {
  0%, 50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0; }
}

.blink {
  animation: blink 1s infinite;
}

/* Flex布局 */
.flex { display: flex; }
.flex-column { flex-direction: column; }
.flex-center { justify-content: center; align-items: center; }
.flex-between { justify-content: space-between; align-items: center; }
.flex-1 { flex: 1; }

/* 滚动文字效果 */
@keyframes scroll-text {
  0% { transform: translateY(20rpx); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

.scroll-text {
  animation: scroll-text 0.5s ease-out;
}
</style>
