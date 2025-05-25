<template>
  <div class="view-history-panel">
    <div class="panel-header">
      <span>浏览历史</span>
      <a-button type="text" class="clear-btn" @click="onClearHistory">清空历史</a-button>
    </div>
    <a-list
      v-if="historyList.length > 0"
      :data-source="historyList"
      class="history-list"
    >
      <template #renderItem="{ item }">
        <a-list-item class="history-item">
          <div class="item-main">
            <div class="item-title" :title="item.title" @click="goToPost(item.id)">{{ item.title }}</div>
            <div class="item-preview">{{ item.preview }}</div>
          </div>
          <div class="item-meta">
            <span class="item-time">{{ item.timestamp }}</span>
            <a-button type="link" class="del-btn" @click="deleteItem(item.id)">删除</a-button>
          </div>
        </a-list-item>
      </template>
    </a-list>
    <div v-else class="empty-history">
      <img :src="emptyImg" alt="empty" class="empty-img" />
      <div class="empty-tip">暂无浏览历史</div>
    </div>
    <a-modal v-model:visible="clearModalVisible" title="确认清空历史？" @ok="doClearHistory" @cancel="clearModalVisible = false">
      此操作不可恢复，确定要清空所有浏览历史吗？
    </a-modal>
  </div>
</template>

<script>
export default {
  name: 'ViewHistoryPanel',
  data() {
    return {
      historyList: [],
      clearModalVisible: false,
      emptyImg: 'E:/Downloads/empty-history.png',
    };
  },
  methods: {
    onClearHistory() {
      this.clearModalVisible = true;
    },
    doClearHistory() {
      const key = 'forumViewHistory';
      localStorage.removeItem(key);
      this.historyList = [];
      this.clearModalVisible = false;
    },
    deleteItem(id) {
      const key = 'forumViewHistory';
      this.historyList = this.historyList.filter(item => item.id !== id);
      localStorage.setItem(key, JSON.stringify({ posts: this.historyList }));
    },
    goToPost(id) {
      this.$router.push(`/detail/${id}`);
    },
    loadHistory() {
      const key = 'forumViewHistory';
      try {
        const data = JSON.parse(localStorage.getItem(key));
        this.historyList = data && Array.isArray(data.posts) ? data.posts : [];
      } catch (e) {
        this.historyList = [];
      }
    },
  },
  mounted() {
    this.loadHistory();
  },
  activated() {
    this.loadHistory();
  }
};
</script>

<style scoped>
.view-history-panel {
  background: #fff;
  padding: 20px;
}
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
}
.clear-btn {
  color: #f5222d;
}
.history-list {
  margin-bottom: 0;
}
.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  padding: 12px 0;
}
.item-main {
  flex: 1;
  min-width: 0;
}
.item-title {
  font-weight: bold;
  color: #222;
  cursor: pointer;
  transition: color 0.2s;
}
.item-title:hover {
  color: #1890ff;
  font-weight: bold;
}
.item-preview {
  color: #666;
  font-size: 13px;
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px;
}
.item-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}
.item-time {
  color: #999;
  font-size: 12px;
}
.del-btn {
  color: #f5222d;
  font-size: 12px;
}
.empty-history {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}
.empty-img {
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
}
.empty-tip {
  color: #999;
  font-size: 15px;
}
</style> 