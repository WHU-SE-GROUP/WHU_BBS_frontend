<template>
  <div class="div-content">
    <a-row>


      <!--  新增：使用文档 -->
      <a-col class="docs_center" :span="6" @click="routerDocs">
        {{ $t("common.docs") }}
      </a-col>

      <a-col class="about_us" :span="6" @click="routerAbout">{{ $t("common.about") }}</a-col>
    </a-row>

  </div>
</template>

<script>
export default {
  name: "FilingInfo",

  methods: {
    designDocument() {
      window.open('http://76.nanshengbbs.top/doc/%E5%8D%97%E7%94%9F%E8%AE%BA%E5%9D%9B%E7%9A%84%E8%AE%BE%E8%AE%A1%E4%B8%8E%E5%AE%9E%E7%8E%B0.doc', '_blank');
      // this.$message.warning(this.$t("common.excuseMe"));
      // this.$confirm({
      //   centered: true,
      //   title: this.$t("common.learnHowToGetNanshengPoints"),
      //   content: this.$t("common.excuseMe"),
      //   onOk: () => {
      //     this.routerBook();
      //   },
      // });
    },

    // 路由到Book说明页面
    routerBook() {
      window.open('/book', '_blank');
    },

    // 点击跳转到 关于我们 页面
    routerAbout() {
      window.open('/about', '_blank');
    },

    routerDocs() {
      window.open('/docs', '_blank');
    }
  }
}
</script>

<style scoped>
.div-content, a {
  font-size: 12px;
  line-height: 2;
  color: #909090;
  cursor: pointer;
}

.user_agreement:hover, .user_guidance:hover, .links:hover, .about_us:hover, a:hover {
  color: #13c2c2;
}

</style>