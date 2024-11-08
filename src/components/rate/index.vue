<template>
  <div class="star-rating">
    <span
      v-for="star in stars"
      :key="star"
      :class="{ 'star-filled': star <= currentRating, 'star-outline': star > currentRating }"
      class="star"
      @click="setRating(star)"
    >
      <!-- 空的内容，使用 CSS 伪元素来绘制星星 -->
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  rating: number;
  maxStars?: number;
}

const props = defineProps<Props>();

const emit = defineEmits(['update:rating']);

// 当前显示的评分
const currentRating = ref(props.rating);

// 允许用户评分的星数，默认为5
const maxStars = props.maxStars || 5;

// 生成星数数组
const stars = Array.from({ length: maxStars }, (_, i) => i + 1);

// 更新评分
const setRating = (rating: number) => {
  currentRating.value = rating;
  emit('update:rating', rating);
};
</script>

<style scoped>
.star-rating {
  display: inline-block;
}

.star {
  width: 30px;
  height: 30px;
  display: inline-block;
  margin-right: 5px;
  cursor: pointer;
  position: relative;
}

.star::before {
  content: "★";
  position: absolute;
  top: 0;
  left: 0;
  font-size: 30px;
  color: transparent;
  -webkit-text-stroke: 1px #FD7F18; /* 设置星星的边框颜色 */
}

.star-filled::before {
  color: #FD7F18; /* 填充颜色 */
}

.star-outline::before {
  color: transparent;
}
</style>
