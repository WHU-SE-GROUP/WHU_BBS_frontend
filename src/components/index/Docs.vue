<template>
  <a-layout>
    <a-layout id="about-index">
      <IndexHeader class="header" />
      <a-layout-content>
        <main class="about_content" :style="$store.state.collapsed ? 'width: 100%;' : 'width: 800px;'">
          <div style="background: #fff; margin-bottom: 10px">
            <section class="mission">
              <div class="inner">
                <!-- 使用指南 -->
                <div class="mission-content">
                  <div class="title">使用指南</div>
                  <div class="sub">本页面将带你快速了解武大论坛的使用方式与注意事项。</div>
                </div>

                <div class="vision-content">
                  <div class="title">主要功能导航</div>
                  <div class="sub">
                    - 🏠 <router-link to="/">首页</router-link>：浏览全部文章、查看热榜、搜索内容<br>
                    - 📝 <router-link to="/write">发帖</router-link>：支持匿名/实名，支持添加标签与话题<br>
                    - 🔍 <router-link to="/search">搜索</router-link>：支持关键字检索标题、正文与用户<br>
                    - 🧾 <router-link to="/user/1/article">个人中心</router-link>：查看我的发帖、收藏、关注用户<br>
                    - ⚙️ <router-link to="/settings/profile">设置中心</router-link>：编辑头像、昵称、账号安全设置
                  </div>
                </div>
                <div class="origin-content">
                  <div class="title">常见问题 Q&A</div>
                  <div class="sub">
                    <b>Q：支持哪些格式的发帖？</b><br>
                    A：支持 Markdown 文本编辑，支持图片上传、LaTeX 公式。<br><br>

                    <b>Q：发帖是否需要实名？</b><br>
                    A：发帖可选择匿名或实名，匿名帖默认隐藏用户信息，但管理后台可追踪。<br><br>

                    <b>Q：如何举报违规内容？</b><br>
                    A：进入帖子详情页右上角点击“举报”按钮，选择举报类型并填写理由。<br><br>

                    <b>Q：如何修改昵称或头像？</b><br>
                    A：在 <router-link to="/settings/profile">设置中心</router-link> 中点击“编辑资料”即可更改。<br><br>

                    <!-- 以下是新增的 Q&A -->

                    <b>Q：发帖可以添加标签或话题吗？</b><br>
                    A：支持标签与话题机制，发帖时可选择相关话题帮助内容聚合展示。<br><br>

                    <b>Q：移动端访问体验如何？</b><br>
                    A：平台已做响应式设计，支持在手机、平板等设备自适应展示，体验良好。<br><br>

                    <b>Q：是否可以删除自己的帖子或评论？</b><br>
                    A：可以。在个人中心可管理自己的发帖记录，支持删除或修改。<br><br>

                    <b>Q：如何查看我关注的用户或话题？</b><br>
                    A：进入个人中心，可查看已关注的话题与用户动态更新。<br><br>

                    <b>Q：论坛是否支持私信功能？</b><br>
                    A：目前暂未开放私信功能，后续版本计划支持用户间私信沟通。<br><br>

                    <b>Q：如何申请成为版主或贡献者？</b><br>
                    A：可通过管理员邮箱或在“站务建议”板块发布申请贴，由平台审核后回复。<br><br>
                  </div>
                </div>


              </div>
            </section>
          </div>
        </main>
      </a-layout-content>
      <FooterButtons v-if="!$store.state.collapsed" />
    </a-layout>
  </a-layout>
</template>

<script>
import IndexHeader from "@/components/index/head/IndexHeader";
import FooterButtons from "@/components/utils/FooterButtons";

export default {
  name: "Docs",
  components: { IndexHeader, FooterButtons },
  mounted() {
    this.$nextTick(() => {
      let dom = document.querySelector('#app');
      if (dom !== null) {
        dom.scrollTop = 0;
      }
    });
  }
};
</script>

<style lang="less" scoped>
#about-index {
  .header {
    position: fixed;
    width: 100%;
    z-index: 999;
    background: #fff;
    border-bottom: 1px solid #00000021;
  }

  .about_content {
    margin-top: 64px;
  }

  .ant-layout-header,
  .ant-layout-content {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ant-layout-header {
    background: #fff;
    height: auto;
    line-height: 2.3;
  }

  .mission {
    padding: 30px;
    box-sizing: border-box;

    .title {
      font-size: 28px;
      font-weight: bold;
      margin-top: 20px;
    }

    .sub {
      margin: 10px 0;
      font-size: 15px;
      color: #666;
      line-height: 1.8;
    }

    a {
      color: #1890ff;
    }

    a:hover {
      text-decoration: underline;
    }
  }
}
</style>
