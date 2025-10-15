// 季度任务方案模板
// 根据产品类型动态生成不同的具体方案

// 方案类型定义
const solutionTypes = {
  // 快速方案：低体力消耗，低质量影响
  quick: {
    staminaMultiplier: 0.7,  // 体力消耗倍数
    qualityImpact: 0.6,      // 质量影响系数
    progressSpeed: 1.3       // 进度速度倍数
  },
  // 平衡方案：中等体力消耗，中等质量
  balanced: {
    staminaMultiplier: 1.0,
    qualityImpact: 1.0,
    progressSpeed: 1.0
  },
  // 精益方案：高体力消耗，高质量影响
  quality: {
    staminaMultiplier: 1.4,
    qualityImpact: 1.5,
    progressSpeed: 0.8
  }
};

// 根据产品类型和季度任务生成方案
export function generateSolutions(product, quarterIndex) {
  const quarter = product.quarters[quarterIndex];
  const category = product.category;
  
  const templates = getSolutionTemplates(category);
  
  return [
    {
      id: 'quick',
      name: templates.quick.name,
      description: templates.quick.getDescription(quarter.name),
      stamina: Math.round(product.baseStamina * 0.3 * solutionTypes.quick.staminaMultiplier),
      ...solutionTypes.quick,
      todos: templates.quick.getTodos(quarter.name)
    },
    {
      id: 'balanced',
      name: templates.balanced.name,
      description: templates.balanced.getDescription(quarter.name),
      stamina: Math.round(product.baseStamina * 0.3 * solutionTypes.balanced.staminaMultiplier),
      ...solutionTypes.balanced,
      todos: templates.balanced.getTodos(quarter.name)
    },
    {
      id: 'quality',
      name: templates.quality.name,
      description: templates.quality.getDescription(quarter.name),
      stamina: Math.round(product.baseStamina * 0.3 * solutionTypes.quality.staminaMultiplier),
      ...solutionTypes.quality,
      todos: templates.quality.getTodos(quarter.name)
    }
  ];
}

// 获取不同类型的方案模板
function getSolutionTemplates(category) {
  const templates = {
    social: {
      quick: {
        name: '快速迭代',
        getDescription: (task) => `用最快的速度完成${task}，采用成熟的开源方案，快速上线验证`,
        getTodos: (task) => [
          `调研${task}的开源解决方案`,
          '选择最合适的框架和库',
          '快速集成到现有系统',
          '基础功能测试',
          '部署上线'
        ]
      },
      balanced: {
        name: '稳扎稳打',
        getDescription: (task) => `按照标准流程完成${task}，保证基本功能和稳定性`,
        getTodos: (task) => [
          `设计${task}的技术方案`,
          '搭建开发环境',
          '核心功能开发',
          '边界情况处理',
          '单元测试编写',
          '集成测试',
          '代码审查',
          '部署上线'
        ]
      },
      quality: {
        name: '精益求精',
        getDescription: (task) => `深入研究${task}，打造极致的用户体验和系统性能`,
        getTodos: (task) => [
          `深入调研${task}的业界最佳实践`,
          '设计详细的技术架构',
          '核心算法优化',
          '用户体验打磨',
          '性能压力测试',
          '多轮用户测试',
          '细节优化迭代',
          '完善的文档编写',
          '代码重构优化',
          '上线和监控'
        ]
      }
    },
    ecommerce: {
      quick: {
        name: 'MVP上线',
        getDescription: (task) => `快速实现${task}的核心功能，先跑通流程再优化`,
        getTodos: (task) => [
          `确定${task}的最小可行功能`,
          '使用现成的支付/物流接口',
          '快速开发原型',
          '基础流程测试',
          '小范围试运行'
        ]
      },
      balanced: {
        name: '标准开发',
        getDescription: (task) => `完整实现${task}，确保交易安全和用户体验`,
        getTodos: (task) => [
          `设计${task}的业务流程`,
          '数据库表结构设计',
          '接口开发',
          '前端页面开发',
          '支付对接测试',
          '安全性测试',
          '性能优化',
          '上线准备'
        ]
      },
      quality: {
        name: '企业级方案',
        getDescription: (task) => `打造${task}的企业级解决方案，考虑高并发和可扩展性`,
        getTodos: (task) => [
          `${task}的架构设计`,
          '分布式系统设计',
          '缓存策略设计',
          '数据库读写分离',
          '核心业务开发',
          '风控系统设计',
          '高并发压测',
          '容灾备份方案',
          '监控告警系统',
          '灰度发布'
        ]
      }
    },
    video: {
      quick: {
        name: '快速原型',
        getDescription: (task) => `用云服务快速实现${task}，优先验证产品模式`,
        getTodos: (task) => [
          `调研${task}的云服务方案`,
          '接入第三方视频服务',
          '简单的上传播放功能',
          '基础UI实现',
          '小范围测试'
        ]
      },
      balanced: {
        name: '标准实现',
        getDescription: (task) => `自主实现${task}的核心功能，保证流畅的播放体验`,
        getTodos: (task) => [
          `${task}的技术选型`,
          '视频编解码方案',
          '存储和CDN方案',
          '播放器开发',
          '上传转码流程',
          '播放性能优化',
          '带宽成本控制',
          '上线部署'
        ]
      },
      quality: {
        name: '顶级体验',
        getDescription: (task) => `打造${task}的极致体验，自研核心技术`,
        getTodos: (task) => [
          `深入研究${task}的技术难点`,
          '自研视频编解码算法',
          '多码率自适应方案',
          '智能推荐算法',
          'P2P加速技术',
          '弱网优化',
          'AI内容审核',
          '大规模压力测试',
          '全球CDN部署',
          '灰度上线'
        ]
      }
    },
    tool: {
      quick: {
        name: '快速开发',
        getDescription: (task) => `快速实现${task}，满足基本需求即可`,
        getTodos: (task) => [
          `梳理${task}的核心功能`,
          '选择合适的技术栈',
          '快速编码实现',
          '基本功能测试',
          '打包发布'
        ]
      },
      balanced: {
        name: '完整开发',
        getDescription: (task) => `完整实现${task}，注重稳定性和易用性`,
        getTodos: (task) => [
          `设计${task}的功能架构`,
          '核心功能开发',
          '异常处理',
          'UI界面优化',
          '多平台兼容性测试',
          '性能优化',
          '用户手册编写',
          '发布'
        ]
      },
      quality: {
        name: '精品打磨',
        getDescription: (task) => `精心打磨${task}，追求极致的性能和体验`,
        getTodos: (task) => [
          `深入研究${task}的技术细节`,
          '算法优化',
          '内存占用优化',
          'CPU占用优化',
          '界面交互设计',
          '多轮用户测试',
          '细节打磨',
          '文档完善',
          '自动化测试',
          '发布和更新机制'
        ]
      }
    }
  };

  // 默认模板（用于其他类型）
  const defaultTemplate = templates.tool;
  
  return templates[category] || defaultTemplate;
}

// Boss战方案生成
export function generateBossSolution(product, selectedSolutions) {
  const totalQualityImpact = selectedSolutions.reduce((sum, s) => sum + s.qualityImpact, 0);
  const avgQualityImpact = totalQualityImpact / selectedSolutions.length;
  
  // 基于玩家前三个季度的选择，生成Boss战的体力需求和完成度
  const baseStamina = product.baseStamina;
  const bossStamina = Math.round(baseStamina * 0.4); // Boss战占40%体力
  
  // 质量影响最终完成度的计算
  const baseCompletionRate = 50; // 基础完成度
  const qualityBonus = avgQualityImpact * 30; // 质量加成
  
  return {
    name: `${product.name} - 最终发布`,
    description: `整合前三个季度的成果，完成${product.name}的最终开发和上线`,
    stamina: bossStamina,
    baseCompletionRate,
    qualityBonus,
    todos: generateBossTodos(product, selectedSolutions)
  };
}

function generateBossTodos(product, selectedSolutions) {
  const todos = [
    '整合各模块代码',
    '解决模块间的兼容性问题',
  ];
  
  // 根据前面选择的方案质量，添加不同的任务
  const avgQuality = selectedSolutions.reduce((sum, s) => sum + s.qualityImpact, 0) / 3;
  
  if (avgQuality < 0.8) {
    todos.push('修复遗留的bug');
    todos.push('补充缺失的功能');
  }
  
  todos.push('全链路测试');
  todos.push('性能压力测试');
  
  if (product.grade === 'A' || product.grade === 'S') {
    todos.push('安全漏洞扫描');
    todos.push('高并发测试');
  }
  
  todos.push('准备上线资料');
  todos.push('部署到生产环境');
  todos.push('监控系统就位');
  todos.push('正式发布');
  
  if (avgQuality > 1.2) {
    todos.push('运营推广准备');
    todos.push('用户反馈收集');
  }
  
  return todos;
}

