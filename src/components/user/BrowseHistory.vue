<template>
  <div class="browse-history">
    <div class="history-list">
      <a-empty v-if="historyList.length === 0" :description="$t('common.noData')" />
      <a-list v-else :data-source="historyList" :loading="loading">
        <template #renderItem="{ item }">
          <a-list-item>
            <div class="history-item" @click="goToPost(item.postId)">
              <div class="post-thumbnail" v-if="item.thumbnail">
                <img :src="item.thumbnail" :alt="item.title" />
              </div>
              <div class="post-info">
                <div class="post-title">{{ truncateTitle(item.title) }}</div>
                <div class="post-time">{{ formatTime(item.lastViewTime) }}</div>
              </div>
              <div class="post-actions">
                <a-button type="text" @click.stop="removeHistory(item.postId)">
                  <delete-outlined />
                </a-button>
              </div>
            </div>
          </a-list-item>
        </template>
      </a-list>
    </div>
    <div class="history-footer" v-if="historyList.length > 0">
      <a-button type="primary" danger @click="clearHistory">
        {{ $t('common.clearHistory') }}
      </a-button>
    </div>
  </div>
</template>

<script>
import { DeleteOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

const MAX_HISTORY = 100;
const HISTORY_KEY = 'browse_history';

export default {
  name: 'BrowseHistory',
  components: {
    DeleteOutlined
  },
  data() {
    return {
      historyList: [],
      loading: false
    };
  },
  methods: {
    // 获取历史记录
    getHistory() {
      const history = localStorage.getItem(HISTORY_KEY);
      this.historyList = history ? JSON.parse(history) : [];
    },
    
    // 添加历史记录
    addHistory(post) {
      const history = this.historyList;
      const index = history.findIndex(item => item.postId === post.postId);
      
      if (index > -1) {
        // 更新已存在的记录
        history[index].lastViewTime = Date.now();
        history.splice(index, 1);
        history.unshift(history[index]);
      } else {
        // 添加新记录
        history.unshift({
          postId: post.postId,
          title: post.title,
          thumbnail: post.thumbnail,
          lastViewTime: Date.now()
        });
      }
      
      // 限制记录数量
      if (history.length > MAX_HISTORY) {
        history.pop();
      }
      
      this.historyList = history;
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    },
    
    // 删除单条记录
    removeHistory(postId) {
      const history = this.historyList.filter(item => item.postId !== postId);
      this.historyList = history;
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      message.success(this.$t('common.deleteSuccess'));
    },
    
    // 清空历史记录
    clearHistory() {
      this.$confirm({
        title: this.$t('common.confirm'),
        content: this.$t('common.confirmClearHistory'),
        onOk: () => {
          this.historyList = [];
          localStorage.removeItem(HISTORY_KEY);
          message.success(this.$t('common.clearSuccess'));
        }
      });
    },
    
    // 跳转到帖子
    goToPost(postId) {
      this.$router.push(`/detail/${postId}`);
    },
    
    // 截断标题
    truncateTitle(title) {
      return title.length > 18 ? title.substring(0, 18) + '...' : title;
    },
    
    // 格式化时间
    formatTime(timestamp) {
      const now = Date.now();
      const diff = now - timestamp;
      
      const minute = 60 * 1000;
      const hour = 60 * minute;
      const day = 24 * hour;
      
      if (diff < minute) {
        return this.$t('common.justNow');
      } else if (diff < hour) {
        return `${Math.floor(diff / minute)}${this.$t('common.minutesAgo')}`;
      } else if (diff < day) {
        return `${Math.floor(diff / hour)}${this.$t('common.hoursAgo')}`;
      } else {
        return new Date(timestamp).toLocaleDateString();
      }
    }
  },
  mounted() {
    this.getHistory();
  }
};
</script>

<style scoped>
.browse-history {
  padding: 16px;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 12px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.history-item:hover {
  background-color: #f5f5f5;
}

.post-thumbnail {
  width: 80px;
  height: 60px;
  margin-right: 16px;
  overflow: hidden;
  border-radius: 4px;
}

.post-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-info {
  flex: 1;
}

.post-title {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}

.post-time {
  font-size: 12px;
  color: #999;
}

.post-actions {
  margin-left: 16px;
}

.history-footer {
  margin-top: 16px;
  text-align: center;
}
</style> 