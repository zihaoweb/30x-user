<template>
  <u-navbar leftText="" autoBack title="意见反馈" placeholder border bgColor="#F2F5F9" />
  <div class="box-border px-24">
    <div class="back-card box-border p-24">
      <div class="text-32 text-#2F384C lh-48">
        <span class="text-#FF3F3F">*</span>问题描述
      </div>
      <div class="relative m-t-10 box-border h-320rpx w-654rpx border-rd-8 bg-#F2F5F9 p-16">
        <textarea v-model="value2" class="textarea" placeholder="请填写问题描述" maxlength="201" placeholder-style="color: #999999" @input="handleInput" @blur="handleBlur" />
        <div class="absolute bottom-16 right-16 text-24 text-#999999">
          {{ textCount }} / 200
        </div>
      </div>
    </div>
    <div class="back-card box-border p-24">
      <div class="text-32 text-#2F384C lh-48">
        上传图片<span class="text-#4F95FF">({{ uploadImageList.length }} / 5)</span>
      </div>
      <div class="box">
        <div v-for="(item) in uploadImageList" :key="item.url" class="relative h-60px w-60px">
          <img :src="item.url" class="wh-full overflow-hidden b-rd-8" @click="previewVideo(item.url)">
          <div class="close-btn" @click="deletePic(item.url)">
            x
          </div>
        </div>
        <div v-if="uploadImageList.length < 5" class="video-box" @click="uploadimage">
          <img src="/static/images/upload-img-icon.png" class="h-48rpx w-48rpx" alt="">
          <div class="video-text">
            添加图片
          </div>
        </div>
      </div>
    </div>
    <div class="back-card box-border p-24">
      <div class="text-32 text-#2F384C lh-48">
        上传视频<span class="text-#4F95FF">({{ uploadVideoList.length }} / 1)</span>
      </div>
      <div class="relative m-t-10 box-border h-220 w-654 border-rd-8 bg-#F2F5F9 p-16">
        <div v-if="uploadVideoFirstImage" class="relative h-60px w-60px">
          <img :src="uploadVideoFirstImage" class="wh-full overflow-hidden b-rd-8" @click="previewVideo()">
          <div class="close-btn" @click="deleteVideo">
            x
          </div>
          <div class="play-icon" @click="previewVideo()">
            <up-icon name="play-right" :size="30" color="rgba(255, 255, 255, 0.8)" />
          </div>
        </div>
        <div v-else class="video-box relative" @click="uploadvideo">
          <up-icon name="camera" :size="30" color="#3a4252" />
          <div class="video-text">
            添加视频
          </div>
          <div class="absolute text-26 text-#999999 -bottom-38">
            0~30秒
          </div>
        </div>
      </div>
    </div>
    <div class="submit-btn" @click="submit">
      提交
    </div>
    <div class="empty" />
  </div>
</template>

<script setup lang='ts'>
import { getFeedBackId } from '@/api/other';

const value2 = ref<string>('');
const uploadVideoFirstImage = ref<string>(''); // 上传视频的第一帧图片
const uploadImageList = ref<any>([
]);
const uploadVideoList = ref<any>([
]);
const textCount = computed(() => {
  return value2.value.length;
});

const submit = async () => {
  console.log('提交');

  // 1. 检查问题描述是否填写
  if (!value2.value) {
    uni.showToast({
      title: '请填写问题描述',
      icon: 'none',
    });
    return;
  }

  uni.showLoading({ title: '提交中', mask: true });

  // 2. 获取反馈ID
  const res = await getFeedBackId({
    acc_id: uni.getStorageSync('uuid'),
    description: value2.value,
  });

  if (res.code === 'OK') {
    const uploadPromises: Promise<any>[] = [];

    // 3. 上传图片
    uploadImageList.value.forEach((item: any) => {
      const imageUploadPromise = new Promise((resolve, reject) => {
        uni.uploadFile({
          url: `${import.meta.env.VITE_APP_BASE_API}/bu/pat_app/feeback/upload-file`,
          filePath: item.url,
          name: 'file',
          formData: {
            accid: uni.getStorageSync('uuid'),
            feeback_id: res.feeback_id,
          },
          success: () => {
            console.log('图片上传成功:', item.url);
            resolve(true); // 上传成功
          },
          fail: (err) => {
            console.log('图片上传失败:', err);
            reject(err); // 上传失败
          },
        });
      });
      uploadPromises.push(imageUploadPromise);
    });

    // 4. 上传视频
    uploadVideoList.value.forEach((item: any) => {
      const videoUploadPromise = new Promise((resolve, reject) => {
        uni.uploadFile({
          url: `${import.meta.env.VITE_APP_BASE_API}/bu/pat_app/feeback/upload-file`,
          filePath: item.url,
          name: 'file',
          formData: {
            accid: uni.getStorageSync('uuid'),
            feeback_id: res.feeback_id,
          },
          success: () => {
            console.log('视频上传成功:', item.url);
            resolve(true); // 上传成功
          },
          fail: (err) => {
            console.log('视频上传失败:', err);
            reject(err); // 上传失败
          },
        });
      });
      uploadPromises.push(videoUploadPromise);
    });

    // 5. 等待所有上传完成
    try {
      await Promise.all(uploadPromises); // 确保所有上传成功
      uni.showToast({
        title: '提交成功, 感谢您的反馈!',
        icon: 'none',
      });
      setTimeout(() => {
        uni.hideLoading();
        uni.navigateBack();
      }, 1500);
    }
    catch (error) {
      // 有任何上传失败
      uni.showToast({
        title: '部分文件上传失败，请重试',
        icon: 'none',
      });
    }
  }
  else {
    uni.showToast({
      title: '服务器开小差了~',
      icon: 'none',
    });
    uni.hideLoading();
  }
};

const uploadvideo = () => {
  wx.chooseMedia({
    count: 1,
    mediaType: ['video'],
    sourceType: ['album', 'camera'],
    maxDuration: 30,
    success(res) {
      console.log(res);
      if (res.tempFiles[0].duration > 30) {
        uni.showToast({ title: '视频时长不能超过30秒', icon: 'none' });
        return;
      }
      uploadVideoFirstImage.value = res.tempFiles[0].thumbTempFilePath;
      uploadVideoList.value.push({ url: res.tempFiles[0].tempFilePath });
    },
    fail(res) {
      console.log(res);
    },
  });
};

const uploadimage = () => {
  wx.chooseMedia({
    count: 5 - uploadImageList.value.length,
    mediaType: ['image'],
    sourceType: ['album', 'camera'],
    success(res) {
      console.log(res);
      for (let i = 0; i < res.tempFiles.length; i++) {
        uploadImageList.value.push({ url: res.tempFiles[i].tempFilePath });
      }
      // uploadImageList.value.push({ url: res.tempFiles[0].tempFilePath });
    },
    fail(res) {
      console.log(res);
    },
  });
};

const deleteVideo = () => {
  uploadVideoList.value = [];
  uploadVideoFirstImage.value = '';
};

const deletePic = (url: string) => {
  uploadImageList.value = uploadImageList.value.filter((item: any) => item.url !== url);
};

const previewVideo = (url: string = '') => {
  const type = url ? 'image' : 'video';
  url = url || uploadVideoList.value[0].url;
  console.log(url, type);
  wx.previewMedia({
    sources: [
      {
        url,
        type,
      },
    ],
  });
};

const handleInput = () => {
  if (value2.value.length > 200) {
    value2.value = value2.value.slice(0, 200);
  }
};
const handleBlur = () => {
  console.log(value2.value);
};
</script>

<style scoped lang='scss'>
.box {
  // relative m-t-10 box-border h-304rpx w-654rpx flex gap-8 border-rd-8 bg-#F2F5F9 p-16
  position: relative;
  display: grid;
  padding: 16rpx;
  margin-top: 10rpx;
  width: 654rpx;
  height: 304rpx;
  background: #F2F5F9;
  border-radius: 8rpx;
  // grid-template-columns: repeat(4, 1fr);
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 8rpx;
  box-sizing: border-box;
}

.submit-btn{
  position: fixed;
  bottom: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 154rpx;
  // m-t-154 h-80rpx flex-center border-rd-16 primary-bg-color text-32 text-#FFFFFF
  width: calc(100vw - 48rpx);
  height: 80rpx;
  font-size: 32rpx;
  color: #FFF;
  background: #4F95FF;
  border-radius: 16rpx;
}

.play-icon{
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 10;
  transform: translate(-50%, -50%);
}

.close-btn{
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30rpx;
  height: 30rpx;
  font-size: 24rpx;
  color: #FFF;
  background-color: #FF3F3F;
  border-radius: 50%;
}

.video-box{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  background-color: #F2F5F9;
  border: 1px dashed #DCDCDC;
  border-radius: 8rpx;
  flex-direction: column;

  .video-text{
    font-size: 24rpx;
    color:#2F384C;
  }
}

.empty{
  width:100%;
  height: 100rpx
}

:deep(.u-upload__deletable) {
  background-color:#FF3F3F !important;
  border-radius: 50% !important;
}

:deep(.u-upload__wrap__preview__other) {
  width: 60px !important;
  height: 60px !important;
}

.upoad-btn{
  width: 60px;
  height: 60px;
  border: 1px dashed #DCDCDC;
  border-radius: 8rpx;
}

.textarea{
  width: 100%;
  height: 100%;
  font-size: 28rpx;
  color: #2F384C;
  background-color: #F2F5F9;
  line-height: 40rpx;
  font-weight: 400;
}

.back-card{
  margin-top: 24rpx;
  width: 100%;
  background: #FFF;
  border-radius: 16rpx;
}
</style>
