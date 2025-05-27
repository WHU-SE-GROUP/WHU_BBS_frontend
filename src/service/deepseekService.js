import axios from "axios";

// 模拟评论生成函数
const generateMockComment = (content, style) => {
  // 根据不同风格生成不同类型的模拟评论
  const commentStyles = {
    "专业、有见解": [
      "这篇文章观点新颖，论据充分，分析深入。特别是对于核心问题的剖析，展现了作者深厚的专业素养。",
      "作者的论述逻辑严密，证据确凿，展现了对该领域的深刻理解。这一视角为读者提供了全新的思考维度。",
      "文章构架严谨，层次分明，对关键概念的阐述既有理论高度又有实践深度。值得学术界深入探讨。"
    ],
    "幽默、风趣": [
      "读完这篇文章，我的脑细胞都在欢呼！作者的金句频出，让严肃话题也能如此生动有趣，真是让人拍案叫绝！",
      "这文章简直是知识界的段子手啊！边学习边笑场，谁说学术不能有乐趣？作者的幽默感应该申请专利！",
      "哈哈，看完后我既长知识又笑掉大牙，这波知识量和笑点双丰收！作者是不是偷偷兼职脱口秀演员？"
    ],
    "批判性思考": [
      "文章观点值得商榷。虽然论述有一定道理，但忽略了关键的社会因素，导致结论过于片面。建议从多元角度重新审视。",
      "作者的论点存在逻辑漏洞，部分论据缺乏有力支持。这种线性思维在复杂问题面前显得过于简化，有待进一步深化。",
      "文章立意不错，但分析框架过于理想化，未能充分考虑实际执行中的困难与阻力。期待更加全面的讨论。"
    ],
    "鼓励、积极": [
      "这篇文章充满正能量！作者的思考不仅深刻，还给人以勇气和希望。相信读者会从中获得前进的动力！",
      "文章字里行间洋溢着乐观向上的精神，给人温暖与力量。这种积极的思考方式值得我们每个人学习！",
      "读完心潮澎湃！作者用实例告诉我们，即使面对困难也要保持信心。这种精神值得所有人学习和传递！"
    ],
    "学术、引经据典": [
      "本文论述精当，引证详实。正如苏格拉底所言：\"未经审视的生活不值得过\"，作者对此命题的阐发可谓入木三分。",
      "诚如康德在《纯粹理性批判》中所述，\"经验可以告诉我们事物是什么，但不能告诉我们事物必然如此而不可能是别的样子\"。本文对此哲学命题的应用令人耳目一新。",
      "作者引用荀子\"不积跬步，无以至千里\"之言，结合现代实证研究，构建了一个融贯东西方智慧的理论框架，令人叹服。"
    ]
  };

  // 默认使用专业风格
  const styleKey = style in commentStyles ? style : "专业、有见解";
  const comments = commentStyles[styleKey];
  
  // 随机选择一条评论
  const randomIndex = Math.floor(Math.random() * comments.length);
  return comments[randomIndex];
};

// 增强本地模式的评论内容
const enhancedMockComment = (articleContent, style) => {
  // 提取文章关键词 (简单实现)
  const content = articleContent || '';
  const keywords = content.split(/[，。？！,.?!；;：:\s]/)
    .filter(word => word.length > 1)
    .filter((v, i, a) => a.indexOf(v) === i) // 去重
    .slice(0, 3); // 取前3个
  
  // 获取基础模板评论
  let comment = generateMockComment('', style);
  
  // 如果有提取到关键词，将其融入评论
  if (keywords.length > 0) {
    // 根据风格插入关键词
    if (style === "专业、有见解") {
      comment += `尤其是对"${keywords.join('、')}"等概念的分析尤为精彩。`;
    } else if (style === "幽默、风趣") {
      comment += `特别是关于"${keywords.join('、')}"的部分，笑得我合不拢嘴！`;
    } else if (style === "批判性思考") {
      comment += `但文中关于"${keywords.join('、')}"的论述仍有进一步商榷的空间。`;
    } else if (style === "鼓励、积极") {
      comment += `尤其是文中提到的"${keywords.join('、')}"，给人以极大的启发和鼓舞！`;
    } else if (style === "学术、引经据典") {
      comment += `此文对"${keywords.join('、')}"的探讨，令人联想到柏拉图所言："知识是灵魂的眼睛"。`;
    }
  }
  
  return comment;
};

// 尝试更多代理服务
const corsProxies = [
  'https://corsproxy.io/?',
  'https://cors-anywhere.herokuapp.com/',
  'https://proxy.cors.sh/',
  'https://cors-proxy.fringe.zone/',
  'https://cors-anywhere.azm.workers.dev/',
  'https://api.allorigins.win/raw?url='
];

export default {
  // 调用DeepSeek API生成评论
  async generateComment(data) {
    // 检查是否使用本地模拟模式
    // const useMockMode = data.useMockMode === true;
    
    // if (useMockMode) {
    //   return new Promise((resolve) => {
    //     // 模拟网络延迟
    //     setTimeout(() => {
    //       resolve({
    //         data: {
    //           choices: [{
    //             message: {
    //               content: enhancedMockComment(data.articleContent, data.style)
    //             }
    //           }]
    //         }
    //       });
    //     }, 800); // 减少延迟时间
    //   });
    // }

    try {
      console.log('准备发送DeepSeek API请求...');

      const response = await axios.post('https://api.deepseek.com/chat/completions', {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `你是一个文章评论机器人，请根据提供的文章内容，以${data.style || "专业、有见解"}的风格生成一段评论。评论应该简洁有力，不超过100字。`
          },
          {
            role: "user",
            content: `请对以下文章内容生成评论：\n${data.articleContent}`
          }
        ],
        temperature: 0.7
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.apiKey}`
        },
        timeout: 60000 // 1分钟超时
      });

      console.log('API请求成功:', response);
      
      return {
        data: {
          choices: [{
            message: {
              content: response.data.choices[0].message.content
            }
          }]
        }
      };
    } 
    catch (err) {
      //console.error('API调用失败:', err);
      
      // 检查错误对象中是否包含有效的响应数据
      if (err.choices) {
        //console.log('在错误响应中发现有效数据:', err.response.data);
        return {
          data: {
            choices: [{
              message: {
                content: err.choices[0].message.content
              }
            }]
          }
        };
      }
      
      // 检查错误对象本身是否包含有效数据
      if (err.data && err.data.choices) {
        console.log('在错误对象中发现有效数据:', err.data);
        return {
          data: {
            choices: [{
              message: {
                content: err.data.choices[0].message.content
              }
            }]
          }
        };
      }

      throw err;
    }
  }
}; 