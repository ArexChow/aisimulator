
// AI 服务配置，和豆包的交互都在这里了
export const BYTEDANCE_API_KEY = 'faebc580-22a2-4511-843f-caa42972c049'
const MODEL_ID = 'ep-20250612144108-pkkch' //seed 1.6 -flash
// const MODEL_ID = 'ep-20250612144705-zpssw' //seed 1.6 

const API_BASE_URL = 'https://ark.cn-beijing.volces.com/api/v3/context'
export const API_BASE_URL_COMPLETIONS = 'https://ark.cn-beijing.volces.com/api/v3'

// 简化的 TextDecoder polyfill for UTF-8，适用于微信小程序


export const getModelId = () => {
    return MODEL_ID
}

function TextDecoderLite(encoding) {
    if (encoding !== 'utf-8' && encoding !== 'utf8') {
        throw new Error('Only utf-8 encoding is supported by TextDecoderLite');
    }
    this.decode = function (bytes) {
        let result = '';
        let i = 0;
        while (i < bytes.length) {
            let byte1 = bytes[i++];
            if (byte1 < 0x80) {
                result += String.fromCharCode(byte1);
            } else if ((byte1 & 0xE0) === 0xC0) {
                let byte2 = bytes[i++];
                result += String.fromCharCode(((byte1 & 0x1F) << 6) | (byte2 & 0x3F));
            } else if ((byte1 & 0xF0) === 0xE0) {
                let byte2 = bytes[i++];
                let byte3 = bytes[i++];
                result += String.fromCharCode(((byte1 & 0x0F) << 12) | ((byte2 & 0x3F) << 6) | (byte3 & 0x3F));
            } else if ((byte1 & 0xF8) === 0xF0) {
                let byte2 = bytes[i++];
                let byte3 = bytes[i++];
                let byte4 = bytes[i++];
                let codePoint = ((byte1 & 0x07) << 18) | ((byte2 & 0x3F) << 12) | ((byte3 & 0x3F) << 6) | (byte4 & 0x3F);
                if (codePoint < 0x10000) {
                    result += String.fromCharCode(codePoint);
                } else {
                    codePoint -= 0x10000;
                    result += String.fromCharCode(0xD800 + (codePoint >> 10));
                    result += String.fromCharCode(0xDC00 + (codePoint & 0x3FF));
                }
            }
        }
        return result;
    };
}

class AIService {


    constructor() {
        this.contextId = ''
        this.previous_response_id = ""
        this.requestStartTime = 0
    }

    // 创建上下文
    async createContext(systemPrompt) {
        try {
            const response = await uni.request({
                url: `${API_BASE_URL_COMPLETIONS}/responses`,
                method: 'POST',
                header: {
                    'Authorization': `Bearer ${BYTEDANCE_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    model: getModelId(),
                    input: [
                        systemPrompt
                    ],
                    ...this._requestData(),
                }
            });

            console.log("createContext response",response,`${API_BASE_URL_COMPLETIONS}/responses`)
            if (response.data.id) {
                console.log("创建上下文成功，返回：", response);
                this.contextId = response.data.id;
                return this.contextId;
            }
        } catch (error) {
            console.error('创建上下文缓存失败:', error);
            throw error;
        }
    }


    _requestData() {
        return {
            store: true,
            thinking: {
                type: "disabled"
            },
            caching: {
                type: "enabled"
            },
            expire_at: parseInt(new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).getTime() / 1000), //两天的缓存
        }
    }


    // 发送消息给 AI
    async sendMessage(message) {
        if (!this.contextId) {
            throw new Error('Context not initialized');
        }

        this.requestStartTime = Date.now();

        try {
            const response = await uni.request({
                url: `${API_BASE_URL_COMPLETIONS}/responses`,
                method: 'POST',
                header: {
                    'Authorization': `Bearer ${BYTEDANCE_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    model: getModelId(),
                    previous_response_id: this.contextId,
                    input: [
                        {
                            role: "user",
                            content: message
                        }
                    ],
                    ...this._requestData()
                }
            });

            console.log("sendMessage response?.data", response?.data);

            if (response?.data?.output?.[0]?.content?.[0]?.text) {
                const duration = Date.now() - this.requestStartTime;
                console.log(`输入：`, message);
                console.log(`AI响应总耗时: ${duration}ms，返回：`, response.data);
                return response.data.output[0].content[0].text;
            } else if (response?.data?.error?.param === "previous_response_id") {
                uni.showToast({
                    title: "存档读取失败,无法关联上下文,重新开始游戏"
                })
                throw new Error("previous_response_id")

            }
        } catch (error) {
            console.error('发送消息失败:', error);
            const duration = Date.now() - this.requestStartTime;
            console.log(`请求失败耗时: ${duration}ms`);
            throw error;
        }
    }

    async sendSysMessage(message) {
        this.requestStartTime = Date.now();
        const data = {
            model: getModelId(),
            input: [
                {
                    role: "system",
                    content: message
                }
            ],
            ...this._requestData()
        }
        if (this.contextId) {
            data.previous_response_id = this.contextId
        }

        try {
            const response = await uni.request({
                url: `${API_BASE_URL_COMPLETIONS}/responses`,
                method: 'POST',
                header: {
                    'Authorization': `Bearer ${BYTEDANCE_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                data: data
            });

            console.log("sendMessage response?.data", response?.data);

            if (response?.data?.output?.[0]?.content?.[0]?.text) {
                const duration = Date.now() - this.requestStartTime;
                console.log(`输入：`, message);
                console.log(`AI响应总耗时: ${duration}ms，返回：`, response.data);
                return response.data.output[0].content[0].text;
            } else if (response?.data?.error?.param === "previous_response_id") {
                uni.showToast({
                    title: "存档读取失败,无法关联上下文,重新开始游戏"
                })
                throw new Error("previous_response_id")

            }
        } catch (error) {
            console.error('发送消息失败:', error);
            const duration = Date.now() - this.requestStartTime;
            console.log(`请求失败耗时: ${duration}ms`);
            throw error;
        }
    }

    // 发送流式消息给 AI
    async sendStreamMessage(message, onMessageCallback, onCompleteCallback, onErrorCallback) {
        if (!this.contextId) {
            throw new Error('Context not initialized');
        }

        // #ifdef MP-WEIXIN

        this.requestStartTime = Date.now();
        let receivedContent = '';

        try {
            const requestTask = uni.request({
                url: `${API_BASE_URL_COMPLETIONS}/responses`,
                method: 'POST',
                header: {
                    'Authorization': `Bearer ${BYTEDANCE_API_KEY}`,
                    'Content-Type': 'application/json',
                    'Accept': 'text/event-stream' // 接受事件流
                },
                data: {
                    model: getModelId(),
                    previous_response_id: this.contextId,
                    input: [
                        {
                            role: "user",
                            content: message
                        }
                    ],
                    stream: true, // 开启流式传输
                    ...this._requestData()

                },
                responseType: 'text', // 响应类型为文本
                enableChunked: true, // 开启分块传输
                success: (res) => {
                    if (res.data.id) {
                        this.contextId = res.data.id;
                    }

                    // success 回调在整个请求完成后触发，对于流式请求，主要处理最终状态
                    if (res.statusCode === 200) {
                        console.log('Stream request completed successfully.');
                        if (onCompleteCallback) {
                            onCompleteCallback(receivedContent);
                        }
                    } else {
                        console.error('Stream request failed with status:', res.statusCode, res.data);
                        if (onErrorCallback) {
                            onErrorCallback(new Error(`Stream request failed with status: ${res.statusCode}`));
                        }
                    }
                },
                fail: (err) => {
                    console.error('Stream request failed:', err);
                    if (onErrorCallback) {
                        onErrorCallback(err);
                    }
                }
            });

            requestTask.onHeadersReceived((res) => {
                console.log('Headers received:', res.header);
            });

            requestTask.onChunkReceived((res) => {

                // res.data 是 ArrayBuffer，需要解码
                // 微信小程序不支持 TextDecoder，使用简化的 polyfill 进行解码
                const chunk = new TextDecoderLite('utf-8').decode(new Uint8Array(res.data));

                // 解析 SSE 格式的数据
                const lines = chunk.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data:')) {


                        const data = line.substring(5).trim();
                        if (data === '[DONE]') {
                            console.log('Stream finished.');
                            if (onCompleteCallback) {
                                // onCompleteCallback(receivedContent);
                            }
                            requestTask.abort(); // 终止请求
                            return;
                        }
                        try {
                            const json = JSON.parse(data);
                            if (json.type === 'response.output_text.delta') {
                                const content = json.delta;

                                if (content !== undefined && content !== "undefined") { // 确保 content 不是 undefined
                                    receivedContent += content;
                                    if (onMessageCallback) {
                                        onMessageCallback(content);
                                    }
                                }
                            } else if (json.type === 'response.completed') {
                                this.contextId = json?.response?.id
                                console.warn(">>>", json.response?.usage,json?.response?.output?.[0]?.content?.[0]?.text)
                                onCompleteCallback(json?.response?.output?.[0]?.content?.[0]?.text)
                            }
                        } catch (e) {
                            console.error('Failed to parse JSON from chunk:', data, e);
                        }
                    }
                }
            });

            // 返回 requestTask 允许外部控制（如 abort）
            return requestTask;

        } catch (error) {
            console.error('发送流式消息失败:', error);
            const duration = Date.now() - this.requestStartTime;
            console.log(`请求失败耗时: ${duration}ms`);
            if (onErrorCallback) {
                onErrorCallback(error);
            }
            throw error;
        }
        // #endif

        // #ifdef APP
        console.log("sendStreamMessage message", message)


        // #endif
    }

    // 处理用户选择
    async handleChoice(choice) {
        if (!this.contextId) {
            throw new Error('Context not initialized');
        }

        return this.sendMessage(choice.toString());
    }

    // 发送简单消息（一次性调用，无需上下文缓存）- 用于AI增强内容生成
    async sendSimpleMessage(message) {
        this.requestStartTime = Date.now();
        
        try {
            const response = await uni.request({
                url: `${API_BASE_URL_COMPLETIONS}/responses`,
                method: 'POST',
                header: {
                    'Authorization': `Bearer ${BYTEDANCE_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    model: getModelId(),
                    input: message  // 直接传入消息文本
                },
                thinking: {
                    type: "disabled"
                }
            });

            console.log("sendSimpleMessage response?.data", response?.data);

            if (response?.data?.output?.[0]?.content?.[0]?.text) {
                const duration = Date.now() - this.requestStartTime;
                console.log(`AI简单消息耗时: ${duration}ms，返回：`, response.data);
                return response.data.output[0].content[0].text;
            } else {
                throw new Error('AI响应格式错误: ' + JSON.stringify(response?.data));
            }
        } catch (error) {
            console.error('发送简单消息失败:', error);
            const duration = Date.now() - this.requestStartTime;
            console.log(`请求失败耗时: ${duration}ms`);
            throw error;
        }
    }

    // 发送简单流式消息（一次性调用，无需上下文缓存）- 用于AI增强内容生成的流式版本
    async sendSimpleStreamMessage(message, onMessageCallback, onCompleteCallback, onErrorCallback) {
        // #ifdef MP-WEIXIN
        this.requestStartTime = Date.now();
        let receivedContent = '';

        try {
            const requestTask = uni.request({
                url: `${API_BASE_URL_COMPLETIONS}/responses`,
                method: 'POST',
                header: {
                    'Authorization': `Bearer ${BYTEDANCE_API_KEY}`,
                    'Content-Type': 'application/json',
                    'Accept': 'text/event-stream'
                },
                data: {
                    model: getModelId(),
                    input: message,  // 直接传入消息文本，无需 previous_response_id
                    stream: true,
                    thinking: {
                        type: "disabled"
                    }
                },
                responseType: 'text',
                enableChunked: true,
                success: (res) => {
                    if (res.statusCode === 200) {
                        console.log('Simple stream request completed successfully.');
                        // onCompleteCallback 在 onChunkReceived 中已调用
                    } else {
                        console.error('Simple stream request failed with status:', res.statusCode, res.data);
                        if (onErrorCallback) {
                            onErrorCallback(new Error(`Stream request failed with status: ${res.statusCode}`));
                        }
                    }
                },
                fail: (err) => {
                    console.error('Simple stream request failed:', err);
                    if (onErrorCallback) {
                        onErrorCallback(err);
                    }
                }
            });

            requestTask.onHeadersReceived((res) => {
                console.log('Simple stream headers received:', res.header);
            });

            requestTask.onChunkReceived((res) => {
                const chunk = new TextDecoderLite('utf-8').decode(new Uint8Array(res.data));

                const lines = chunk.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data:')) {
                        const data = line.substring(5).trim();
                        if (data === '[DONE]') {
                            console.log('Simple stream finished.');
                            requestTask.abort();
                            return;
                        }
                        try {
                            const json = JSON.parse(data);
                            if (json.type === 'response.output_text.delta') {
                                const content = json.delta;
                                if (content !== undefined && content !== "undefined") {
                                    receivedContent += content;
                                    if (onMessageCallback) {
                                        onMessageCallback(content);
                                    }
                                }
                            } else if (json.type === 'response.completed') {
                                const fullContent = json?.response?.output?.[0]?.content?.[0]?.text;
                                console.log("Simple stream completed, usage:", json.response?.usage);
                                if (onCompleteCallback) {
                                    onCompleteCallback(fullContent || receivedContent);
                                }
                            }
                        } catch (e) {
                            console.error('Failed to parse JSON from simple stream chunk:', data, e);
                        }
                    }
                }
            });

            return requestTask;

        } catch (error) {
            console.error('发送简单流式消息失败:', error);
            const duration = Date.now() - this.requestStartTime;
            console.log(`请求失败耗时: ${duration}ms`);
            if (onErrorCallback) {
                onErrorCallback(error);
            }
            throw error;
        }
        // #endif

        // #ifdef APP
        console.log("sendSimpleStreamMessage not implemented for APP platform");
        if (onErrorCallback) {
            onErrorCallback(new Error('Stream not supported on APP platform'));
        }
        // #endif
    }

    // 获取当前请求开始时间
    getRequestStartTime() {
        return this.requestStartTime;
    }

    // 获取上下文 ID
    getContextId() {
        return this.contextId;
    }
}

// 导出单例实例
export const aiService = new AIService();

/**
 * 基于 Fetch + ReadableStream 实现的 SSE 客户端处理函数
 * @param {string} url - 请求地址
 * @param {Object} options - fetch 请求参数，如 headers、method、body 等
 * @param {(data: any) => void} onMessage - 每次接收到数据时的回调
 * @param {(msg: string) => void} onTip - 错误或提示信息回调
 */
export async function handleSSE({url, options = {}, onMessage, onTip}) {
    // 参数校验
    if (!url) {
        onTip?.("URL cannot be empty.");
        return;
    }
    if (!("EventSource" in window)) {
        onTip?.("The current device does not support EventSource.");
        return;
    }

    try {
        const res = await fetch(url, options);
        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const {done, value} = await reader.read();
            if (done) break;
            const text = decoder.decode(value);
            onMessage?.(text);
        }
    } catch (err) {
        onTip?.(`Error: ${err.message}`);
    }
}

