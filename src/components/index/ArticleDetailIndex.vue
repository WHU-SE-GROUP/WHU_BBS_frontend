<template>
  <a-layout>
    <a-layout id="article-detail-index">
      <IndexHeader class="header"/>
      <a-layout-content>
        <!-- 解决手机端mavonEditor代码块code布局问题 -->
        <main class="content" :style="$store.state.collapsed ? 'width: 100%;' : 'width: 100%;max-width: 1100px;'">
          <div class="article-left-buttons">
            <!-- 左边浮着的那些按钮 -->
            <LeftButtons
                @articleCommentCountFn="articleCommentCountFn"
                ref="child"/>
          </div>
          <a-row>
            <a-col :span="$store.state.collapsed ? 24 : 18"
                  :style="$store.state.collapsed ? '' : 'border-right: 20px solid #f0f2f5'">
              <!-- 文章详情 -->
              <ArticleDetail
                  @initLabelIds="initLabelIds"
                  @refreshComments="refreshComments"
                  style="background: #fff;"/>
              <br/>
              <!-- 文章评论 -->
              <ArticleComment
                  ref="articleComment"
                  :articleUserId="userId"
                  :articleCommentCount="articleCommentCount"
                  @refresh="refreshArticle"
                  style="background: #fff"/>
              <a-row>
                <a-col :span="24" style="height: 10px;"/>
              </a-row>
            </a-col>
            <a-col v-if="!$store.state.collapsed" :span="6">
              <!-- 作者板块 -->
              <AuthorBlock
                  v-if="finishArticleDetail"
                  :userId="userId"
                  style="background: #fff;"/>
              <a-row>
                <a-col :span="24" style="height: 10px;"/>
              </a-row>
              <!-- 相关文章 -->
              <RelatArticle
                  v-if="finishArticleDetail"
                  :labelIds="labelIds"
                  style="background: #fff;"/>
              <a-row>
                <a-col :span="24" style="height: 10px;"/>
              </a-row>
              <!-- 作者榜 -->
              <AuthorsList style="background: #fff;"/>
              <a-row>
                <a-col :span="24" style="height: 10px;"/>
              </a-row>
              <!-- 目录 -->
              <Toc v-if="articleHtml"
                  :articleHtml="articleHtml"
                  style="background: #fff;"/>
              <a-row>
                <a-col :span="24" style="height: 10px;"/>
              </a-row>
              <!-- 备案信息 -->
              <FilingInfo/>
            </a-col>
          </a-row>
        </main>
      </a-layout-content>
      <FooterButtons v-if="!$store.state.collapsed"/>
    </a-layout>
  </a-layout>
</template>

<script>
  import IndexHeader from "@/components/index/head/IndexHeader";
  import AuthorsList from "@/components/right/AuthorsList";
  import FilingInfo from "@/components/right/FilingInfo";
  import ArticleDetail from "@/components/article/ArticleDetail";
  import FooterButtons from "@/components/utils/FooterButtons";
  import LeftButtons from "@/components/article/LeftButtons";
  import ArticleComment from "@/components/comment/ArticleComment";
  import AuthorBlock from "@/components/right/AuthorBlock";
  import RelatArticle from "@/components/right/RelatArticle";
  import Toc from "@/components/right/MarkdownToc";
  import articleService from "@/service/articleService";

  export default {
    components: {
      IndexHeader,
      ArticleDetail,
      AuthorBlock,
      AuthorsList,
      FilingInfo,
      FooterButtons,
      LeftButtons,
      ArticleComment,
      RelatArticle,
      Toc
    },

    data() {
      return {
        articleHtml: '',
        finishArticleDetail: false,
        labelIds: [],
        // 当前文章的作者
        userId: 0,
        // 文章总的评论数
        articleCommentCount: 0,
      };
    },

    methods: {
      // 初始化标签等
      initLabelIds(labelIds, finishArticleDetail, userId, articleHtml) {
        this.labelIds = labelIds;
        this.finishArticleDetail = finishArticleDetail;
        this.userId = userId;
        this.articleHtml = articleHtml;
      },

      refresh() {
        // 获取文章一些统计数据
        this.$refs.child.getArticleCountById()
      },

      articleCommentCountFn(commentCount) {
        this.articleCommentCount = commentCount;
      },

      // 刷新评论列表
      refreshComments() {
        if (this.$refs.articleComment) {
          this.$refs.articleComment.refresh();
        }
      },

      // 刷新文章评论
      refreshArticle() {
        // 刷新评论计数等信息
        this.refresh()
      },

      // 获取文章评论数等统计信息
      async getArticleCountByArticleId() {
        try {
          const articleId = this.$route.params.id;
          const res = await articleService.getArticleCountById({ id:articleId });
          if (res.data.success) {
            // 更新评论数
            this.articleCommentCount = res.data.model.commentCount;
            // 通知左侧按钮组件更新数据
            if (this.$refs.child) {
              this.$refs.child.updateCounts(res.data.model);
            }
          }
        } catch (error) {
          console.error('获取文章统计数据失败:', error);
        }
      },
    }

  };
</script>


<style>
  #article-detail-index .header {
    position: fixed;
    width: 100%;
    z-index: 999;
    background: #fff;
    border-bottom: 1px solid #00000021;
  }

  #article-detail-index .content {
    margin-top: 64px;
  }

  #article-detail-index .ant-layout-header {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #article-detail-index .ant-layout-content {
    display: flex;
    justify-content: center;
  }

  #article-detail-index .article-left-buttons {
    position: relative;
    right: 70px;
    top: 140px;
  }

  #article-detail-index .ant-layout-header {
    background: #fff;
    height: auto;
    line-height: 2.3;
  }

  .index-drawer-wrap .ant-drawer-content-wrapper {
    width: 250px !important;
  }

  #components-layout-demo-custom-trigger .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
  }

  #components-layout-demo-custom-trigger .trigger:hover {
    color: #1890ff;
  }

  #components-layout-demo-custom-trigger .logo {
    height: 64px;
    background: rgba(255, 255, 255, 0.2);
    margin: 0;
  }
</style>