import axios from "axios";
import commentService from "./commentService";

// 预设的机器人评论模板
const COMMENT_TEMPLATES = [
  "这篇文章写得很好，感谢分享！",
  "学到了很多，谢谢楼主！",
  "内容很有深度，期待更多类似的文章！",
  "分析得很透彻，赞一个！",
  "这个观点很独特，让我有了新的思考。",
  "文章结构很清晰，内容也很充实。",
  "楼主的文笔真好，读起来很流畅。",
  "这篇文章解决了我的很多疑问，感谢！",
  "内容很实用，收藏了！",
  "逻辑分析很严密，学习了！"
];

export default {
  // 生成机器人评论
  generateBotComment(articleId) {
    return new Promise((resolve, reject) => {
      // 随机选择一条评论模板
      const randomIndex = Math.floor(Math.random() * COMMENT_TEMPLATES.length);
      const commentContent = COMMENT_TEMPLATES[randomIndex];
      
      // 使用现有的评论服务创建评论
      commentService.createComment({
        articleId: articleId,
        content: commentContent,
        preId: 0
      })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
    });
  },
  
  // 生成机器人回复评论
  generateBotReply(commentId, articleId) {
    return new Promise((resolve, reject) => {
      // 生成回复内容
      const replyContent = "回复：感谢您的评论，您的观点很有见地！";
      
      // 使用现有的评论服务创建回复
      commentService.createComment({
        articleId: articleId,
        content: replyContent,
        preId: commentId
      })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
    });
  }
}; 