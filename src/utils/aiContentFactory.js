/**
 * AI内容生成工厂类（优化版）
 * - 现场生成内容（无缓存）
 * - 自动记录历史
 * - 无降级方案，如果AI失败则返回空内容
 */

import { aiService } from './aiService.js';

class AIContentFactory {
    constructor() {
        this.maxRetries = 2;
        this.requestTimeout = 30000;
        // 历史记录存储
        this.history = {
            productIdeas: [],
            devLog: [],
            employeeStory: [],
            productComments: [],
            dynamicNews: []
        };
    }

    /**
     * 生成产品创意（现场生成 + 记录历史）
     */
    async generateProductIdeas(params) {
        const prompt = this._buildProductIdeasPrompt(params);

        try {
            const content = await this._callAI(prompt);
            
            // 尝试解析JSON，失败则返回空
            let result;
            try {
                result = JSON.parse(content);
            } catch (e) {
                console.warn('产品创意JSON解析失败:', e);
                result = [];
            }

            // 记录历史
            this._addToHistory('productIdeas', {
                timestamp: Date.now(),
                params,
                result,
                source: 'ai'
            });

            return result;

        } catch (error) {
            console.error('产品创意生成失败:', error);
            
            // 记录为空结果
            this._addToHistory('productIdeas', {
                timestamp: Date.now(),
                params,
                result: [],
                source: 'empty'
            });

            return [];
        }
    }

    /**
     * 生成产品创意（流式版本）
     */
    async generateProductIdeasStream(params, onChunk, onComplete, onError) {
        const prompt = this._buildProductIdeasPrompt(params);
        let accumulatedContent = '';

        try {
            await aiService.sendSimpleStreamMessage(
                prompt,
                (chunk) => {
                    accumulatedContent += chunk;
                    if (onChunk) {
                        onChunk(chunk, accumulatedContent);
                    }
                },
                (fullContent) => {
                    // 尝试解析JSON
                    let result;
                    try {
                        result = JSON.parse(fullContent);
                    } catch (e) {
                        console.warn('产品创意JSON解析失败:', e);
                        result = [];
                    }

                    // 记录历史
                    this._addToHistory('productIdeas', {
                        timestamp: Date.now(),
                        params,
                        result,
                        source: 'ai'
                    });

                    if (onComplete) {
                        onComplete(result);
                    }
                },
                (error) => {
                    console.error('产品创意流式生成失败:', error);
                    
                    this._addToHistory('productIdeas', {
                        timestamp: Date.now(),
                        params,
                        result: [],
                        source: 'empty'
                    });

                    if (onError) {
                        onError(error);
                    }
                }
            );
        } catch (error) {
            console.error('产品创意流式生成失败:', error);
            if (onError) {
                onError(error);
            }
        }
    }

    /**
     * 生成产品开发日志（现场生成 + 记录历史）
     */
    async generateDevLog(params) {
        const prompt = this._buildDevLogPrompt(params);

        try {
            const content = await this._callAI(prompt);
            
            // 记录历史
            this._addToHistory('devLog', {
                timestamp: Date.now(),
                params,
                result: content,
                source: 'ai'
            });

            return content;

        } catch (error) {
            console.error('开发日志生成失败:', error);
            
            this._addToHistory('devLog', {
                timestamp: Date.now(),
                params,
                result: '',
                source: 'empty'
            });

            return '';
        }
    }

    /**
     * 生成产品开发日志（流式版本）
     */
    async generateDevLogStream(params, onChunk, onComplete, onError) {
        const prompt = this._buildDevLogPrompt(params);
        let accumulatedContent = '';

        try {
            await aiService.sendSimpleStreamMessage(
                prompt,
                (chunk) => {
                    accumulatedContent += chunk;
                    if (onChunk) {
                        onChunk(chunk, accumulatedContent);
                    }
                },
                (fullContent) => {
                    this._addToHistory('devLog', {
                        timestamp: Date.now(),
                        params,
                        result: fullContent,
                        source: 'ai'
                    });

                    if (onComplete) {
                        onComplete(fullContent);
                    }
                },
                (error) => {
                    console.error('开发日志流式生成失败:', error);
                    
                    this._addToHistory('devLog', {
                        timestamp: Date.now(),
                        params,
                        result: '',
                        source: 'empty'
                    });

                    if (onError) {
                        onError(error);
                    }
                }
            );
        } catch (error) {
            console.error('开发日志流式生成失败:', error);
            if (onError) {
                onError(error);
            }
        }
    }

    /**
     * 生成员工背景故事（现场生成 + 记录历史）
     */
    async generateEmployeeStory(params) {
        const prompt = this._buildEmployeeStoryPrompt(params);

        try {
            const content = await this._callAI(prompt);
            
            this._addToHistory('employeeStory', {
                timestamp: Date.now(),
                params,
                result: content,
                source: 'ai'
            });

            return content;

        } catch (error) {
            console.error('员工背景生成失败:', error);
            
            this._addToHistory('employeeStory', {
                timestamp: Date.now(),
                params,
                result: '',
                source: 'empty'
            });

            return '';
        }
    }

    /**
     * 生成员工背景故事（流式版本）
     */
    async generateEmployeeStoryStream(params, onChunk, onComplete, onError) {
        const prompt = this._buildEmployeeStoryPrompt(params);
        let accumulatedContent = '';

        try {
            await aiService.sendSimpleStreamMessage(
                prompt,
                (chunk) => {
                    accumulatedContent += chunk;
                    if (onChunk) {
                        onChunk(chunk, accumulatedContent);
                    }
                },
                (fullContent) => {
                    this._addToHistory('employeeStory', {
                        timestamp: Date.now(),
                        params,
                        result: fullContent,
                        source: 'ai'
                    });

                    if (onComplete) {
                        onComplete(fullContent);
                    }
                },
                (error) => {
                    console.error('员工背景流式生成失败:', error);
                    
                    this._addToHistory('employeeStory', {
                        timestamp: Date.now(),
                        params,
                        result: '',
                        source: 'empty'
                    });

                    if (onError) {
                        onError(error);
                    }
                }
            );
        } catch (error) {
            console.error('员工背景流式生成失败:', error);
            if (onError) {
                onError(error);
            }
        }
    }

    /**
     * 生成产品用户评论（现场生成 + 记录历史）
     */
    async generateProductComments(params) {
        const prompt = this._buildProductCommentsPrompt(params);

        try {
            const content = await this._callAI(prompt);
            
            let result;
            try {
                result = JSON.parse(content);
            } catch (e) {
                console.warn('产品评论JSON解析失败:', e);
                result = [];
            }

            this._addToHistory('productComments', {
                timestamp: Date.now(),
                params,
                result,
                source: 'ai'
            });

            return result;

        } catch (error) {
            console.error('产品评论生成失败:', error);
            
            this._addToHistory('productComments', {
                timestamp: Date.now(),
                params,
                result: [],
                source: 'empty'
            });

            return [];
        }
    }

    /**
     * 生成产品用户评论（流式版本）
     */
    async generateProductCommentsStream(params, onChunk, onComplete, onError) {
        const prompt = this._buildProductCommentsPrompt(params);
        let accumulatedContent = '';

        try {
            await aiService.sendSimpleStreamMessage(
                prompt,
                (chunk) => {
                    accumulatedContent += chunk;
                    if (onChunk) {
                        onChunk(chunk, accumulatedContent);
                    }
                },
                (fullContent) => {
                    // 尝试解析JSON
                    let result;
                    try {
                        result = JSON.parse(fullContent);
                    } catch (e) {
                        console.warn('产品评论JSON解析失败:', e);
                        result = [];
                    }

                    this._addToHistory('productComments', {
                        timestamp: Date.now(),
                        params,
                        result,
                        source: 'ai'
                    });

                    if (onComplete) {
                        onComplete(result);
                    }
                },
                (error) => {
                    console.error('产品评论流式生成失败:', error);
                    
                    this._addToHistory('productComments', {
                        timestamp: Date.now(),
                        params,
                        result: [],
                        source: 'empty'
                    });

                    if (onError) {
                        onError(error);
                    }
                }
            );
        } catch (error) {
            console.error('产品评论流式生成失败:', error);
            if (onError) {
                onError(error);
            }
        }
    }

    /**
     * 生成动态新闻事件（现场生成 + 记录历史）
     */
    async generateDynamicNews(params) {
        const prompt = this._buildDynamicNewsPrompt(params);

        try {
            const content = await this._callAI(prompt);
            
            this._addToHistory('dynamicNews', {
                timestamp: Date.now(),
                params,
                result: content,
                source: 'ai'
            });

            return content;

        } catch (error) {
            console.error('动态新闻生成失败:', error);
            
            this._addToHistory('dynamicNews', {
                timestamp: Date.now(),
                params,
                result: '',
                source: 'empty'
            });

            return '';
        }
    }

    /**
     * 生成动态新闻事件（流式版本）
     */
    async generateDynamicNewsStream(params, onChunk, onComplete, onError) {
        const prompt = this._buildDynamicNewsPrompt(params);
        let accumulatedContent = '';

        try {
            await aiService.sendSimpleStreamMessage(
                prompt,
                (chunk) => {
                    accumulatedContent += chunk;
                    if (onChunk) {
                        onChunk(chunk, accumulatedContent);
                    }
                },
                (fullContent) => {
                    this._addToHistory('dynamicNews', {
                        timestamp: Date.now(),
                        params,
                        result: fullContent,
                        source: 'ai'
                    });

                    if (onComplete) {
                        onComplete(fullContent);
                    }
                },
                (error) => {
                    console.error('动态新闻流式生成失败:', error);
                    
                    this._addToHistory('dynamicNews', {
                        timestamp: Date.now(),
                        params,
                        result: '',
                        source: 'empty'
                    });

                    if (onError) {
                        onError(error);
                    }
                }
            );
        } catch (error) {
            console.error('动态新闻流式生成失败:', error);
            if (onError) {
                onError(error);
            }
        }
    }

    /**
     * 内部方法：调用AI服务
     */
    async _callAI(prompt, retries = 2) {
        let lastError;
        
        for (let i = 0; i <= retries; i++) {
            try {
                const result = await aiService.sendSimpleMessage(prompt);
                if (result) {
                    return result;
                }
            } catch (error) {
                lastError = error;
                console.warn(`AI调用失败 (第${i + 1}次):`, error.message);
                
                if (i < retries) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }

        throw lastError || new Error('AI调用失败');
    }

    /**
     * 添加到历史记录
     */
    _addToHistory(type, record) {
        if (!this.history[type]) {
            this.history[type] = [];
        }
        
        // 保留最近100条记录
        this.history[type].unshift(record);
        if (this.history[type].length > 100) {
            this.history[type] = this.history[type].slice(0, 100);
        }

        console.log(`[历史记录] ${type} - 来源:${record.source} - 总数:${this.history[type].length}`);
    }

    /**
     * 获取历史记录
     */
    getHistory(type = null) {
        if (type) {
            return this.history[type] || [];
        }
        return this.history;
    }

    /**
     * 获取特定类型的最新N条记录
     */
    getRecentHistory(type, count = 10) {
        const records = this.history[type] || [];
        return records.slice(0, count);
    }

    /**
     * 清除历史记录
     */
    clearHistory(type = null) {
        if (type) {
            this.history[type] = [];
            console.log(`[历史清除] ${type}`);
        } else {
            this.history = {
                productIdeas: [],
                devLog: [],
                employeeStory: [],
                productComments: [],
                dynamicNews: []
            };
            console.log('[历史清除] 全部');
        }
    }

    // ========== Prompt构建方法 ==========

    _buildProductIdeasPrompt(params) {
        return `你是《软件开发物语》游戏的产品经理助手。请根据游戏状态和产品类型，生成有创意的产品方案。

【游戏背景】
- 当前年份：${params.year}年
- 时代：${params.era}
- 玩家公司：${params.companyName}
- 已有产品：${params.existingProducts?.join('、') || '无'}
- 公司特点：${params.companyStrength}

【产品需求】
- 产品类型：${params.category}
- 产品等级：${params.grade}级
- 变现方式：${params.monetization}

【市场环境】
- 当前热点：${params.trendingTopics?.join('、') || '市场稳定'}
- 竞争对手：${params.competitors?.join('、') || '无数据'}
- 用户痛点：${params.userPainPoints?.join('、') || '未知'}

【生成要求】
1. 生成3个不同风格的产品创意
2. 每个创意包含：name(3-8字), slogan(8-15字), description(30-50字), highlights(1-2个关键特性)
3. 符合时代背景
4. 等级匹配：C级-单点功能小而美、B级-多功能平台、A级-行业革新、S级-跨行业整合
5. 创意要合理，避免科幻化

【输出格式】
返回JSON数组：
[
  {"name": "产品名称", "slogan": "slogan", "description": "描述", "highlights": ["特性1", "特性2"]},
  ...
]`;
    }

    _buildDevLogPrompt(params) {
        // 获取时代对应的技术栈提示
        const getTechStackHint = (year, era) => {
            if (era === 'ai' || year >= 2017) {
                return '深度学习框架(TensorFlow/PyTorch)、云原生(Docker/K8s)、微服务架构、React/Vue 3、GraphQL、大数据处理';
            } else if (era === 'mobile' || year >= 2011) {
                return 'iOS/Android原生开发、React Native、微信小程序、Node.js、MongoDB、RESTful API、响应式设计';
            } else {
                return 'Java/PHP/.NET、MySQL/Oracle、Apache/Nginx、jQuery、Ajax、MVC架构、Flash/Silverlight';
            }
        };
        
        const techHint = getTechStackHint(params.year, params.era);
        const employeeNames = params.employees?.map(e => e.name).join('、') || '待定';
        const hasEmployees = params.employees && params.employees.length > 0;
        
        return `你是《软件开发物语》游戏的开发日志生成器。请根据产品开发状态生成一条真实的开发日志。

【产品信息】
- 产品名称：${params.productName}
- 产品类型：${params.category}
- 产品等级：${params.grade}
- 开发方案：${params.solution}

【时代背景】
- 年份：${params.year}年
- 时代：${params.era === 'ai' ? 'AI时代' : params.era === 'mobile' ? '移动互联网时代' : 'PC互联网时代'}
- 主流技术：${techHint}

【团队信息】
- 参与员工：${employeeNames}${hasEmployees ? `（编程${params.avgProgramming}、美术${params.avgArt}、商业${params.avgBusiness}）` : ''}
- 团队状态：${params.teamStatus}

【开发进度】
- 当前任务：${params.currentTask}
- 完成进度：${params.progress}%
- 开发周数：第${params.week}周 / 共${params.totalWeeks}周
- 是否延期：${params.isDelayed ? '是' : '否'}

【生成要求】
1. 长度：50-80字
2. 口吻：像项目周报，专业且具体
3. **必须提及参与的员工姓名**（如"${employeeNames?.split('、')[0] || '某某'}完成了XX"、"${employeeNames?.split('、')[1] || '某某'}正在攻克YY"）
4. **必须使用符合${params.year}年时代背景的技术栈**，从"${techHint}"中选择合适的技术
5. 描述具体的技术实现、架构设计或产品决策
6. 根据进度体现开发阶段（初期-架构搭建，中期-功能开发，后期-测试优化）
7. 如果团队能力较低（<60），可提及遇到的技术挑战
8. 避免空洞表述，要有具体细节

【输出格式】
直接输出日志文本，不要前缀、不要额外说明。

示例参考：
- "${employeeNames?.split('、')[0] || '张三'}完成了用户认证模块，采用JWT方案；${employeeNames?.split('、')[1] || '李四'}优化了数据库索引，查询性能提升40%"
- "架构评审通过，${employeeNames?.split('、')[0] || '王五'}搭建起基于Spring Boot的后端框架，${employeeNames?.split('、')[1] || '赵六'}完成了React前端脚手架"`;
    }

    _buildEmployeeStoryPrompt(params) {
        return `你是《软件开发物语》游戏的角色故事创作者。请为一名候选人生成简短的背景故事。

【员工信息】
- 姓名：${params.name}
- 个性：${params.personality}
- 能力值：编程${params.programming}/100，美术${params.art}/100，商业${params.business}/100
- 期望薪资：¥${params.salary}/月
- 招聘渠道：${params.channel}

【当前游戏背景】
- 年份：${params.year}年
- 时代：${params.era}

【生成要求】
1. 长度：80-120字
2. 包含要素：教育/工作经历(1-2句)、能力特点体现、个性体现、求职动机
3. 符合中国互联网行业求职者画像
4. 提及符合时代背景的技术/产品
5. 避免模板化，突出独特性

【输出格式】
直接输出背景故事文本。`;
    }

    _buildProductCommentsPrompt(params) {
        return `你是《软件开发物语》游戏的用户评论生成器。请根据产品状态生成真实的用户评论。

【产品信息】
- 产品名称：${params.productName}
- 产品类型：${params.category}
- 产品等级：${params.grade}级
- 上线时间：${params.weeksSinceLaunch}周前
- 开发方案：${params.solution}

【产品数据】
- DAU：${params.dau}
- 用户评分：${params.rating}星
- 增长趋势：${params.trend}
- 月收入：¥${params.revenue}

【评论场景】
${params.scenario || 'steady_operation'}

【评论角色类型】（随机选择）
- 忠实用户：长期使用，建设性建议(40%)
- 新用户：第一印象(30%)
- 批评者：指出问题(20%)
- 路人：中立态度(10%)

【生成要求】
1. 生成3条不同角度的评论
2. 长度：20-50字
3. 语气：口语化，符合中文互联网表达
4. 真实感：像应用商店评论
5. 关联性：评论内容与产品数据匹配
   - 评分高→正面为主
   - 评分低→负面为主
   - 快速方案→可提及"功能简陋"、"bug多"
   - 精益方案→可提及"体验流畅"、"细节到位"

【输出格式】
返回JSON数组：
[
  {"author": "用户昵称", "rating": 4, "content": "评论内容", "sentiment": "positive"},
  ...
]`;
    }

    _buildDynamicNewsPrompt(params) {
        return `你是《软件开发物语》游戏的新闻事件生成器。请根据游戏状态生成一条符合时代背景的互联网行业新闻。

【游戏状态】
- 当前年份：${params.year}年
- 当前时代：${params.era}
- 玩家公司：${params.companyName}
- 公司规模：${params.employeeCount}人，${params.productCount}个产品
- 主力产品：${params.mainProducts?.map(p => p.name).join('、') || '无'}
- 市场地位：${params.marketPosition}

【新闻类型】（随机选择）
- 市场趋势：某类产品/技术正在流行(30%)
- 竞争对手：其他公司的动态(25%)
- 政策法规：互联网监管政策变化(15%)
- 技术创新：新技术突破或工具发布(15%)
- 用户行为：用户习惯/偏好的变化(10%)
- 行业事件：收购、倒闭、IPO等重大事件(5%)

【生成要求】
1. 新闻长度：50-80字
2. 语气：客观陈述，使用emoji增强可读性
3. 时代特征：必须符合${params.era}的技术特点和行业热点
4. 与玩家相关：如有相关领域产品，可提及该领域
5. 真实感：模拟真实互联网行业新闻风格

【输出格式】
直接输出新闻文本，不要额外说明。`;
    }

    // ========== 降级方案 ==========
    // (已移除 - 不再使用降级方案)
}

// 导出单例
export const aiContentFactory = new AIContentFactory();
