<template>
  <u-navbar autoBack title="家庭二维码" placeholder border bgColor="#2FC465" />
  <div class="qrcode px-24">
    <div class="qr-wrap relative">
      <div class="avatar flex-center">
        <img v-if="avatar" :src="avatar" alt="" class="size-150" style="border-radius: 50%">
        <up-avatar v-else :size="75" url="" />
      </div>
      <div class="absolute left-140 top-244 size-360 flex-center bg-white">
        <up-qrcode :size="160" :cid="cid" :val="codeIcon" @result="onQRResult" />
      </div>
      <div class="m-t-104 flex items-center justify-center text-36 text-#2F384C lh-54">
        {{ nickname }}的家庭
      </div>
      <div class="m-t-8 flex items-center justify-center text-28 text-#2F384C lh-42">
        {{ userPhone.slice(0, 3) }}****{{ userPhone.slice(7, 11) }}
      </div>
      <div class="m-t-428 flex items-center justify-center text-28 text-#999999 lh-42">
        扫一扫上面二维码图案，关注我
      </div>
    </div>
    <div class="fe-btn m-t-80 flex-center gap-18 text-white" @click="handleShare">
      <up-icon name="share-square" :color="color" />
      分享二维码
    </div>
    <div class="fe-btn m-t-24 flex-center gap-18 text-white" @click="handleDownload">
      <up-icon name="download" :color="color" />
      下载至相册
    </div>
  </div>
</template>

<script setup lang='ts'>
import { qrcodePrefix } from '@/config/common.config';

const color = '#FFFFFF';
const cid = `${Date.now()}`;
const uuid = ref<string>('');
const avatar = ref<string>('');
const nickname = ref<string>('');
const codeIcon = ref<string>('');
const userPhone = ref<string>('');
const tempQRPath = ref<string>('');

onMounted(() => {
  uuid.value = uni.getStorageSync('uuid');
  nickname.value = uni.getStorageSync('nickname');
  avatar.value = uni.getStorageSync('avatarurl');
  userPhone.value = uni.getStorageSync('mobile');
});

onShow(() => {
  codeIcon.value = `${qrcodePrefix}${uni.getStorageSync('uuid')}`;
});

const handleShare = () => {
  uni.showShareImageMenu({
    path: tempQRPath.value,
  });
};

const handleDownload = () => {
  uni.showLoading({
    title: '保存中',
    mask: true,
  });
  setTimeout(() => {
    uni.saveImageToPhotosAlbum({
      filePath: tempQRPath.value,
      success: () => {
      },
      fail: () => {
        console.log('保存失败');
      },
      complete: () => {
        uni.hideLoading();
      },
    });
  }, 300);
};

const onQRResult = (qrcodePath: string) => {
  tempQRPath.value = qrcodePath;
};
</script>

<style>
page{
  background-color: #2FC465;
}
</style>

<style scoped lang='scss'>
.qrcode{
  // height: 100vh;
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
    width: 100%;
    height: 80rpx;
    border: 1rpx solid #FFF;
    border-radius: 16rpx;
  }
}
</style>
