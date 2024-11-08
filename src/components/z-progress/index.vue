<template>
  <div class="progress-container">
    <!-- 通过 props 传递的进度值设置进度条的宽度 -->
    <div class="progress-bar" :style="{ width: `${progress}%` }">
      <span class="progress-text">
        {{ progress }}%
      </span>
    </div>
  </div>
</template>

<script setup>
// 使用 props 接收父组件传递的进度值
defineProps({
  progress: {
    type: Number,
    required: true,
    default: 0,
    validator: value => value >= 0 && value <= 100, // 验证值是否在 0-100 之间
  },
});
</script>

<style scoped>
.progress-container {
  display: flex;
  align-items: center;
  overflow: hidden;
  margin: 0 auto;
  margin-bottom: 20px;
  width: 80%;
  background-color: #fff;
  border-radius: 30px;
  box-shadow: 0 4px 15px rgb(0 0 0 / 20%);
}

.progress-bar {
  position: relative;
  height: 15px;
  background: linear-gradient(90deg,#4F95FF , #4FD3FF);
  border-radius: 30px;
  transition: width 0.3s ease-in-out;
  animation: glowing 1.5s infinite alternate
}

.progress-text{
  position: absolute;
  right: 0;
  font-size: 22rpx;
  color: #666;
}

@keyframes glowing {
  0% {
    box-shadow: 0 0 5px #4facfe, 0 0 10px #4facfe, 0 0 15px #00f2fe;
  }

  100% {
    box-shadow: 0 0 20px #00f2fe, 0 0 30px #4facfe, 0 0 40px #00f2fe;
  }
}
</style>
