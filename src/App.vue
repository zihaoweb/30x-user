<script setup lang="ts">
import { mpUpdate } from '@/utils/index';

onLaunch(async () => {
  console.log('App Launch');
  // TODO: 两个小程序, 所以分开存储, 需要用unionid去判断是否用户登录注册过我们的小程序;
  mpUpdate();
});
onShow(() => {
  console.log('App Show');
});
onHide(() => {
  console.log('App Hide');
});
</script>

<style lang="scss">
/* 每个页面公共css */
@import 'uview-plus/index.scss';
@import '@/static/styles/common.scss';
</style>
