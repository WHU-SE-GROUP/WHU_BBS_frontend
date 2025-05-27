<template>
  <div class="auto-comment-bot">
    <div class="bot-header">
      <div class="title">
        <RobotOutlined /> 高级AI评论机器人
        <a-tooltip>
          <template #title>
            机器人将使用DeepSeek AI自动对文章生成评论
          </template>
          <QuestionCircleOutlined style="margin-left: 5px" />
        </a-tooltip>
        <a-tag v-if="useMockMode" color="orange" style="margin-left: 8px">本地模式</a-tag>
      </div>
      <div>
        <a-button 
          type="default" 
          size="small" 
          @click="switchProxy"
          style="margin-right: 8px"
          v-if="!useMockMode"
        >
          切换代理
        </a-button>
        <a-button 
          type="default" 
          size="small" 
          @click="testApiConnection"
          style="margin-right: 8px"
        >
          测试API
        </a-button>
        <a-button 
          type="primary" 
          size="small" 
          :loading="loading" 
          @click="generateAndPostComment"
          :disabled="!apiKeySet"
        >
          {{ apiKeySet ? '生成评论' : '请先设置API密钥' }}
        </a-button>
      </div>
    </div>

    <a-collapse v-model:activeKey="activeKey" :bordered="false">
      <a-collapse-panel key="1" header="评论设置">
        <div class="settings">
          <div class="setting-item">
            <div class="label">评论风格:</div>
            <a-select v-model:value="commentStyle" style="width: 100%">
              <a-select-option value="专业、有见解">专业、有见解</a-select-option>
              <a-select-option value="幽默、风趣">幽默、风趣</a-select-option>
              <a-select-option value="批判性思考">批判性思考</a-select-option>
              <a-select-option value="鼓励、积极">鼓励、积极</a-select-option>
              <a-select-option value="学术、引经据典">学术、引经据典</a-select-option>
            </a-select>
          </div>

          <div class="setting-item">
            <div class="label">API密钥:</div>
            <a-input-password 
              v-model:value="apiKey" 
              placeholder="输入您的DeepSeek API密钥" 
              @change="saveApiKey"
            />
            <div class="hint">密钥将保存在本地浏览器中</div>
          </div>

          <div class="setting-item">
            <div class="label">本地模式:</div>
            <a-switch v-model:checked="useMockMode" @change="toggleMockMode" />
            <div class="hint">开启后将使用本地模拟数据，无需联网和API密钥</div>
          </div>

          <div class="setting-item" v-if="!useMockMode">
            <div class="label">代理服务:</div>
            <a-alert type="info" show-icon>
              <template #message>
                如果直接API调用失败，系统将自动尝试使用多种代理服务
                <a @click="switchProxy">点击手动切换</a>
              </template>
            </a-alert>
          </div>
        </div>
      </a-collapse-panel>
    </a-collapse>

    <div v-if="previewComment" class="preview">
      <div class="preview-title">预览评论:</div>
      <div class="preview-content">{{ previewComment }}</div>
      <div class="action-buttons">
        <a-button type="primary" size="small" @click="postComment">发布评论</a-button>
        <a-button size="small" @click="cancelComment">取消</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { RobotOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue';
import deepseekService from '@/service/deepseekService';
import commentService from '@/service/commentService';
import axios from 'axios';

export default {
  name: 'AutoCommentBot',
  components: {
    RobotOutlined,
    QuestionCircleOutlined
  },
  props: {
    articleId: {
      type: [Number, String],
      required: true
    },
    articleContent: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      activeKey: [],
      commentStyle: '专业、有见解',
      apiKey: '',
      previewComment: '',
      loading: false,
      apiKeySet: false,
      useMockMode: false
    };
  },
  mounted() {
    // 从localStorage获取API密钥
    const savedApiKey = localStorage.getItem('deepseekApiKey');
    if (savedApiKey) {
      this.apiKey = savedApiKey;
      this.apiKeySet = true;
    }
    
    // 读取本地模式设置，默认为false（不使用本地模式）
    this.useMockMode = false;
  },
  methods: {
    saveApiKey() {
      if (this.apiKey) {
        localStorage.setItem('deepseekApiKey', this.apiKey);
        this.apiKeySet = true;
      } else {
        localStorage.removeItem('deepseekApiKey');
        this.apiKeySet = false;
      }
    },
    
    toggleMockMode(checked) {
      localStorage.setItem('useMockCommentMode', checked);
      
      // 如果开启了本地模式，无需API密钥也可使用
      if (checked) {
        this.apiKeySet = true;
      } else if (!this.apiKey) {
        this.apiKeySet = false;
      }
    },
    
    // 切换到下一个代理
    switchProxy() {
      const proxyIndex = parseInt(localStorage.getItem('corsProxyIndex') || '0');
      localStorage.setItem('corsProxyIndex', (proxyIndex + 1) % 6);
      this.$message.info('已切换到下一个代理服务');
    },
    
    async generateAndPostComment() {
      if (!this.apiKeySet && !this.useMockMode) {
        this.$message.error('请先设置DeepSeek API密钥或开启本地模式');
        this.activeKey = ['1']; // 打开设置面板
        return;
      }
      
      this.loading = true;
      try {
        const response = await deepseekService.generateComment({
          articleContent: this.articleContent,
          style: this.commentStyle,
          apiKey: this.apiKey
        });
        
        // 处理API响应
        if (response.data && response.data.choices && response.data.choices.length > 0 && response.data.choices[0].message) {
          this.previewComment = response.data.choices[0].message.content;
        } else {
          throw new Error('API返回数据格式不符合预期');
        }
      } catch (error) {
        // 不再自动切换到本地模式
        // 显示详细错误信息
        if ( error.choices && error.choices.length > 0 && error.choices[0].message) {
          this.previewComment = error.choices[0].message.content;
          return
        } else {
          throw new Error('API返回数据格式不符合预期');
        }
        let errorMessage = '未知错误';
        if (error.response) {
          errorMessage = `服务器错误 (${error.response.status})`;
        } else if (error.request) {
          errorMessage = '无法连接到API服务器';
        } else {
          errorMessage = error.message || '请求配置错误';
        }
        this.$message.error(`生成评论失败: ${errorMessage}`);
        console.error('生成评论详细错误:', error);
        
        // 提示用户可以手动切换到本地模式
        this.$confirm({
          title: 'API调用失败',
          content: `${errorMessage}。您可以手动开启本地模式来使用模拟评论功能。`,
          okText: '开启本地模式',
          cancelText: '取消',
          onOk: () => {
            this.useMockMode = true;
            this.toggleMockMode(true);
            this.$message.info('已启用本地模式，现在将重试生成评论');
            this.generateAndPostComment(); // 重试
          }
        });
      } finally {
        this.loading = false;
      }
    },
    
    async postComment() {
      if (!this.previewComment) return;
      
      try {
        await commentService.createComment({
          articleId: this.articleId,
          content: this.previewComment,
          preId: 0
        });
        
        this.$message.success('评论发布成功!');
        this.previewComment = '';
        this.$emit('refresh'); // 刷新评论列表
      } catch (error) {
        this.$message.error(`发布评论失败: ${error.desc || '未知错误'}`);
      }
    },
    
    cancelComment() {
      this.previewComment = '';
    },
    
    // 测试API连接
    testApiConnection() {
      if (!this.apiKey && !this.useMockMode) {
        this.$message.warning('请先设置API密钥或开启本地模式');
        this.activeKey = ['1']; // 打开设置面板
        return;
      }

      // 如果是本地模式，直接返回成功
      if (this.useMockMode) {
        this.$message.success('本地模式已开启，无需测试API连接');
        return;
      }

      this.loading = true;
      console.log('开始测试API连接...');
      
      // 获取当前选择的代理
      const proxyIndex = parseInt(localStorage.getItem('corsProxyIndex') || '0');
      const corsProxies = [
        'https://corsproxy.io/?',
        'https://cors-anywhere.herokuapp.com/',
        'https://proxy.cors.sh/',
        'https://cors-proxy.fringe.zone/',
        'https://cors-anywhere.azm.workers.dev/',
        'https://api.allorigins.win/raw?url='
      ];
      const corsProxy = corsProxies[proxyIndex % corsProxies.length];
      
      this.$message.info(`正在使用代理 #${proxyIndex+1} 测试API连接，请稍候...`);
      
      const apiUrl = 'https://api.deepseek.com/v1/chat/completions';
      
      // 使用更长的超时时间
      const timeout = 60000; // 1分钟超时
      
      // 尝试使用POST请求测试API连接
      axios.post(corsProxy + apiUrl, {
        model: "deepseek-chat",
        messages: [{ role: "user", content: "Test" }],
        max_tokens: 5
      }, {
        timeout: timeout,
        withCredentials: false,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        }
      })
      .then(res => {
        // 验证响应数据结构，确保是有效的API响应
        if (res.data && res.data.choices) {
          console.log('API测试成功:', res.data);
          this.$message.success('API连接测试成功!');
          
          // 既然API可用，可以关闭本地模式
          if (this.useMockMode) {
            this.$confirm({
              title: 'API连接成功',
              content: '您的API密钥有效，是否关闭本地模式，使用真实AI生成评论？',
              okText: '使用API',
              cancelText: '保持本地模式',
              onOk: () => {
                this.useMockMode = false;
                this.toggleMockMode(false);
                this.$message.info('已关闭本地模式，将使用DeepSeek API生成评论');
              }
            });
          }
        } else {
          // 响应格式不符合预期
          console.error('API响应格式不正确:', res.data);
          this.$message.error('API响应格式不正确，请检查API版本是否兼容');
        }
      })
      .catch(err => {
        // 检查错误对象是否包含有效的API响应（有些代理可能将成功响应包装在错误对象中）
        if (err.response && err.response.data && err.response.data.choices) {
          // 这实际上是成功的API响应
          console.log('API测试成功（从错误对象中提取）:', err.response.data);
          this.$message.success('API连接测试成功!');
          return;
        }
        
        // 特殊情况：如果err本身看起来像一个API响应（如包含id, choices等）
        if (err && err.id && err.choices && Array.isArray(err.choices)) {
          console.log('API测试成功（err对象本身是API响应）:', err);
          this.$message.success('API连接测试成功!');
          
          // 更新本地模式状态
          if (this.useMockMode) {
            this.$confirm({
              title: 'API连接成功',
              content: '您的API密钥有效，是否关闭本地模式，使用真实AI生成评论？',
              okText: '使用API',
              cancelText: '保持本地模式',
              onOk: () => {
                this.useMockMode = false;
                this.toggleMockMode(false);
                this.$message.info('已关闭本地模式，将使用DeepSeek API生成评论');
              }
            });
          }
          return;
        }
        
        console.error('API测试失败:', err);
        
        // 分析错误类型
        let errorMsg = '未知错误';
        let isTimeout = false;
        
        if (err.code === 'ECONNABORTED' || (err.message && err.message.includes('timeout'))) {
          errorMsg = '连接超时，代理服务器可能不可用';
          isTimeout = true;
        } else if (err.response) {
          errorMsg = `服务器错误 (${err.response.status})`;
          if (err.response.status === 401 || err.response.status === 403) {
            errorMsg = 'API密钥无效或已过期';
          }
        } else if (err.request) {
          errorMsg = '无法连接到服务器，可能是CORS策略问题或网络问题';
        } else {
          errorMsg = err.message;
        }
        
        this.$message.error(`API测试失败: ${errorMsg}`);
        
        // 提示用户
        this.$confirm({
          title: 'API连接失败',
          content: `${errorMsg}。您可以手动开启本地模式，使用模拟评论功能。`,
          okText: '开启本地模式',
          cancelText: isTimeout ? '切换代理重试' : '继续尝试',
          onOk: () => {
            this.useMockMode = true;
            this.toggleMockMode(true);
            this.$message.info('已启用本地模式，现在可以安全使用评论机器人');
          },
          onCancel: () => {
            this.switchProxy();
            this.$message.info('已切换代理，您可以再次尝试测试连接');
          }
        });
      })
      .finally(() => {
        this.loading = false;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.auto-comment-bot {
  margin: 20px 0;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  border: 1px solid #e8e8e8;
  
  .bot-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    
    .title {
      font-size: 16px;
      font-weight: 500;
      display: flex;
      align-items: center;
    }
  }
  
  .settings {
    .setting-item {
      margin-bottom: 10px;
      
      .label {
        margin-bottom: 5px;
        font-weight: 500;
      }
      
      .hint {
        font-size: 12px;
        color: #999;
        margin-top: 3px;
      }
    }
  }
  
  .preview {
    margin-top: 15px;
    border-top: 1px dashed #e8e8e8;
    padding-top: 15px;
    
    .preview-title {
      font-weight: 500;
      margin-bottom: 10px;
    }
    
    .preview-content {
      background-color: white;
      padding: 10px;
      border-radius: 4px;
      border: 1px solid #e8e8e8;
      margin-bottom: 10px;
    }
    
    .action-buttons {
      display: flex;
      gap: 10px;
    }
  }
}
</style> 