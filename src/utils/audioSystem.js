// 音效系统

// 背景音乐配置（预留在线地址）
export const BACKGROUND_MUSIC = {
  pc: {
    name: 'PC时代背景音乐',
    // 预留：可以使用免费音乐库如：
    // https://freemusicarchive.org/
    // https://incompetech.com/
    url: 'https://example.com/music/pc-era.mp3',  // 预留地址
    volume: 0.3
  },
  mobile: {
    name: '移动时代背景音乐',
    url: 'https://example.com/music/mobile-era.mp3',  // 预留地址
    volume: 0.3
  },
  ai: {
    name: 'AI时代背景音乐',
    url: 'https://example.com/music/ai-era.mp3',  // 预留地址
    volume: 0.3
  }
}

// 音效配置（预留在线地址）
export const SOUND_EFFECTS = {
  // 操作音效
  click: {
    name: '点击',
    url: 'https://example.com/sounds/click.mp3',  // 预留地址
    volume: 0.5
  },
  success: {
    name: '成功',
    url: 'https://example.com/sounds/success.mp3',  // 预留地址
    volume: 0.6
  },
  error: {
    name: '错误',
    url: 'https://example.com/sounds/error.mp3',  // 预留地址
    volume: 0.5
  },
  
  // 游戏事件音效
  moneyIn: {
    name: '收入',
    url: 'https://example.com/sounds/money-in.mp3',  // 预留地址
    volume: 0.5
  },
  moneyOut: {
    name: '支出',
    url: 'https://example.com/sounds/money-out.mp3',  // 预留地址
    volume: 0.5
  },
  levelUp: {
    name: '升级',
    url: 'https://example.com/sounds/level-up.mp3',  // 预留地址
    volume: 0.6
  },
  newEmployee: {
    name: '招聘成功',
    url: 'https://example.com/sounds/new-employee.mp3',  // 预留地址
    volume: 0.5
  },
  productLaunch: {
    name: '产品上线',
    url: 'https://example.com/sounds/product-launch.mp3',  // 预留地址
    volume: 0.7
  },
  milestone: {
    name: '里程碑',
    url: 'https://example.com/sounds/milestone.mp3',  // 预留地址
    volume: 0.7
  },
  warning: {
    name: '警告',
    url: 'https://example.com/sounds/warning.mp3',  // 预留地址
    volume: 0.6
  },
  bankruptcy: {
    name: '破产',
    url: 'https://example.com/sounds/bankruptcy.mp3',  // 预留地址
    volume: 0.7
  }
}

// 音频管理器类
export class AudioManager {
  constructor() {
    this.bgmAudio = null
    this.currentBGM = null
    this.soundEnabled = true
    this.musicEnabled = true
    this.soundCache = new Map()
  }
  
  // 初始化
  init() {
    // 从存储读取音效设置
    try {
      const settings = uni.getStorageSync('audio_settings')
      if (settings) {
        const parsed = JSON.parse(settings)
        this.soundEnabled = parsed.soundEnabled !== false
        this.musicEnabled = parsed.musicEnabled !== false
      }
    } catch (e) {
      console.error('读取音效设置失败:', e)
    }
  }
  
  // 播放背景音乐
  playBackgroundMusic(era) {
    if (!this.musicEnabled) return
    
    const bgm = BACKGROUND_MUSIC[era]
    if (!bgm) return
    
    // 如果已经在播放相同的音乐，不重复播放
    if (this.currentBGM === era && this.bgmAudio) {
      return
    }
    
    // 停止当前音乐
    this.stopBackgroundMusic()
    
    // 创建新的音频实例
    this.bgmAudio = uni.createInnerAudioContext()
    this.bgmAudio.src = bgm.url
    this.bgmAudio.loop = true
    this.bgmAudio.volume = bgm.volume
    
    this.bgmAudio.onError((res) => {
      console.error('背景音乐播放失败:', res)
    })
    
    this.bgmAudio.play()
    this.currentBGM = era
  }
  
  // 停止背景音乐
  stopBackgroundMusic() {
    if (this.bgmAudio) {
      this.bgmAudio.stop()
      this.bgmAudio.destroy()
      this.bgmAudio = null
      this.currentBGM = null
    }
  }
  
  // 暂停背景音乐
  pauseBackgroundMusic() {
    if (this.bgmAudio) {
      this.bgmAudio.pause()
    }
  }
  
  // 恢复背景音乐
  resumeBackgroundMusic() {
    if (this.bgmAudio && this.musicEnabled) {
      this.bgmAudio.play()
    }
  }
  
  // 播放音效
  playSound(soundName) {
    if (!this.soundEnabled) return
    
    const sound = SOUND_EFFECTS[soundName]
    if (!sound) return
    
    // 创建音频实例
    const audio = uni.createInnerAudioContext()
    audio.src = sound.url
    audio.volume = sound.volume
    
    audio.onError((res) => {
      console.error(`音效${soundName}播放失败:`, res)
    })
    
    // 播放完成后销毁
    audio.onEnded(() => {
      audio.destroy()
    })
    
    audio.play()
  }
  
  // 切换音效开关
  toggleSound() {
    this.soundEnabled = !this.soundEnabled
    this.saveSettings()
    return this.soundEnabled
  }
  
  // 切换音乐开关
  toggleMusic() {
    this.musicEnabled = !this.musicEnabled
    
    if (!this.musicEnabled) {
      this.stopBackgroundMusic()
    } else if (this.currentBGM) {
      this.playBackgroundMusic(this.currentBGM)
    }
    
    this.saveSettings()
    return this.musicEnabled
  }
  
  // 保存设置
  saveSettings() {
    try {
      uni.setStorageSync('audio_settings', JSON.stringify({
        soundEnabled: this.soundEnabled,
        musicEnabled: this.musicEnabled
      }))
    } catch (e) {
      console.error('保存音效设置失败:', e)
    }
  }
  
  // 销毁
  destroy() {
    this.stopBackgroundMusic()
    this.soundCache.clear()
  }
}

// 创建全局音频管理器实例
let globalAudioManager = null

export function getAudioManager() {
  if (!globalAudioManager) {
    globalAudioManager = new AudioManager()
    globalAudioManager.init()
  }
  return globalAudioManager
}

// 快捷播放方法
export function playSound(soundName) {
  const manager = getAudioManager()
  manager.playSound(soundName)
}

export function playBGM(era) {
  const manager = getAudioManager()
  manager.playBackgroundMusic(era)
}

export function stopBGM() {
  const manager = getAudioManager()
  manager.stopBackgroundMusic()
}

// 音乐资源推荐网站说明
export const MUSIC_RESOURCES = `
音乐资源推荐：

1. 免费音乐库：
   - FreeMusicArchive: https://freemusicarchive.org/
   - Incompetech: https://incompetech.com/
   - Bensound: https://www.bensound.com/
   - YouTube Audio Library: https://www.youtube.com/audiolibrary

2. 音效库：
   - Freesound: https://freesound.org/
   - Zapsplat: https://www.zapsplat.com/
   - SoundBible: http://soundbible.com/

3. 使用说明：
   - 下载免费音乐后上传到自己的服务器
   - 或使用CDN加速服务
   - 替换上面预留的URL地址即可

4. 建议的音乐风格：
   - PC时代：复古电子音乐、8-bit音效
   - 移动时代：现代轻快音乐、电子流行
   - AI时代：未来感科技音乐、合成器音乐
`

