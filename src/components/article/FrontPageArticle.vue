<template>
  <div id="main-article-content">
    <a-list item-layout="vertical" size="large" :data-source="tempData">
      <template #renderItem="{ item, index }">
        <a-list-item slot="renderItem" key="item.title" slot-scope="item, index" style="cursor: pointer;"
                   @click="routerArticleDetail(item.id)">
          <template #actions>
            <!-- 浏览量/点赞/评论 -->
          <div v-for="(type,cindex) in actions" slot="actions" :key="cindex">
            <span class="collectLikeComment" :key="type">
                  <span v-if="type.type==='eye'">
                      <!-- <a-icon :type="type" style="margin-right: 6px;"/> -->
                      <EyeOutlined style="margin-right: 6px;"/>
                      <span v-text="item.pv"></span>
                  </span>
                  <span v-if="type.type==='like-o'" @click.stop="pageViewsLikeComment(type, item.id, index)">
                      <span v-if="item.articleCountDTO.isLike" :style="{color: $store.state.themeColor}">
                          <!-- <a-icon :type="type" style="margin-right: 6px"/> -->
                          <LikeOutlined style="margin-right: 6px"/>
                          <span v-text="item.articleCountDTO.likeCount"></span>
                      </span>
                      <span v-if="!item.articleCountDTO.isLike">
                          <!-- <a-icon :type="type" style="margin-right: 8px"/> -->
                          <LikeOutlined style="margin-right: 8px"/>
                          <span v-text="item.articleCountDTO.likeCount"></span>
                      </span>
                  </span>
                  <span v-if="type.type==='message'" @click.stop="routerArticleDetailToComment(item.id)">
                      <!-- <a-icon :type="type" style="margin-right: 6px;"/> -->
                      <MessageOutlined style="margin-right: 6px;"/>
                      <span v-text="item.articleCountDTO.commentCount"></span>
                  </span>
                  <span
                      v-if="(($store.state.isManage && isAdminAudit) || $store.state.userId === item.createUser) && type.type==='ellipsis'"
                      @click.stop>
                    <a-dropdown :placement="'bottomCenter'" :trigger="['click']">
                      <template #overlay>
                        <a-menu>
                          <!-- 审核通过 -->
                          <a-menu-item key="articlePass"
                                      v-if="($store.state.isManage && isAdminAudit) && (item.state === -1 || item.state !== 1)"
                                      @click="updateState(item.id, item.state, 1)">
                            {{ ' ' + $t("common.pass") }}
                          </a-menu-item>
                          <!-- 审核拒绝 -->
                          <a-menu-item key="articleReject"
                                      v-if="($store.state.isManage && isAdminAudit) && (item.state === -1 || item.state !== 0)"
                                      @click="updateState(item.id, item.state, 0)">
                            <span style="color: red">{{ ' ' + $t("common.reject") }}</span>
                          </a-menu-item>
                          <!-- 文章置顶 -->
                          <a-menu-item key="articleNotTop" v-if="$store.state.isManage && isAdminAudit && !item.top"
                                      @click="articleTop(item.id)">
                            <span style="color: #1869ff">{{ ' ' + $t("common.isTop") }}</span>
                          </a-menu-item>
                          <!-- 文章取消置顶 -->
                          <a-menu-item key="articleTop" v-if="$store.state.isManage && isAdminAudit && item.top"
                                      @click="articleNotTop(item.id)">
                            <span style="color: #eb2f96">{{ ' ' + $t("common.isNotTop") }}</span>
                          </a-menu-item>
                          <!-- 文章编辑 -->
                          <a-menu-item key="articleEdit" v-if="$store.state.userId === item.createUser"
                                      @click="routerArticleEdit(item.id)">
                            <span style="color: #722ed1">{{ ' ' + $t("common.edit") }}</span>
                          </a-menu-item>
                          <!-- 文章删除 -->
                          <a-menu-item key="articleDel" v-if="$store.state.userId === item.createUser"
                                      @click="articleDelete(item.id, index)">
                            <span style="color: red">{{ ' ' + $t("common.delete") }}</span>
                          </a-menu-item>
                        </a-menu>
                      </template>
                      <div class="options">
                      <!-- <a-icon :type="type"/> -->
                      <EllipsisOutlined />
                    </div>
                    </a-dropdown>
                  </span>
              </span>
            </div>
          </template>
          <!-- 标签/题图 -->
          <template #extra>
            <div slot="extra" class="label-titleMap">
              <div slot="title">
                <a v-for="(label, index) in item.labelDTOS" :key="item.labelName" style="float: right"
                  @click.stop="routerLabelToArticle(label.id)">
                  <span class="label-name">{{ label.labelName }}</span>
                  <a-divider v-if="index !== 0" type="vertical"/>
                </a>
              </div>
              <div>
                <img style="padding-top: 10px" :width="$store.state.collapsed ? 80 : 150" alt="logo" v-if="item.titleMap"
                    :src="item.titleMap"/>
              </div>
            </div>
          </template>
          <!-- 用户/标题 -->
          <a-list-item-meta :description="item.title">
            <template #title>
              <a slot="title" class="username" @click.stop="routerUserCenter(item.createUser)">
                <div class="left">
                  <span slot="title" style="padding-right: 2px;"> {{ item.createUserName }} </span>
                  <img :src="require('@/assets/img/level/' + item.level + '.svg')" alt="" @click.stop="routerBook"/>
                  <small style="color: #b5b9b9; padding-left: 10px" v-text="$utils.showtime(item.createTime)"></small>
                  <!-- 用户中心 -->
                  <div v-if="isUserCenter && ($store.state.userId === userId || $store.state.isManage)">
                    <small style="color: #faad14; padding-left: 10px" v-if="item.state === -1">{{
                        $t("common.pendingReview")
                      }}</small>
                    <small style="color: red; padding-left: 10px" v-if="item.state === 0">{{
                        $t("common.auditReviewRejected")
                      }}</small>
                    <small style="color: #3eaf7c; padding-left: 10px" v-if="item.state === 1">{{
                        $t("common.auditApproved")
                      }}</small>
                  </div>
                </div>
                <!-- 置顶图标 -->
                <a-tooltip placement="left">
                  <template #title>
                    {{ $t("common.top") }}
                  </template>
                  <!-- <a-icon type="fire" :style="{color: $store.state.themeColor}" v-if="item.top"/> -->
                  <FireOutlined :style="{color: $store.state.themeColor}" v-if="item.top"/>
                  <!--              <a-icon type="thunderbolt" :style="{color: $store.state.themeColor}" v-if="item.top" />-->
                  <!--              <i class="iconfont icon-right-triangle" :style="{color: $store.state.themeColor}" v-if="item.top"></i>-->
                </a-tooltip>
              </a>
            </template>
            <template #avatar>
              <a-avatar slot="avatar" :src="item.picture ? item.picture : require('@/assets/img/default_avatar.png')"
                      @click.stop="routerUserCenter(item.createUser)"/>
            </template>
          </a-list-item-meta>
          <div class="article-content">
            {{ item.content }}
          </div>
          <!-- 热评展示 -->
          <div class="article-hot-comment" v-if="item.articleCountDTO && item.articleCountDTO.commentCount > 0">
            <div class="hot-comment-header">
              <div class="hot-comment-title">
                <a-icon type="fire" theme="filled" style="color: #ff4d4f; margin-right: 4px;" />
                <span style="font-weight: 600;">热门评论</span>
              </div>
            </div>
            <div class="hot-comment-content">
              <div class="hot-comment-user">
                <a-avatar :size="24" :src="item.hotComment?.picture || require('@/assets/img/default_avatar.png')" />
                <span class="username" v-if="item.hotComment?.commentUserName">
                  <a-icon type="fire" theme="filled" style="color: #ff4d4f; margin-right: 2px; font-size: 14px;" />
                  {{ item.hotComment.commentUserName }}
                </span>
                <span class="like-count">
                  <a-icon type="like" theme="filled" style="color: #ff4d4f;" />
                  {{ item.hotComment?.likeCount || 0 }} 点赞
                </span>
              </div>
              <div class="hot-comment-text">{{ item.hotComment?.content || '暂无热门评论' }}</div>
            </div>
          </div>
        </a-list-item>
      </template>

    </a-list>
    <div style="text-align: center; padding-bottom: 20px;" v-if="!hasNext && finish">
      <a-divider/>
      {{ $t("common.noAgain") }}
    </div>
  </div>
</template>
<script>
import userService from "@/service/userService";
import articleService from "@/service/articleService";
import commentService from "@/service/commentService";
import { EyeOutlined,LikeOutlined,MessageOutlined,EllipsisOutlined,FireOutlined } from '@ant-design/icons-vue';
import { Modal } from 'ant-design-vue';
import { nextTick } from 'vue';

export default {
  name: 'FrontPageArticle',
  props: {
    data: {type: Array, default: []},
    pageSize: {type: Number, default: 0},
    current: {type: Number, default: 1},
    finish: {type: Boolean, default: false},
    hasNext: {type: Boolean, default: false},
    isUserCenter: {type: Boolean, default: false},
    userId: {type: Number, default: 0},
    isAdminAudit: {type: Boolean, default: false},
  },
  data() {
    return {
      tempData: this.data,
      actions: [
        {type: 'eye', text: '156'},
        {type: 'like-o', text: '156'},
        {type: 'message', text: '2'},
        {type: 'ellipsis', text: '12'},
      ],
    };
  },
  components: {
    EyeOutlined,LikeOutlined,MessageOutlined,EllipsisOutlined,FireOutlined,
  },
  methods: {
    // 浏览点赞评论按钮的点击操作
    pageViewsLikeComment(type, articleId, index) {
      console.log("type", type,articleId);
      // 浏览量
      if (type.type === 'eye') {
        console.log("浏览量")
      }
      // 点赞
      if (type.type === 'like-o') {
        userService.updateLikeState({articleId: articleId})
            .then(() => {
              // this.$emit("refresh");
              let isLike = this.tempData[index].articleCountDTO.isLike;
              // 取消点赞操作
              if (isLike) {
                this.tempData[index].articleCountDTO.likeCount--;
              } else {
                this.tempData[index].articleCountDTO.likeCount++;
              }
              this.tempData[index].articleCountDTO.isLike = !isLike;
            })
            .catch(err => {
              this.$message.error(err.desc);
            });
      }
      // 评论
      if (type.type === 'message') {
        console.log("评论")
      }
    },

    // 修改文章审批状态
    updateState(articleId, state, toState) {
      this.$confirm({
        centered: true,
        title: this.$t("common.confirmReject"),
        onOk: () => {
          articleService.updateState({id: articleId, state: toState})
              .then(() => {
                this.tempData = this.tempData.filter(article => article.id !== articleId);
                this.$emit("updateData", this.tempData);
                this.$message.success(this.$t("common.approvalSuccessed"));
              })
              .catch(err => {
                this.$message.error(err.desc);
              });
        },
      });
    },

    // 文章置顶
    articleTop(articleId) {
      this.$confirm({
        centered: true,
        title: this.$t("common.confirmTop"),
        onOk: () => {
          articleService.articleTop({id: articleId, top: true})
              .then(() => {
                this.$emit("articleTopCallBack");
                this.$message.success(this.$t("common.topSuccessed"));
              })
              .catch(err => {
                this.$message.error(err.desc);
              });
        },
      });
    },

    // 文章取消置顶
    articleNotTop(articleId) {
      this.$confirm({
        centered: true,
        title: this.$t("common.confirmNotTop"),
        onOk: () => {
          articleService.articleTop({id: articleId, top: false})
              .then(() => {
                this.$emit("articleTopCallBack");
                this.$message.success(this.$t("common.notTopSuccessed"));
              })
              .catch(err => {
                this.$message.error(err.desc);
              });
        },
      });
    },

    // 删除
    articleDelete(articleId, index) {
      this.$confirm({
        centered: true,
        title: this.$t("common.deleteArticleTitle"),
        onOk:async ()=>{
          await articleService.articleDelete(articleId)
              .then(() => {
                this.tempData = this.tempData.filter(article => article.id !== articleId);
              })
              .catch(err => {
                this.$message.error(err.desc);
              });
          // return new Promise(async (res) => {
          //   console.log("关闭")
          //   Modal.destroyAll();
          //   await nextTick();
          //   return res(true)
          // })
        },
      });
    },

    // 路由到文章详情页面
    routerArticleDetail(articleId) {
      let routeData = this.$router.resolve("/detail/" + articleId);
      window.open(routeData.href, '_blank');
    },

    // 路由到文章详情页面（评论处）
    routerArticleDetailToComment(articleId) {
      let routeData = this.$router.resolve("/detail/" + articleId + '#article-comment-all');
      window.open(routeData.href, '_blank');
    },

    // 路由到用户中心页面
    routerUserCenter(userId) {
      let routeData = this.$router.resolve("/user/" + userId);
      window.open(routeData.href, '_blank');
    },

    // 路由到标签文章页面
    routerLabelToArticle(labelId) {
      let routeData = this.$router.resolve("/label/" + labelId);
      window.open(routeData.href, '_blank');
    },

    // 路由到Book说明页面
    routerBook() {
      let routeData = this.$router.resolve("/book");
      window.open(routeData.href, '_blank');
    },

    // 路由到文章编辑页面
    routerArticleEdit(articleId) {
      this.$router.push("/edit/" + articleId);
    },

    // 获取文章热评
    async getHotComment(articleId) {
      try {
        const response = await commentService.getCommentByArticleId({
          articleId: articleId,
          sortRule: 'hottest',  // 按热度排序
          currentPage: 1,
          pageSize: 1
        });
        if (response && response.data && response.data.length > 0) {
          return response.data[0];  // 返回点赞数最多的评论
        }
        return null;
      } catch (error) {
        console.error('获取热评失败:', error);
        return null;
      }
    },

    // 初始化文章数据
    async initArticleData() {
      for (let i = 0; i < this.tempData.length; i++) {
        const article = this.tempData[i];
        if (article.articleCountDTO && article.articleCountDTO.commentCount > 0) {
          const hotComment = await this.getHotComment(article.id);
          if (hotComment) {
            this.tempData[i].hotComment = hotComment;
          }
        }
      }
    }
  },

  mounted() {
    this.initArticleData();
  },

  watch: {
    data: {
      handler(newVal) {
        this.tempData = newVal;
        this.initArticleData();
      }
    }
  }
};
</script>

<style lang="less" scoped>
#main-article-content {
  .article-content {
    margin: 10px 0;
    color: #4a4a4a;
    line-height: 1.6;
  }

  .article-hot-comment {
    margin: 12px 0;
    padding: 12px;
    background: #fff8f8;
    border-radius: 8px;
    border: 1px solid #ffccc7;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 2px 8px rgba(255, 77, 79, 0.1);
    }

    .hot-comment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .hot-comment-title {
        display: flex;
        align-items: center;
        color: #ff4d4f;
        font-size: 14px;
      }
    }

    .hot-comment-content {
      .hot-comment-user {
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        .username {
          margin: 0 8px;
          color: #262626;
          font-weight: 500;
        }

        .like-count {
          color: #ff4d4f;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }

      .hot-comment-text {
        color: #595959;
        font-size: 14px;
        line-height: 1.6;
        word-break: break-all;
        padding: 8px;
        background: #fff;
        border-radius: 4px;
      }
    }
  }
}
</style>
<template>
  <div id="main-article-content">
    <a-list item-layout="vertical" size="large" :data-source="tempData">
      <template #renderItem="{ item, index }">
        <a-list-item slot="renderItem" key="item.title" slot-scope="item, index" style="cursor: pointer;"
                   @click="routerArticleDetail(item.id)">
          <template #actions>
            <!-- 浏览量/点赞/评论 -->
          <div v-for="(type,cindex) in actions" slot="actions" :key="cindex">
            <span class="collectLikeComment" :key="type">
                  <span v-if="type.type==='eye'">
                      <!-- <a-icon :type="type" style="margin-right: 6px;"/> -->
                      <EyeOutlined style="margin-right: 6px;"/>
                      <span v-text="item.pv"></span>
                  </span>
                  <span v-if="type.type==='like-o'" @click.stop="pageViewsLikeComment(type, item.id, index)">
                      <span v-if="item.articleCountDTO.isLike" :style="{color: $store.state.themeColor}">
                          <!-- <a-icon :type="type" style="margin-right: 6px"/> -->
                          <LikeOutlined style="margin-right: 6px"/>
                          <span v-text="item.articleCountDTO.likeCount"></span>
                      </span>
                      <span v-if="!item.articleCountDTO.isLike">
                          <!-- <a-icon :type="type" style="margin-right: 8px"/> -->
                          <LikeOutlined style="margin-right: 8px"/>
                          <span v-text="item.articleCountDTO.likeCount"></span>
                      </span>
                  </span>
                  <span v-if="type.type==='message'" @click.stop="routerArticleDetailToComment(item.id)">
                      <!-- <a-icon :type="type" style="margin-right: 6px;"/> -->
                      <MessageOutlined style="margin-right: 6px;"/>
                      <span v-text="item.articleCountDTO.commentCount"></span>
                  </span>
                  <span
                      v-if="(($store.state.isManage && isAdminAudit) || $store.state.userId === item.createUser) && type.type==='ellipsis'"
                      @click.stop>
                    <a-dropdown :placement="'bottomCenter'" :trigger="['click']">
                      <template #overlay>
                        <a-menu>
                          <!-- 审核通过 -->
                          <a-menu-item key="articlePass"
                                      v-if="($store.state.isManage && isAdminAudit) && (item.state === -1 || item.state !== 1)"
                                      @click="updateState(item.id, item.state, 1)">
                            {{ ' ' + $t("common.pass") }}
                          </a-menu-item>
                          <!-- 审核拒绝 -->
                          <a-menu-item key="articleReject"
                                      v-if="($store.state.isManage && isAdminAudit) && (item.state === -1 || item.state !== 0)"
                                      @click="updateState(item.id, item.state, 0)">
                            <span style="color: red">{{ ' ' + $t("common.reject") }}</span>
                          </a-menu-item>
                          <!-- 文章置顶 -->
                          <a-menu-item key="articleNotTop" v-if="$store.state.isManage && isAdminAudit && !item.top"
                                      @click="articleTop(item.id)">
                            <span style="color: #1869ff">{{ ' ' + $t("common.isTop") }}</span>
                          </a-menu-item>
                          <!-- 文章取消置顶 -->
                          <a-menu-item key="articleTop" v-if="$store.state.isManage && isAdminAudit && item.top"
                                      @click="articleNotTop(item.id)">
                            <span style="color: #eb2f96">{{ ' ' + $t("common.isNotTop") }}</span>
                          </a-menu-item>
                          <!-- 文章编辑 -->
                          <a-menu-item key="articleEdit" v-if="$store.state.userId === item.createUser"
                                      @click="routerArticleEdit(item.id)">
                            <span style="color: #722ed1">{{ ' ' + $t("common.edit") }}</span>
                          </a-menu-item>
                          <!-- 文章删除 -->
                          <a-menu-item key="articleDel" v-if="$store.state.userId === item.createUser"
                                      @click="articleDelete(item.id, index)">
                            <span style="color: red">{{ ' ' + $t("common.delete") }}</span>
                          </a-menu-item>
                        </a-menu>
                      </template>
                      <div class="options">
                      <!-- <a-icon :type="type"/> -->
                      <EllipsisOutlined />
                    </div>
                    </a-dropdown>
                  </span>
              </span>
            </div>
          </template>
          <!-- 标签/题图 -->
          <template #extra>
            <div slot="extra" class="label-titleMap">
              <div slot="title">
                <a v-for="(label, index) in item.labelDTOS" :key="item.labelName" style="float: right"
                  @click.stop="routerLabelToArticle(label.id)">
                  <span class="label-name">{{ label.labelName }}</span>
                  <a-divider v-if="index !== 0" type="vertical"/>
                </a>
              </div>
              <div>
                <img style="padding-top: 10px" :width="$store.state.collapsed ? 80 : 150" alt="logo" v-if="item.titleMap"
                    :src="item.titleMap"/>
              </div>
            </div>
          </template>
          <!-- 用户/标题 -->
          <a-list-item-meta :description="item.title">
            <template #title>
              <a slot="title" class="username" @click.stop="routerUserCenter(item.createUser)">
                <div class="left">
                  <span slot="title" style="padding-right: 2px;"> {{ item.createUserName }} </span>
                  <img :src="require('@/assets/img/level/' + item.level + '.svg')" alt="" @click.stop="routerBook"/>
                  <small style="color: #b5b9b9; padding-left: 10px" v-text="$utils.showtime(item.createTime)"></small>
                  <!-- 用户中心 -->
                  <div v-if="isUserCenter && ($store.state.userId === userId || $store.state.isManage)">
                    <small style="color: #faad14; padding-left: 10px" v-if="item.state === -1">{{
                        $t("common.pendingReview")
                      }}</small>
                    <small style="color: red; padding-left: 10px" v-if="item.state === 0">{{
                        $t("common.auditReviewRejected")
                      }}</small>
                    <small style="color: #3eaf7c; padding-left: 10px" v-if="item.state === 1">{{
                        $t("common.auditApproved")
                      }}</small>
                  </div>
                </div>
                <!-- 置顶图标 -->
                <a-tooltip placement="left">
                  <template #title>
                    {{ $t("common.top") }}
                  </template>
                  <!-- <a-icon type="fire" :style="{color: $store.state.themeColor}" v-if="item.top"/> -->
                  <FireOutlined :style="{color: $store.state.themeColor}" v-if="item.top"/>
                  <!--              <a-icon type="thunderbolt" :style="{color: $store.state.themeColor}" v-if="item.top" />-->
                  <!--              <i class="iconfont icon-right-triangle" :style="{color: $store.state.themeColor}" v-if="item.top"></i>-->
                </a-tooltip>
              </a>
            </template>
            <template #avatar>
              <a-avatar slot="avatar" :src="item.picture ? item.picture : require('@/assets/img/default_avatar.png')"
                      @click.stop="routerUserCenter(item.createUser)"/>
            </template>
          </a-list-item-meta>
          <div class="article-content">
            {{ item.content }}
          </div>
          <!-- 热评展示 -->
          <div class="article-hot-comment" v-if="item.articleCountDTO && item.articleCountDTO.commentCount > 0">
            <div class="hot-comment-header">
              <div class="hot-comment-title">
                <a-icon type="fire" theme="filled" style="color: #ff4d4f; margin-right: 4px;" />
                <span style="font-weight: 600;">热门评论</span>
              </div>
            </div>
            <div class="hot-comment-content">
              <div class="hot-comment-user">
                <a-avatar :size="24" :src="item.hotComment?.picture || require('@/assets/img/default_avatar.png')" />
                <span class="username" v-if="item.hotComment?.commentUserName">
                  <a-icon type="fire" theme="filled" style="color: #ff4d4f; margin-right: 2px; font-size: 14px;" />
                  {{ item.hotComment.commentUserName }}
                </span>
                <span class="like-count">
                  <a-icon type="like" theme="filled" style="color: #ff4d4f;" />
                  {{ item.hotComment?.likeCount || 0 }} 点赞
                </span>
              </div>
              <div class="hot-comment-text">{{ item.hotComment?.content || '暂无热门评论' }}</div>
            </div>
          </div>
        </a-list-item>
      </template>

    </a-list>
    <div style="text-align: center; padding-bottom: 20px;" v-if="!hasNext && finish">
      <a-divider/>
      {{ $t("common.noAgain") }}
    </div>
  </div>
</template>
<script>
import userService from "@/service/userService";
import articleService from "@/service/articleService";
import commentService from "@/service/commentService";
import { EyeOutlined,LikeOutlined,MessageOutlined,EllipsisOutlined,FireOutlined } from '@ant-design/icons-vue';
import { Modal } from 'ant-design-vue';
import { nextTick } from 'vue';

export default {
  name: 'FrontPageArticle',
  props: {
    data: {type: Array, default: []},
    pageSize: {type: Number, default: 0},
    current: {type: Number, default: 1},
    finish: {type: Boolean, default: false},
    hasNext: {type: Boolean, default: false},
    isUserCenter: {type: Boolean, default: false},
    userId: {type: Number, default: 0},
    isAdminAudit: {type: Boolean, default: false},
  },
  data() {
    return {
      tempData: this.data,
      actions: [
        {type: 'eye', text: '156'},
        {type: 'like-o', text: '156'},
        {type: 'message', text: '2'},
        {type: 'ellipsis', text: '12'},
      ],
    };
  },
  components: {
    EyeOutlined,LikeOutlined,MessageOutlined,EllipsisOutlined,FireOutlined,
  },
  methods: {
    // 浏览点赞评论按钮的点击操作
    pageViewsLikeComment(type, articleId, index) {
      console.log("type", type,articleId);
      // 浏览量
      if (type.type === 'eye') {
        console.log("浏览量")
      }
      // 点赞
      if (type.type === 'like-o') {
        userService.updateLikeState({articleId: articleId})
            .then(() => {
              // this.$emit("refresh");
              let isLike = this.tempData[index].articleCountDTO.isLike;
              // 取消点赞操作
              if (isLike) {
                this.tempData[index].articleCountDTO.likeCount--;
              } else {
                this.tempData[index].articleCountDTO.likeCount++;
              }
              this.tempData[index].articleCountDTO.isLike = !isLike;
            })
            .catch(err => {
              this.$message.error(err.desc);
            });
      }
      // 评论
      if (type.type === 'message') {
        console.log("评论")
      }
    },

    // 修改文章审批状态
    updateState(articleId, state, toState) {
      this.$confirm({
        centered: true,
        title: this.$t("common.confirmReject"),
        onOk: () => {
          articleService.updateState({id: articleId, state: toState})
              .then(() => {
                this.tempData = this.tempData.filter(article => article.id !== articleId);
                this.$emit("updateData", this.tempData);
                this.$message.success(this.$t("common.approvalSuccessed"));
              })
              .catch(err => {
                this.$message.error(err.desc);
              });
        },
      });
    },

    // 文章置顶
    articleTop(articleId) {
      this.$confirm({
        centered: true,
        title: this.$t("common.confirmTop"),
        onOk: () => {
          articleService.articleTop({id: articleId, top: true})
              .then(() => {
                this.$emit("articleTopCallBack");
                this.$message.success(this.$t("common.topSuccessed"));
              })
              .catch(err => {
                this.$message.error(err.desc);
              });
        },
      });
    },

    // 文章取消置顶
    articleNotTop(articleId) {
      this.$confirm({
        centered: true,
        title: this.$t("common.confirmNotTop"),
        onOk: () => {
          articleService.articleTop({id: articleId, top: false})
              .then(() => {
                this.$emit("articleTopCallBack");
                this.$message.success(this.$t("common.notTopSuccessed"));
              })
              .catch(err => {
                this.$message.error(err.desc);
              });
        },
      });
    },

    // 删除
    articleDelete(articleId, index) {
      this.$confirm({
        centered: true,
        title: this.$t("common.deleteArticleTitle"),
        onOk:async ()=>{
          await articleService.articleDelete(articleId)
              .then(() => {
                this.tempData = this.tempData.filter(article => article.id !== articleId);
              })
              .catch(err => {
                this.$message.error(err.desc);
              });
          // return new Promise(async (res) => {
          //   console.log("关闭")
          //   Modal.destroyAll();
          //   await nextTick();
          //   return res(true)
          // })
        },
      });
    },

    // 路由到文章详情页面
    routerArticleDetail(articleId) {
      this.$router.push("/detail/" + articleId);
    },

    // 路由到文章详情页面（评论处）
    routerArticleDetailToComment(articleId) {
      this.$router.push("/detail/" + articleId + '#article-comment-all');
    },

    // 路由到用户中心页面
    routerUserCenter(userId) {
      this.$router.push("/user/" + userId);
    },

    // 路由到标签文章页面
    routerLabelToArticle(labelId) {
      this.$router.push("/label/" + labelId);
    },

    // 路由到Book说明页面
    routerBook() {
      this.$router.push("/book");
    },

    // 路由到文章编辑页面
    routerArticleEdit(articleId) {
      this.$router.push("/edit/" + articleId);
    },

    // 获取文章热评
    async getHotComment(articleId) {
      try {
        const response = await commentService.getCommentByArticleId({
          articleId: articleId,
          sortRule: 'hottest',  // 按热度排序
          currentPage: 1,
          pageSize: 1
        });
        if (response && response.data && response.data.length > 0) {
          return response.data[0];  // 返回点赞数最多的评论
        }
        return null;
      } catch (error) {
        console.error('获取热评失败:', error);
        return null;
      }
    },

    // 初始化文章数据
    async initArticleData() {
      for (let i = 0; i < this.tempData.length; i++) {
        const article = this.tempData[i];
        if (article.articleCountDTO && article.articleCountDTO.commentCount > 0) {
          const hotComment = await this.getHotComment(article.id);
          if (hotComment) {
            this.tempData[i].hotComment = hotComment;
          }
        }
      }
    }
  },

  mounted() {
    this.initArticleData();
  },

  watch: {
    data: {
      handler(newVal) {
        this.tempData = newVal;
        this.initArticleData();
      }
    }
  }
};
</script>

<style lang="less" scoped>
#main-article-content {
  .article-content {
    margin: 10px 0;
    color: #4a4a4a;
    line-height: 1.6;
  }

  .article-hot-comment {
    margin: 12px 0;
    padding: 12px;
    background: #fff8f8;
    border-radius: 8px;
    border: 1px solid #ffccc7;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 2px 8px rgba(255, 77, 79, 0.1);
    }

    .hot-comment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .hot-comment-title {
        display: flex;
        align-items: center;
        color: #ff4d4f;
        font-size: 14px;
      }
    }

    .hot-comment-content {
      .hot-comment-user {
        display: flex;
        align-items: center;
        margin-bottom: 8px;

        .username {
          margin: 0 8px;
          color: #262626;
          font-weight: 500;
        }

        .like-count {
          color: #ff4d4f;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }

      .hot-comment-text {
        color: #595959;
        font-size: 14px;
        line-height: 1.6;
        word-break: break-all;
        padding: 8px;
        background: #fff;
        border-radius: 4px;
      }
    }
  }
}
</style>
