<template>
  <div class="mentor-resource">
    <a :href="mentorResourceLink" target="_blank" class="resource-card">
      <div class="head-name">
        <a-avatar class="avatar" :size="35" :src="require('@/assets/logo.png')"/>
        <div class="title">导师推荐</div>
      </div>
      <div class="meta-article">根据学生生需求推荐优秀导师</div>
    </a>
  </div>
</template>

<script>
export default {
  name: "MentorResource",
  data() {
    return {
      mentorResourceLink: "https://whucsmentorguide.asia"
    };
  }
};
</script>

<style lang="less" scoped>
.mentor-resource {
  .resource-card {
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: inherit;
    background: #fff;
    border-bottom: 20px solid #f0f2f5;
    text-decoration: none;
    cursor: pointer;

    .head-name {
      display: flex;
      align-items: center;

      .title {
        padding-left: 10px;
        font-size: 18px;
        color: #333;
      }
    }

    .meta-article {
      color: #666;
      margin-top: 8px;
      font-size: 14px;
    }
  }
}
</style> 