<template>
  <div id="hot-articles" v-if="isHomePage">
    <header class="hot-articles-header">
      <i class="iconfont icon-fire" :style="{ color: $store.state.themeColor}"></i>
      {{ $t("common.hotArticles") }}
    </header>
    <a-divider style="margin: 0 0 5px 0;"/>
    <div class="article-list">
      <div v-for="(item, index) in hotArticles" 
           :key="item.id" 
           class="article-item"
           @click="routerArticleDetail(item.id)">
        <span class="rank" :class="{ 'top-three': index < 3 }">{{ index + 1 }}</span>
        <span class="title">{{ item.title }}</span>
        <span class="views">
          <EyeOutlined />
          {{ item.pv }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { EyeOutlined } from '@ant-design/icons-vue';
import articleService from "@/service/articleService";

export default {
  name: "HotArticles",
  components: {
    EyeOutlined
  },
  data() {
    return {
      hotArticles: [],
      params: {
        currentPage: 1,
        pageSize: 10  // 显示5篇热门文章
      }
    };
  },
  computed: {
    isHomePage() {
      // 只在主页（"/"）显示热门文章
      return this.$route.path === '/';
    }
  },
  methods: {
    getHotArticles() {
      // 只在主页时获取数据
      if (this.isHomePage) {
        articleService.getArticleList(this.params)
          .then(res => {
            if (res.code === 0) {
              // 按浏览量排序并取前10篇
              this.hotArticles = res.data.list
                .sort((a, b) => b.pv - a.pv)
                .slice(0, 10);
            }
          })
          .catch(err => {
            this.$message.error(err.desc);
          });
      }
    },
    routerArticleDetail(id) {
      let routeData = this.$router.resolve("/article/" + id);
      window.open(routeData.href, '_blank');
    }
  },
  mounted() {
    this.getHotArticles();
  },
  watch: {
    // 监听路由变化
    '$route.path': {
      handler(newPath) {
        if (newPath === '/') {
          this.getHotArticles();
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
#hot-articles {
  padding: 15px;

  .hot-articles-header {
    padding-bottom: 15px;
  }

  .article-list {
    .article-item {
      display: flex;
      align-items: center;
      padding: 8px 0;
      cursor: pointer;
      
      &:hover {
        background-color: #f5f5f5;
      }

      .rank {
        width: 20px;
        text-align: center;
        font-weight: bold;
        margin-right: 8px;
        
        &.top-three {
          color: #ff4d4f;
        }
      }

      .title {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .views {
        color: #999;
        font-size: 12px;
        margin-left: 8px;
        
        .anticon {
          margin-right: 4px;
        }
      }
    }
  }
}
</style> 