<template>
  <u-navbar autoBack title="成员二维码" placeholder border bgColor="#4F95FF" />
  <div class="qrcode px-24">
    <div class="qr-wrap relative">
      <div class="avatar flex-center">
        <!-- <up-avatar :size="75" :url="avatar" /> -->
        <up-avatar :size="75" :src="avatar" />
        <!-- <img :src="avatar" alt="" class="h-150 w-150 b-rd-50"> -->
      </div>
      <div class="absolute left-140 top-244 size-360 flex-center bg-white">
        <up-qrcode :size="160" :cid="cid" :val="codeIcon" @result="onQRResult" />
      </div>
      <div class="m-t-104 flex items-center justify-center text-36 text-#2F384C lh-54">
        {{ name }}
      </div>
      <div class="m-t-478 flex items-center justify-center text-28 text-#999999 lh-42">
        用于设备成员登记
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
const cid = `${new Date().getTime()}`;
const tempQRPath = ref<string>('');
const codeIcon = ref<string>('');
const uuid = ref<string>('');
const name = ref<string>('');
const avatar = ref<string>('');
const birth = ref<string>('');
const gender = ref<number>(0);

onShow(() => {
  codeIcon.value = `${qrcodePrefix}${uuid.value}`;
});

onLoad((options: any) => {
  const res = uni.getStorageSync('memberAvatarUrl');

  avatar.value = res;

  console.log(options);
  uuid.value = options.uuid;
  name.value = options.name;
  birth.value = options.birth;
  gender.value = options.gender;
});

const handleShare = () => {
  uni.showShareImageMenu({
    path: tempQRPath.value,
  });
  console.log('分享');
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
        uni.showToast({
          icon: 'success',
          title: '保存成功',
        });
        console.log('保存成功');
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
  background-color: #4F95FF;
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
    background: linear-gradient( 180deg, rgb(239 246 255 / 90%) 0%, #FFF 100%);
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
