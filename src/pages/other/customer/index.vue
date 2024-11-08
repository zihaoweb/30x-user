<template>
  <u-navbar autoBack title="联系我们" placeholder border bgColor="#4F95FF" />
  <div class="qrcode relative">
    <div class="absolute left-163 top-312 z-10 h-424 w-424 flex-center border-rd-56 bg-#4F95FF">
      <div class="h-390 w-390 flex-center overflow-hidden border-rd-56 bg-white">
        <up-image showMenuByLongpress src="/static/images/customer-qrcode.png" width="360rpx" height="360rpx" />
      </div>
    </div>
    <div class="absolute left-209 top-768 z-10 text-36 text-#4F95FF lh-54">
      工作日：9:00~17:30
    </div>
    <div class="line" />
    <img src="/static/images/customer-bg.png" alt="" class="absolute left-32 top-170 z-1 h-890 w-686">
    <div class="fe-btn left-24 top-1165 m-t-24 flex-center gap-18 text-white" @click="handleDownload">
      <up-icon name="download" :color="color" />
      下载至相册
    </div>
    <div class="absolute left-231 top-898 z-10 text-24 text-#2F384C lh-36">
      长按二维码识别，立即沟通
    </div>
  </div>
</template>

<script setup lang='ts'>
const color = '#FFFFFF';

const handleDownload = () => {
  uni.showLoading({
    title: '保存中',
    mask: true,
  });
  setTimeout(() => {
    uni.saveImageToPhotosAlbum({
      filePath: '/static/images/customer-qrcode.png',
      success: () => {
        console.log('保存成功');
        uni.showToast({
          title: '保存成功',
          icon: 'none',
        });
      },
      fail: (err) => {
        console.log('保存失败', err);
        uni.showToast({
          title: '保存失败',
          icon: 'none',
        });
      },
    });
  }, 300);
};
</script>

<style>
page{
  background-color: #4F95FF;
}
</style>

<style scoped lang='scss'>
.line{
  position: absolute;
  top: 858rpx;
  left: 113rpx;
  z-index: 10;
  width: 526rpx;
  height: 1px;
  background: #DCDCDC;
}

.qrcode{
  height: 100vh;

  .qr-wrap{
    z-index: 1;
    margin: 240rpx auto 0;
    width: 640rpx;
    height: 714rpx;
    background: linear-gradient( 180deg, rgb(244 255 239 / 90%) 0%, #FFF 100%);
    border: 1rpx solid #FFF;
    border-radius: 16rpx;
  }

  .avatar{
    position: absolute;
    top:-80rpx;
    left: 240rpx;
    overflow: hidden;
    width: 160rpx;
    height: 160rpx;
    background-color: #FFF;
    border-radius: 50%;
  }

  .fe-btn{
    position: absolute;
    width: 702rpx;
    height: 80rpx;
    border: 1rpx solid #FFF;
    border-radius: 16rpx;
  }
}
</style>
