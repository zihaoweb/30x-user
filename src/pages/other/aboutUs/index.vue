<template>
  <u-navbar leftText="" autoBack title="关于我们" placeholder border />
  <div class="px-24">
    <div class="mx-auto m-t-217 size-132">
      <img src="/static/images/logo.png" alt="" class="wh-full">
    </div>
    <div class="m-t-24 text-center text-36 text-#2F384C">
      SIDMED心电报告
    </div>
    <div class="m-t-8 text-center text-24 text-#666666">
      v1.1.0.20240606
    </div>
    <div class="a m-t-80 box-border flex items-center justify-between px-24 lh-80" @click="goAgreement('terms')">
      <div class="text-32 text-#666666">
        隐私政策
      </div>
      <up-icon name="arrow-right" :size="16" />
    </div>
    <div class="a m-t-16 box-border flex items-center justify-between px-24 lh-80" @click="goAgreement('privacy')">
      <div class="text-32 text-#666666">
        用户协议
      </div>
      <up-icon name="arrow-right" :size="16" />
    </div>
  </div>
</template>

<script setup lang='ts'>
const goAgreement = (type: string) => {
  uni.navigateTo({ url: `/pages/laws/index?type=${type}` });
};
</script>

<style>
page{
  background-color: #fff;
}
</style>

<style scoped lang='scss'>
.a{
  border-bottom: 1px solid #DCDCDC;
}
// .logo{
//   width: 160rpx;
//   height: 160rpx;
//   background: #4F95FF;
//   margin: 0 auto;
//   margin-top: 120rpx;
//   border-radius: 24rpx 24rpx 24rpx 24rpx;
// }
</style>
