// 时代主题系统

// PC互联网时代主题 (2000-2010) - 复古CRT风格
export const PC_ERA_THEME = {
  id: 'pc',
  name: 'PC互联网时代',
  colors: {
    primary: '#3E2723',      // 深棕色
    secondary: '#6D4C41',    // 棕色
    accent: '#FFC107',       // 琥珀色
    success: '#558B2F',      // 绿色
    danger: '#C62828',       // 红色
    background: '#F4E4C1',   // 米黄色
    cardBg: '#FFF9C4',       // 淡黄色
    text: '#3E2723',         // 深棕色文字
    border: '#3E2723'        // 深棕色边框
  },
  styles: {
    borderWidth: '4px',
    borderRadius: '0px',
    fontFamily: "'Courier New', Courier, monospace",
    shadow: '8px 8px 0 rgba(0, 0, 0, 0.2)'
  }
}

// 移动互联网时代主题 (2011-2016) - 扁平化现代风格
export const MOBILE_ERA_THEME = {
  id: 'mobile',
  name: '移动互联网时代',
  colors: {
    primary: '#2196F3',      // 蓝色
    secondary: '#03A9F4',    // 亮蓝色
    accent: '#FF9800',       // 橙色
    success: '#4CAF50',      // 绿色
    danger: '#F44336',       // 红色
    background: '#ECEFF1',   // 浅灰色
    cardBg: '#FFFFFF',       // 白色
    text: '#212121',         // 深灰色文字
    border: '#E0E0E0'        // 浅灰色边框
  },
  styles: {
    borderWidth: '2px',
    borderRadius: '8px',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', sans-serif",
    shadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  }
}

// AI时代主题 (2017+) - 科技感渐变风格
export const AI_ERA_THEME = {
  id: 'ai',
  name: 'AI时代',
  colors: {
    primary: '#6200EA',      // 深紫色
    secondary: '#7C4DFF',    // 紫色
    accent: '#00E5FF',       // 青色
    success: '#00C853',      // 亮绿色
    danger: '#FF1744',       // 亮红色
    background: '#1A1A2E',   // 深蓝黑色
    cardBg: '#16213E',       // 深蓝色
    text: '#E0E0E0',         // 浅灰色文字
    border: '#7C4DFF'        // 紫色边框
  },
  styles: {
    borderWidth: '2px',
    borderRadius: '12px',
    fontFamily: "'SF Pro Display', -apple-system, sans-serif",
    shadow: '0 8px 32px rgba(124, 77, 255, 0.2)'
  }
}

// 根据年份获取主题
export function getThemeByYear(year) {
  if (year >= 2017) {
    return AI_ERA_THEME
  } else if (year >= 2011) {
    return MOBILE_ERA_THEME
  } else {
    return PC_ERA_THEME
  }
}

// 应用主题到页面（返回CSS变量字符串）
export function applyTheme(theme) {
  const cssVars = {
    '--theme-primary': theme.colors.primary,
    '--theme-secondary': theme.colors.secondary,
    '--theme-accent': theme.colors.accent,
    '--theme-success': theme.colors.success,
    '--theme-danger': theme.colors.danger,
    '--theme-background': theme.colors.background,
    '--theme-card-bg': theme.colors.cardBg,
    '--theme-text': theme.colors.text,
    '--theme-border': theme.colors.border,
    '--theme-border-width': theme.styles.borderWidth,
    '--theme-border-radius': theme.styles.borderRadius,
    '--theme-font-family': theme.styles.fontFamily,
    '--theme-shadow': theme.styles.shadow
  }
  
  return cssVars
}

// 生成主题切换提示文案
export function getThemeChangeMessage(newTheme) {
  const messages = {
    'mobile': '📱 进入移动互联网时代，界面焕然一新！',
    'ai': '🤖 欢迎来到AI时代，体验未来科技！'
  }
  return messages[newTheme.id] || null
}

