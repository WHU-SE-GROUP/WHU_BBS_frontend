<template>
  <a-layout>
    <a-layout id="components-layout-basic">
      <IndexHeader class="header"/>
      <a-layout-content>
        <main class="content">
          <div class="error-container">
            <div class="error-title">
              <h1>404</h1>
              <p>{{ $t("common.pageNotExist") }}</p>
            </div>
            <div class="game-container">
              <div id="dinosaur-game" ref="gameContainer">
                <canvas id="game-canvas" ref="gameCanvas" width="600" height="150"></canvas>
              </div>
              <div class="game-instructions">
                <p>按空格键或点击画面跳跃，躲避仙人掌</p>
              </div>
            </div>
            <a-button @click="backHome" type="primary" class="home-button">
              {{ $t("common.backHome") }}
            </a-button>
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
    name: "NotFound",

    components: {IndexHeader, FooterButtons},

    data() {
      return {
        gameInterval: null,
        dinoImg: null,
        cactusImg: null,
        spacePressed: false,
        spacePressStartTime: 0,
        minObstacleDistance: 200,
        dino: {
          x: 50,
          y: 0,
          width: 60,
          height: 60,
          jumping: false,
          velocityY: 0,
          gravity: 0.8,
          minJumpPressDuration: 50,
          maxJumpPressDuration: 300,
          minJumpStrength: 12,
          maxJumpStrength: 20,
        },
        obstacles: [],
        ground: {
          y: 130
        },
        gameSpeed: 6,
        score: 0,
        gameOver: false
      };
    },

    mounted() {
      this.loadImages();
    },

    beforeUnmount() {
      if (this.gameInterval) {
        clearInterval(this.gameInterval);
      }
      window.removeEventListener('keydown', this.handleKeyDown);
      window.removeEventListener('keyup', this.handleKeyUp);
      window.removeEventListener('resize', this.handleResize);
      const canvas = this.$refs.gameCanvas;
      if (canvas) {
        canvas.removeEventListener('click', this.jump);
      }
    },

    methods: {
      // 加载图片资源
      loadImages() {
        // 加载恐龙图片
        this.dinoImg = new Image();
        this.dinoImg.src = require('@/assets/img/nailong.png');
        
        // 加载仙人掌图片
        this.cactusImg = new Image();
        this.cactusImg.src = require('@/assets/img/xinarenzhang.jpg');
        
        // 当恐龙图片加载完成后初始化游戏
        this.dinoImg.onload = () => {
          // 当仙人掌图片加载完成后初始化游戏
          this.cactusImg.onload = () => {
            this.initGame();
          };
        };
      },

      // 跳转首页方法
      backHome() {
        this.$router.push({path: "/"});
      },

      // 游戏初始化
      initGame() {
        const canvas = this.$refs.gameCanvas;
        if (!canvas) return;
        
        canvas.addEventListener('click', this.jump);
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        window.addEventListener('resize', this.handleResize);
        
        const ctx = canvas.getContext('2d');
        this.dino.y = this.ground.y - this.dino.height;
        this.dino.velocityY = 0;
        
        // 创建第一个障碍物
        this.addObstacle();
        
        // 处理窗口大小变化
        this.handleResize();
        
        // 游戏循环
        this.gameInterval = setInterval(() => {
          this.updateGame(ctx);
        }, 20);
      },
      
      // 更新游戏
      updateGame(ctx) {
        if (!ctx || !this.$refs.gameCanvas) return;
        if (this.gameOver) return;
        
        ctx.clearRect(0, 0, this.$refs.gameCanvas.width, this.$refs.gameCanvas.height);
        
        // 绘制地面
        ctx.beginPath();
        ctx.moveTo(0, this.ground.y);
        ctx.lineTo(this.$refs.gameCanvas.width, this.ground.y);
        ctx.strokeStyle = "#333";
        ctx.stroke();
        
        // 绘制并更新恐龙
        this.drawDino(ctx);
        this.updateDino();
        
        // 绘制并更新障碍物
        this.updateObstacles();
        this.drawObstacles(ctx);
        
        // 碰撞检测
        this.checkCollisions();
        
        // 更新分数
        this.score += 0.1;
        ctx.fillStyle = "#333";
        ctx.font = "14px Arial";
        ctx.fillText(`Score: ${Math.floor(this.score)}`, this.$refs.gameCanvas.width - 70, 20);
        
        // 随机添加新障碍物
        if (Math.random() < 0.02 && this.obstacles.length < 3) {
          this.addObstacle();
        }
      },
      
      // 绘制恐龙
      drawDino(ctx) {
        if (this.dinoImg) {
          ctx.drawImage(this.dinoImg, this.dino.x, this.dino.y, this.dino.width, this.dino.height);
        }
      },
      
      // 更新恐龙状态
      updateDino() {
        if (this.dino.jumping) {
          this.dino.velocityY += this.dino.gravity;
          this.dino.y += this.dino.velocityY;

          if (this.dino.y >= this.ground.y - this.dino.height) {
            this.dino.y = this.ground.y - this.dino.height;
            this.dino.jumping = false;
            this.dino.velocityY = 0;
          }
        } else {
          this.dino.y = this.ground.y - this.dino.height;
          this.dino.velocityY = 0;
        }
      },
      
      // 添加障碍物
      addObstacle() {
        if (!this.$refs.gameCanvas) return;

        if (this.obstacles.length > 0) {
          const lastObstacle = this.obstacles[this.obstacles.length - 1];
          if (lastObstacle.x > this.$refs.gameCanvas.width - this.minObstacleDistance) {
            return;
          }
        }

        const height = 40 + Math.random() * 20;
        const width = 30;
        this.obstacles.push({
          x: this.$refs.gameCanvas.width,
          y: this.ground.y - height,
          width: width,
          height: height
        });
      },
      
      // 更新障碍物位置
      updateObstacles() {
        for (let i = 0; i < this.obstacles.length; i++) {
          this.obstacles[i].x -= this.gameSpeed;
          
          // 移除超出画面的障碍物
          if (this.obstacles[i].x + this.obstacles[i].width < 0) {
            this.obstacles.splice(i, 1);
            i--;
          }
        }
      },
      
      // 绘制障碍物
      drawObstacles(ctx) {
        if (this.cactusImg) {
          for (const obstacle of this.obstacles) {
            ctx.drawImage(this.cactusImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
          }
        }
      },
      
      // 碰撞检测
      checkCollisions() {
        // 碰撞检测缩小碰撞区域，使游戏更友好
        const collisionMargin = 10;
        
        for (const obstacle of this.obstacles) {
          if (
            this.dino.x + collisionMargin < obstacle.x + obstacle.width - collisionMargin &&
            this.dino.x + this.dino.width - collisionMargin > obstacle.x + collisionMargin &&
            this.dino.y + collisionMargin < obstacle.y + obstacle.height - collisionMargin &&
            this.dino.y + this.dino.height - collisionMargin > obstacle.y + collisionMargin
          ) {
            this.gameOver = true;
            clearInterval(this.gameInterval);
            
            // 游戏结束显示
            const ctx = this.$refs.gameCanvas.getContext('2d');
            ctx.fillStyle = "red";
            ctx.font = "30px Arial";
            ctx.fillText("Game Over!", this.$refs.gameCanvas.width / 2 - 80, this.$refs.gameCanvas.height / 2);
            
            // 3秒后重新开始
            setTimeout(() => {
              this.resetGame();
            }, 3000);
          }
        }
      },
      
      // 重置游戏
      resetGame() {
        if (!this.$refs.gameCanvas) {
          if(this.gameInterval) clearInterval(this.gameInterval);
          return;
        }
        this.dino.y = this.ground.y - this.dino.height;
        this.dino.jumping = false;
        this.dino.velocityY = 0;
        this.obstacles = [];
        this.score = 0;
        this.gameOver = false;
        this.spacePressed = false;
        this.spacePressStartTime = 0;
        
        if (this.gameInterval) clearInterval(this.gameInterval);
        const ctx = this.$refs.gameCanvas.getContext('2d');
        this.gameInterval = setInterval(() => {
          this.updateGame(ctx);
        }, 20);
        
        this.addObstacle();
      },
      
      // 跳跃
      jump() {
        if (!this.dino.jumping && !this.gameOver) {
          this.dino.jumping = true;
          this.dino.velocityY = -this.dino.minJumpStrength;
        }
      },
      
      // 键盘控制
      handleKeyDown(e) {
        if (e.code === 'Space' && !this.dino.jumping && !this.spacePressed && !this.gameOver) {
          e.preventDefault();
          this.spacePressed = true;
          this.spacePressStartTime = Date.now();
        }
      },

      handleKeyUp(e) {
        if (e.code === 'Space' && this.spacePressed && !this.gameOver) {
          e.preventDefault();
          const pressDuration = Date.now() - this.spacePressStartTime;
          this.spacePressed = false;

          if (!this.dino.jumping) {
            let jumpStrength = this.dino.minJumpStrength;
            if (pressDuration > this.dino.minJumpPressDuration) {
              const durationRatio = Math.min(1, (pressDuration - this.dino.minJumpPressDuration) / (this.dino.maxJumpPressDuration - this.dino.minJumpPressDuration));
              jumpStrength = this.dino.minJumpStrength + durationRatio * (this.dino.maxJumpStrength - this.dino.minJumpStrength);
            }
            jumpStrength = Math.min(jumpStrength, this.dino.maxJumpStrength);

            this.dino.jumping = true;
            this.dino.velocityY = -jumpStrength;
          }
        }
      },
      
      // 响应式调整
      handleResize() {
        const canvas = this.$refs.gameCanvas;
        if (!canvas) return;
        
        const container = this.$refs.gameContainer;
        if (container) {
          const containerWidth = container.clientWidth;
          canvas.width = Math.min(containerWidth, 600);
        }
      }
    },
  };
</script>

<style scoped>
  #components-layout-basic .header {
    position: fixed;
    z-index: 999;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #00000021;
  }

  #components-layout-basic .content {
    margin-top: 64px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: calc(100vh - 64px - 50px);
  }

  #components-layout-basic .ant-layout-header, .ant-layout-content {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #components-layout-basic .ant-layout-header {
    background: #fff;
    height: auto;
    line-height: 2.3;
  }
  
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 20px;
    width: 100%;
    max-width: 650px;
    flex-grow: 1;
    justify-content: center;
  }
  
  .error-title {
    text-align: center;
    margin-bottom: 15px;
  }
  
  .error-title h1 {
    font-size: 42px;
    color: #ff4d4f;
    margin-bottom: 0;
  }
  
  .game-container {
    width: 100%;
    max-width: 600px;
    margin: 15px 0;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    padding: 10px;
    background-color: #f5f5f5;
    box-sizing: border-box;
  }
  
  #dinosaur-game {
    width: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
  }
  
  #game-canvas {
    background-color: #fff;
    border-radius: 2px;
    height: 150px;
  }
  
  .game-instructions {
    text-align: center;
    color: #666;
    font-size: 13px;
    margin-top: 8px;
  }
  
  .home-button {
    margin-top: 15px;
  }
  
  @media (max-width: 768px) {
    .error-title h1 {
      font-size: 32px;
    }
    .game-container {
      padding: 8px;
      margin: 10px 0;
    }
    .game-instructions {
      font-size: 12px;
    }
  }
   @media (max-width: 400px) {
    .error-container {
      padding-top: 10px;
    }
    .error-title h1 {
      font-size: 28px;
    }
     .game-container {
      margin: 5px 0;
    }
    #game-canvas {
    }
  }
</style>
