<template>
  <u-navbar leftText="" autoBack title="编辑资料" placeholder border />
  <div class="px-24 py-24">
    <z-input :height="112" leftColor="#666" title="头像" icon="arrow-right" :isAvatar="true">
      <button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="chooseAvatar">
        <u-avatar :src="avatar" />
      </button>
    </z-input>
    <z-input v-model:value="nickname" type="nickname" :height="112" leftColor="#666" title="昵称" icon="arrow-right" :maxlength="16" @change="handleUploadName" @blur="uploadName" />
    <button
      open-type="getPhoneNumber"
      class="getphonenumber"
      @getphonenumber="getPnoneNumber"
    >
      <view class="box">
        <text class="left">
          手机号
        </text>
        <view class="right">
          <text class="value" style=" margin: 0;color: #999">
            {{ userPhone }}
          </text>
        </view>
      </view>
    </button>
  </div>
</template>

<script setup lang='ts'>
import { getUserPhonenumber, uploadUser } from '@/api/user';
import useUserStore from '@/store/user';

const avatar = ref<string>('');
const nickname = ref<string>('');
const mobile = ref<string>('');
const avatarUrlValue = ref<string>('');
const userPhone = ref<string>('');

const userStore = useUserStore();

onMounted(() => {
  avatar.value = uni.getStorageSync('avatarurl');
  nickname.value = uni.getStorageSync('nickname');
  mobile.value = uni.getStorageSync('mobile');
  userPhone.value = uni.getStorageSync('mobile');
});

const getPnoneNumber = async (e: any) => {
  uni.showLoading({ title: '修改中...' });
  try {
    const phoneInfo = await getUserPhonenumber(e.detail.code);
    if (phoneInfo) {
      userPhone.value = phoneInfo.phone_info.purePhoneNumber;
      await uploadUser({
        uuid: uni.getStorageSync('uuid'),
        mobile: userPhone.value,
      });
      userStore.setPhone(userPhone.value);
      uni.setStorageSync('mobile', userPhone.value);
      setTimeout(() => {
        uni.hideLoading();
      }, 300);
    }
  }
  catch (error) {
    uni.hideLoading();
    uni.showToast({ icon: 'none', title: '获取手机号失败' });
  }
};

const chooseAvatar = (e: any) => {
  uni.showLoading({ title: '修改中...' });
  avatar.value = e.detail.avatarUrl;
  uni.setStorageSync('avatarurl', avatar.value);
  userStore.setAvatar(avatar.value);
  uni.compressImage({
    src: e.detail.avatarUrl,
    quality: 50,
    success: (res) => {
      uni.getFileSystemManager().readFile({
        filePath: res.tempFilePath,
        encoding: 'base64',
        success: async (res) => {
          avatarUrlValue.value = `data:image/jpeg;base64,${res.data}`;
          await uploadUser({
            uuid: uni.getStorageSync('uuid'),
            avatarUrl: avatarUrlValue.value,
          });
        },
        fail: () => {},
      });
    },
  });
  setTimeout(() => {
    uni.hideLoading();
  }, 300);
};

// 使用微信名称
const handleUploadName = async (name: string) => {
  // uni.showLoading({ title: '修改中...' });
  if (!/^[\u4E00-\u9FA5a-z0-9.\s]{1,16}$/i.test(name)) {
    return uni.showToast({ icon: 'none', title: '昵称只能输入汉字、字母、数字和空格' });
  }
  await uploadUser({
    uuid: uni.getStorageSync('uuid'),
    nickname: name,
  });
  uni.setStorageSync('nickname', name);
  userStore.setName(name);
  nickname.value = name;
  setTimeout(() => {
    uni.hideLoading();
  }, 300);
};

// 手动输入昵称
const uploadName = async (name: string) => {
  uni.showLoading({ title: '修改中...' });
  if (!/^[\u4E00-\u9FA5a-z0-9.\s]{1,16}$/i.test(name)) {
    return uni.showToast({ icon: 'none', title: '昵称只能输入汉字、字母、数字和空格' });
  }
  await uploadUser({
    uuid: uni.getStorageSync('uuid'),
    nickname: name,
  });
  uni.setStorageSync('nickname', name);
  userStore.setName(name);
  nickname.value = name;
  setTimeout(() => {
    uni.hideLoading();
  }, 300);
};
</script>

<style>
page{
  background-color: #fff;
}
</style>

<style scoped lang='scss'>
.avatar-wrapper{
  display: flex;
  align-items: center;
  margin-left: auto;
  background: none;
  flex: 1;
  flex-direction: row-reverse;
}

button::after {
  border: none;
}

.getphonenumber{
  padding: 0 !important;
  background-color: #fff !important;

  .box{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 64px;
    border-bottom: 1px solid #DCDCDC;

    .left{
      margin-left: 16rpx;
      font-size: 18px;
      color: #666;
    }

    .right{
      .value{
        font-size: 28rpx;
        color: #333;
      }
    }
  }
}
</style>
