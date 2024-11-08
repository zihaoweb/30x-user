<template>
  <u-navbar autoBack title="关注列表" placeholder border bgColor="#F2F5F9" />
  <div class="px-24">
    <div class="scan-wrap m-b-24 m-t-28 box-border flex-between px-16 py-24" @click="scanCode">
      <div class="text-32 text-#2F384C">
        扫描账户二维码添加关注
      </div>
      <div class="flex items-center">
        <img src="/static/other/scan.png" alt="" class="m-r-18 h-27 w-27">
        <up-icon name="arrow-right" />
      </div>
    </div>
    <div class="flex-center" @click="getQrCode">
      <div class="m-r-14 text-26 text-#999999">
        我的二维码:
      </div>
      <img src="/static/images/qrcode-icon.png" alt="" class="h-40 w-40">
    </div>
    <div class="tabs-wrap">
      <up-tabs
        :lineHeight="2" :activeStyle="{ color: '#4F95FF', fontSize: '28rpx' }" :lineWidth="58"
        :inactiveStyle="{ color: '#999999', fontSize: '28rpx' }"
        :lineColor="`${'#4F95FF'}`"
        :current="currentIndex" :list="tablist" :scrollable="false" @click="handleClickTabs"
      />
    </div>
    <div class="m-t-48 flex-between">
      <div v-if="currentIndex === 1" class="text-32 text-#2F384C lh-48">
        我的关注：{{ followList.length }}/{{ maxFollowNum }}
      </div>
      <div v-if="currentIndex === 2" class="text-32 text-#2F384C lh-48">
        关注我的：{{ fansList.length }}
      </div>
      <div class="flex items-center" @click="goHistory">
        <img src="/static/other/followHistoryIcon.png" alt="" class="m-r-14 h-27 w-27">
        <div class="text-32 primary-color lh-48">
          历史记录
        </div>
      </div>
    </div>
    <div v-if="currentIndex === 1 && followList.length > 0">
      <div v-for="(v, i) in followList" :key="i" class="m-t-24 overflow-hidden border-rd-16">
        <up-swipe-action>
          <up-swipe-action-item
            v-for="(item, index) in options"
            :key="index"
            :options="item.options"
            :disabled="item.disabled"
            @click="deviceItemClick(v, 0)"
          >
            <div class="member-wrap relative box-border flex justify-between p-24">
              <div class="flex items-center">
                <up-avatar :size="48" :src="v.followed_avatarUrl" />
                <div class="text-elli m-l-24 w-200 text-32 text-#2F384C lh-54">
                  {{ v.followed_name }}
                </div>
              </div>
              <div class="m-l-24 flex items-center">
                <img src="/static/other/followPhoneIcon.png" alt="" class="m-r-18 h-27 w-27">
                <div>{{ v.followed_mobile.slice(0, 3) }}****{{ v.followed_mobile.slice(7, 11) }}</div>
              </div>
              <div v-if="v.status === '等待授权'" class="valid-icon absolute right-0 top-0 flex-center text-24 text-#FF3F3F">
                等待对方授权
              </div>
            </div>
          </up-swipe-action-item>
        </up-swipe-action>
      </div>
    </div>
    <div v-if="currentIndex === 1 && followList.length <= 0">
      <div class="w-full flex-center">
        <img src="/static/images/empty.png" alt="" class="size-480">
      </div>
      <div class="text-center text-36 text-#999999">
        您的关注列表为空哦～
      </div>
      <div class="go-follow-btn" @click="scanCode">
        <div class="wh-full flex-center border-rd-16 primary-btn text-32 text-white">
          去关注
        </div>
      </div>
    </div>
    <div v-else-if="currentIndex === 2 && fansList.length > 0 ">
      <div v-for="(v, i) in fansList" :key="i" class="m-t-24 overflow-hidden border-rd-16">
        <up-swipe-action>
          <up-swipe-action-item
            v-for="(item, index) in options"
            :key="index"
            :options="item.options"
            :disabled="item.disabled"
            @click="deviceItemClick(v, 1)"
          >
            <div class="member-wrap relative box-border flex justify-between p-24">
              <div class="flex items-center">
                <up-avatar :size="48" :src="v.acc_avatarUrl" />
                <div class="text-elli m-l-24 w-200 text-32 text-#2F384C lh-54">
                  {{ v.acc_name }}
                </div>
              </div>
              <div v-if="v.status === '等待授权'" class="m-l-24 flex items-center gap-12">
                <div class="delete-btn content-btn flex-center" @click="rejectFollow(v)">
                  拒绝
                </div>
                <div class="content-btn flex-center" @click="agreeFollow(v)">
                  同意
                </div>
              </div>
              <div v-if="v.status !== '等待授权'" class="m-l-24 flex items-center">
                <img src="/static/other/followPhoneIcon.png" alt="" class="m-r-18 h-27 w-27">
                <div>{{ v.acc_mobile.slice(0, 3) }}****{{ v.acc_mobile.slice(7, 11) }}</div>
              </div>
            </div>
          </up-swipe-action-item>
        </up-swipe-action>
      </div>
    </div>
    <div v-else-if="currentIndex === 2 && fansList.length <= 0 ">
      <div class="w-full flex-center">
        <img src="/static/images/empty.png" alt="" class="size-480">
      </div>
      <div class="text-center text-36 text-#999999">
        您暂时还没有被关注哦～
      </div>
    </div>
  </div>
  <z-popup :show="tipPop" title="健康共享" :isShowCancel="false" confirmText="我知道了" @confirm="handleConfirm" @close="handleClose">
    <template #default>
      <div class="flex items-center">
        <up-icon name="heart-fill" :size="16" :color="`${'#FF3F3F'}`" />
        <div class="m-l-9 text-36 lh-54">
          添加关注
        </div>
      </div>
      <div class="m-t-16 text-28 text-#666666 lh-42">
        扫描关注对象的账户二维码发送关注申请，及时了解他们的健康状况。
      </div>
      <div class="m-t-24 flex items-center">
        <img src="/static/images/follow-1.png" alt="" class="h-32 w-30">
        <div class="m-l-9 text-36 lh-54">
          添加关注
        </div>
      </div>
      <div class="m-t-16 text-28 text-#2F384C lh-48">
        关注账户同意后您将获得以下权限
      </div>
      <div class="m-t-16 border-rd-16 bg-[#F2F5F9] p-24">
        <div class="flex lh-48">
          <div class="m-r-24 flex items-center text-32">
            <div class="size-24 flex-center border-rd-12 bg-[#4F95FF]">
              <div class="size-8 border-rd-5 bg-white" />
            </div>
            <div class="m-l-12">
              代买服务套餐
            </div>
          </div>
          <div class="flex items-center text-32">
            <div class="size-24 flex-center border-rd-12 bg-[#4F95FF]">
              <div class="size-8 border-rd-5 bg-white" />
            </div>
            <div class="m-l-12">
              查看采集记录
            </div>
          </div>
        </div>
        <div class="m-t-24 flex lh-48">
          <div class="m-r-24 flex items-center text-32">
            <div class="size-24 flex-center border-rd-12 bg-[#4F95FF]">
              <div class="size-8 border-rd-5 bg-white" />
            </div>
            <div class="m-l-12">
              帮忙申请报告
            </div>
          </div>
          <div class="flex items-center text-32">
            <div class="size-24 flex-center border-rd-12 bg-[#4F95FF]">
              <div class="size-8 border-rd-5 bg-white" />
            </div>
            <div class="m-l-12">
              查看PDF报告
            </div>
          </div>
        </div>
      </div>
      <div class="m-t-24 flex items-center">
        <img src="/static/images/follow-2.png" alt="" class="h-32 w-30">
        <div class="m-l-9 text-36 lh-54">
          数据和通知
        </div>
      </div>
      <div class="m-b-106 m-t-16 text-28 text-#666666 lh-42">
        关注账户共享的采集记录和报告将在“申请报告”中显示；有更多新消息时会向您发送通知。
      </div>
    </template>
  </z-popup>
  <z-popup :show="tipFollowPop" title="申请关注" :isShowCancel="false" confirmText="申请" @confirm="handleFollowConfirm" @close="handleFollowClose">
    <template #default>
      <div class="flex items-center">
        <up-avatar :size="48" :src="followOtherUserAvatar" />
        <div class="m-l-9 text-36 text-#2F384C lh-54">
          {{ followOtherUserName }}
        </div>
      </div>
      <div class="m-t-16 text-28 text-#2F384C lh-48">
        关注账户同意后您将获得以下权限
      </div>
      <div class="m-b-64 m-t-16 border-rd-16 bg-[#F2F5F9] p-24">
        <div class="flex lh-48">
          <div class="m-r-24 flex items-center text-32">
            <div class="size-24 flex-center border-rd-12 bg-[#4F95FF]">
              <div class="size-8 border-rd-5 bg-white" />
            </div>
            <div class="m-l-12">
              代买服务套餐
            </div>
          </div>
          <div class="flex items-center text-32">
            <div class="size-24 flex-center border-rd-12 bg-[#4F95FF]">
              <div class="size-8 border-rd-5 bg-white" />
            </div>
            <div class="m-l-12">
              查看采集记录
            </div>
          </div>
        </div>
        <div class="m-t-24 flex lh-48">
          <div class="m-r-24 flex items-center text-32">
            <div class="size-24 flex-center border-rd-12 bg-[#4F95FF]">
              <div class="size-8 border-rd-5 bg-white" />
            </div>
            <div class="m-l-12">
              帮忙申请报告
            </div>
          </div>
          <div class="flex items-center text-32">
            <div class="size-24 flex-center border-rd-12 bg-[#4F95FF]">
              <div class="size-8 border-rd-5 bg-white" />
            </div>
            <div class="m-l-12">
              查看PDF报告
            </div>
          </div>
        </div>
      </div>
    </template>
  </z-popup>
  <z-model
    :show="scanInvalidModel" confirmText="重新扫码" cancelText="取消" title="二维码无效"
    @close="() => { scanInvalidModel = false }" @confirm="scanCode" @cancel="() => { scanInvalidModel = false }"
  >
    <template #default>
      <div class="m-b-40" />
    </template>
  </z-model>
  <!-- 我的关注删除tips -->
  <z-model
    :show="deleteConfirmModel" confirmText="我在想想" cancelText="确认删除" cancelBtnColor="#FF3F3F" title="删除关注" icon="error-circle-fill" iconColor="#FD7F18"
    @confirm="() => { deleteConfirmModel = false }" @cancel="deleteMemberFailConfirm" @close="() => { deleteConfirmModel = false }"
  >
    <template #default>
      <div v-if="isPageOne" class="m-b-40 m-t-24 text-center text-26">
        <span class="text-#FF3F3F">删除</span>关注后，您将无法查看及替他申请报告。
      </div>
      <div v-else class="m-b-40 m-t-24 text-center text-26">
        <span class="text-#FF3F3F">删除</span>关注后，他将无法查看及替你申请报告。
      </div>
    </template>
  </z-model>
</template>

<script setup lang='ts'>
import { getFansList, getFollowList } from '@/api/follow';
import type { FollowListResult } from '@/api/follow/types';
import { changeFollowOther, delFollow, findUserByUuid, followOther } from '@/api/other';
import type { FollowOtherParams } from '@/api/other/types';
import { qrcodePrefix } from '@/config/common.config';
import useUserStore from '@/store/user';

const userStore = useUserStore();

const tipPop = ref<boolean>(false);
const tipFollowPop = ref<boolean>(false);
const scanInvalidModel = ref<boolean>(false);
const currentIndex = ref<number>(1);
const followOtherUserAvatar = ref<string>('');
const followOtherUserName = ref<string>('');
const followOtherUserUuid = ref<string>('');
const deleteConfirmModel = ref<boolean>(false);
const isPageOne = ref<boolean>(true); // 判断是第一页还是第二页
const deleted_id = ref<string>('');
const uuid = ref<string>('');
const maxFollowNum = ref<number>(0); // 最大关注数
const tablist = reactive([
  { name: '', disabled: true },
  { name: '我的关注' },
  { name: '关注我的', badge: { isDot: false } },
  { name: '', disabled: true },
]);
const options = ref([
  {
    text: '',
    disabled: false,
    options: [{
      text: '删除',
      style: {
        backgroundColor: '#FF4500',
      },
    }],
  },
]);
const fansList = ref<FollowListResult[]>([]);
const followList = ref<FollowListResult[]>([]);

const init = async () => {
  const res = await getFollowList({ acc_id: uni.getStorageSync('uuid') });
  followList.value = res;
  const res2 = await getFansList({ acc_id: uni.getStorageSync('uuid') });
  fansList.value = res2;
  const ans = res2.some(item => item.status === '等待授权');
  if (ans) {
    tablist[2].badge = { isDot: true };
  }
  else {
    tablist[2].badge = { isDot: false };
  }
};

onMounted(async () => {
  if (userStore.getFollowTips) {
    setTimeout(() => {
      tipPop.value = true;
      userStore.setFollowTips(false);
    }, 300);
  }
  maxFollowNum.value = uni.getStorageSync('maxfollownum');
});

onShow(async () => {
  await init();
});

const handleClickTabs = async ({ index }: { index: number }) => {
  if (index === 1) {
    currentIndex.value = index;
    isPageOne.value = true;
  }
  else if (index === 2) {
    currentIndex.value = index;
    isPageOne.value = false;
  }
  await init();
};

const scanCode = () => {
  uni.scanCode({
    onlyFromCamera: false,
    scanType: ['qrCode'],
    async success(res) {
      console.log(res.result);
      if (!res.result || !res.result.startsWith(`${qrcodePrefix}`)) {
        scanInvalidModel.value = true;
      }
      const uuid = res.result.split('?')[1];
      if (uuid === uni.getStorageSync('uuid')) {
        uni.showToast({
          title: '不能关注自己',
          icon: 'none',
        });
        return;
      }
      const user = await findUserByUuid(uuid);
      if (user.code === 'NG') {
        uni.showToast({
          title: '用户不存在~',
          icon: 'none',
          duration: 3000,
        });
        return;
      }
      tipFollowPop.value = true;
      followOtherUserAvatar.value = user.avatarUrl;
      followOtherUserName.value = user.nickname;
      followOtherUserUuid.value = user.uuid;
    },
  });
};

const goHistory = () => {
  uni.navigateTo({ url: '/pages/history/index' });
};

const deviceItemClick = async (v: FollowListResult, type: number) => {
  console.log(v);
  deleted_id.value = type === 0 ? v.followed_id : v.acc_id;
  uuid.value = v.uuid;
  deleteConfirmModel.value = true;
};

const deleteMemberFailConfirm = async () => {
  const res = await delFollow({
    acc_id: uni.getStorageSync('uuid'),
    deleted_id: deleted_id.value,
    uuid: uuid.value,
    type: '已删除',
  });
  if (res.code === 'OK') {
    uni.showToast({
      title: '删除成功',
      icon: 'none',
    });
    deleteConfirmModel.value = false;
    await init();
  }
  else if (res.code === 'NG' && res.key === 1) {
    uni.showToast({
      title: res.message,
      icon: 'none',
    });
  }
  else {
    uni.showToast({
      title: res.message,
      icon: 'none',
    });
  }
};
const handleConfirm = async () => {
  tipPop.value = false;
  await init();
};
const handleClose = () => {
  tipPop.value = false;
};
const handleFollowConfirm = async () => {
  const data: FollowOtherParams = {
    acc_id: uni.getStorageSync('uuid'),
    followed_id: followOtherUserUuid.value,
  };
  const ans = await followOther(data);
  console.log('添加结果', ans);
  if (ans.code === 'NG' && (ans.key === 1 || ans.key === 2 || ans.key === 3 || ans.key === 4)) {
    uni.showToast({
      title: `您最多关注${maxFollowNum.value}人`,
      icon: 'none',
    });
  }
  tipFollowPop.value = false;
  await init();
};
const handleFollowClose = () => {
  tipFollowPop.value = false;
};
const rejectFollow = async (user: FollowListResult) => {
  const res = await changeFollowOther({
    uuid: user.uuid,
    status: '已拒绝',
  });
  if (res.code === 'OK') {
    uni.showToast({ icon: 'none', title: '已拒绝' });
  }
  else if (res.code === 'NG') {
    uni.showToast({ icon: 'none', title: res.msg });
  }
  await init();
};
const agreeFollow = async (user: FollowListResult) => {
  const res = await changeFollowOther({
    uuid: user.uuid,
    status: '已关注',
  });
  if (res.code === 'OK') {
    uni.showToast({ icon: 'none', title: '关注成功' });
  }
  else if (res.code === 'NG') {
    if (res.key === 1) {
      uni.showToast({ icon: 'none', title: res.message, duration: 3000 });
    }
    else {
      uni.showToast({ icon: 'none', title: res.msg, duration: 3000 });
    }
    deleteConfirmModel.value = false;
  }
  await init();
};
const getQrCode = () => {
  uni.navigateTo({ url: '/pages/user/qrcode' });
};
</script>

<style scoped lang='scss'>
.pop-btn{
  width: 100%;
  height: 80rpx;
  background: #4F95FF;
  border-radius: 16rpx;
}

.scan-wrap{
  height: 80rpx;
  background: #FFF;
  border-radius: 16rpx;
}

.tabs-wrap::after{
  display: block;
  margin-top: -3px;
  width: 100%;
  height: 1px;
  background-color: dcdcdc;
  content: '';
}

.item-wrap{
  padding: 16rpx 24rpx;
  width: 100%;
  height: 146rpx;
  background: #FFF;
  border-radius: 16rpx;
  box-sizing: border-box;
}

.member-wrap{
  width: 100%;
  height: 146rpx;
  background: #FFF;
}

.valid-icon{
  width: 176rpx;
  height: 52rpx;
  background: rgb(255 63 63 / 10%);
  border-radius: 0rpx 16rpx;
}

.content-btn{
  width: 112rpx;
  height: 68rpx;
  font-size: 24rpx;
  color: #4F95FF;
  background: rgb(79 149 255 / 10%);
  border-radius: 8rpx;
  font-weight: 400;
  line-height: 36rpx;
}

.delete-btn{
  color: #FF3F3F;
  background: rgb(255 63 63 / 10%);
}

.go-follow-btn{
  position: fixed;
  bottom: 100rpx;
  width: calc(100vw - 48rpx);
  height: 80rpx;
}
</style>
