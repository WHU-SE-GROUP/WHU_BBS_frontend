<template>
  <a-layout>
    <a-layout id="about-index">
      <IndexHeader class="header"/>
      <a-layout-content>
        <main class="about_content" :style="$store.state.collapsed ? 'width: 100%;' : 'width: 800px;'">
          <div style="background: #fff; margin-bottom: 10px">
            <section class="mission">
              <div class="inner">
                <!-- 使命 -->
                <div class="mission-content">
                  <div class="title">我们的使命</div>
                  <div class="sub">武大论坛，个人程序人生的点滴记录和时光储备。淡泊明志，宁静致远。珍惜原创，矢志不渝。</div>
                </div>

                <!-- 愿景 -->
                <div class="vision-content">
                  <div class="title">我们的愿景</div>
                  <div class="sub">
                    打造一个开放、自由、可信的校园互动社区<br>
                    为技术学习、信息交流、思想碰撞提供可靠平台<br>
                    引导积极表达，沉淀优质内容
                  </div>
                </div>

                <!-- 项目背景 -->
                <div class="origin-content">
                  <div class="title">项目背景</div>
                  <div class="sub">
                    基于南生论坛开源项目改造升级，结合武汉大学校园环境进行本地化定制开发，<br>
                    旨在替代传统群聊工具，构建更具结构性、可检索性、持久化的校园社区平台。
                  </div>
                </div>

                <!-- 作者 -->
                <div class="author-content">
                  <div class="title">开发者</div>
                  <div class="sub">
                    本项目由武汉大学软件学院学生基于兴趣与实践推动独立开发完成，持续优化中。
                  </div>
                </div>

                <!-- 功能介绍 -->
                <div class="feature-content">
                  <div class="title">核心功能</div>
                  <div class="sub">
                    - 多板块社区自由发帖，支持标签、话题过滤<br>
                    - 匿名/实名发帖机制，保护表达与隐私<br>
                    - 自适应移动端访问，响应式布局优化<br>
                    - 后台管理系统支持内容、用户、权限配置
                  </div>
                </div>

                <!-- 源码地址 -->
                <div class="code-content">
                  <div class="title">源码地址</div>
                  <div class="sub">后端源码（GitHub）：<a target="_blank" href="https://github.com/WHU-SE-GROUP/WHU_BBS_backend">WHU_BBS_backend</a></div>
                  <div class="sub">前端源码（GitHub）：<a target="_blank" href="https://github.com/WHU-SE-GROUP/WHU_BBS_frontend">WHU_BBS_frontend</a></div>
                </div>


                <div class="code-content">
                  <div class="title">使用指南</div>
                  <div class="sub">
                    <router-link to="/docs">  使用指南</router-link>
                  </div>

                </div>



              </div>
            </section>
          </div>
        </main>
      </a-layout-content>
      <FooterButtons v-if="!$store.state.collapsed"/>
    </a-layout>
  </a-layout>
</template>

<script>
import IndexHeader from "@/components/index/head/IndexHeader";
import FooterButtons from "@/components/utils/FooterButtons";

export default {
  name: "About",
  components: { IndexHeader, FooterButtons },

  data() {
    return {
      // 加载中...
      visitCount:1,
    };
  },

  mounted() {
    this.$nextTick(() => {
      let dom = document.querySelector('#app');
      if (dom !== null) {
        dom.scrollTop = 0;
      }
    });
    this.$utils.scroll.call(this, document.querySelector('#app'));
    const key = "visitCount_" + window.location.pathname;
    let count = parseInt(localStorage.getItem(key) || "0", 10);
    count += 1;
    localStorage.setItem(key, count);
    this.visitCount = count;
  }
};
</script>

<style lang="less">
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

  .ant-layout-header, .ant-layout-content {
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
