<template>
  <u-navbar leftText="账户" leftIcon="" placeholder border bgColor="transparent" />
  <img class="user-bg" src="@/static/user/userbg.png" alt="">
  <div class="px-24">
    <div class="mt-24 flex items-center justify-between">
      <view class="flex items-center">
        <view class="mr-24">
          <u-avatar :src="avatar" :size="52" />
        </view>
        <view class="flex-1">
          <view class="text-elli max-w-300 pb-8 font-size-36" @click="toLogin">
            {{ userName || '登录' }}
          </view>
          <view class="u-tips-color font-size-28">
            {{ userPhone }}
          </view>
        </view>
      </view>
      <div class="flex gap-30">
        <div class="relative size-44">
          <div @click="getNotification">
            <div
              v-if="notReadMsg > 0"
              class="absolute max-h-44 max-w-44 min-h-26 min-w-26 flex-center border-rd-[50%] bg-#FF3F3F px-2 text-22 text-white -right-6 -top-6"
            >
              {{ notReadMsg > 99 ? '99' : notReadMsg }}
            </div>
            <img src="/static/user/tips.png" alt="" class="h-44 w-44">
          </div>
        </div>
        <img src="/static/user/qrcode.png" alt="" class="h-44 w-44" @click="getQrCode">
        <up-icon name="arrow-right" :size="22" @click="editUserInfo" />
      </div>
    </div>

    <div class="vip mt-74 flex gap-18">
      <div class="vip-box">
        <img src="@/static/user/docicon.png" alt="" class="absolute right-8 h-229 w-144 -top-50 -z-1">
        <p class="text=[#2F384C] h-54 w-144 flex-center text-36 font-700">
          医生解读
        </p>
        <p class="text=[#2F384C] m-t-8 text-24 font-400">
          可用服务次数
        </p>
        <p class="text=[#2F384C] m-t-4 text-24 font-400">
          {{ serviceInfo?.balance || 0 }} 次
        </p>
        <div class="desc-wrap">
          <div><img class="m-r-16 h-24 w-24" src="@/static/user/right-icon.png" alt="">执业医师</div>
          <div><img class="m-r-16 h-24 w-24" src="@/static/user/right-icon.png" alt="">服务严格质控</div>
          <div><img class="m-r-16 h-24 w-24" src="@/static/user/right-icon.png" alt="">承诺24小时内出具报告</div>
        </div>
        <div class="flex gap-14">
          <div class="use-record flex-center flex-1" @click="useRecord">
            使用记录
            <span v-if="hasNewUsageRecord" class="red-dot right-10 top-6" />
          </div>
          <div class="buy-btn flex-center flex-1" @click="buyDoctorVip">
            {{ serviceInfo?.balance ? '立即续费' : '购买服务' }}
          </div>
        </div>
      </div>
      <div class="vip-box">
        <img src="@/static/user/aiicon.png" alt="" class="absolute right-8 h-152 w-152 -z-1">
        <p class="text=[#2F384C] h-54 w-144 flex-center text-36 font-700">
          智能分析
        </p>
        <p class="text=[#2F384C] m-t-8 h-36 text-24 font-400">
          <span v-if="aiServiceIsExpired && serviceInfo?.ai_expired_dt">已于</span>
          <span v-else-if="serviceInfo?.ai_expired_dt">有效期至</span>
          <span v-else>暂未购买服务</span>
        </p>
        <p class="text=[#2F384C] m-t-4 h-36 text-24 font-400">
          {{ serviceInfo?.ai_expired_dt ? serviceInfo?.ai_expired_dt : '' }}<span v-if="aiServiceIsExpired && serviceInfo?.ai_expired_dt">过期</span>
        </p>
        <div class="desc-wrap desc-wrap-ai">
          <div><img class="m-r-16 h-24 w-24" src="@/static/user/right-icon.png" alt="">大数据分析</div>
          <div><img class="m-r-16 h-24 w-24" src="@/static/user/right-icon.png" alt="">服务严格质控</div>
          <div><img class="m-r-16 h-24 w-24" src="@/static/user/right-icon.png" alt="">10分钟快速出报告</div>
        </div>
        <div class="buy-ai-btn flex-center text-white" @click="buyAiVip">
          {{ serviceInfo?.ai_expired_dt ? '立即续费' : '购买服务' }}
        </div>
      </div>
    </div>

    <div class="mt-24">
      <up-row :gutter="8">
        <up-col :span="4">
          <div class="feature-box" @click="toMemberList">
            <img src="@/static/user/membericon.png" alt="" class="m-b-8 h-56 w-56">
            <span class="text-28 line-height-42">家庭成员</span>
          </div>
        </up-col>
        <up-col :span="4">
          <div class="feature-box" @click="toApplyList">
            <img src="@/static/user/applyicon.png" alt="" class="m-b-8 h-56 w-56">
            <span class="text-28 line-height-42">申请查看</span>
          </div>
        </up-col>
        <up-col :span="4">
          <div class="feature-box" @click="toFollowList">
            <img src="@/static/user/fllowicon.png" alt="" class="m-b-8 h-56 w-56">
            <div class="relative text-28 line-height-42">
              关注列表
              <div v-if="hasNewFans" class="red-dot right-0 -top-50" />
            </div>
          </div>
        </up-col>
      </up-row>
    </div>
    <div class="mt-24">
      <div class="feature-box-2">
        其他功能
        <div class="mt-16">
          <up-grid
            :border="false"
            col="4"
            @click="clickFeature2"
          >
            <up-grid-item
              v-for="(listItem, listIndex) in list"
              :key="listIndex"
            >
              <img :src="`/static/user/${listItem.name}.png`" alt="" class="h-56 w-56">
              <text class="grid-text">
                {{ listItem.title }}
              </text>
            </up-grid-item>
          </up-grid>
        </div>
      </div>
    </div>
  </div>
  <u-popup round="20" :show="goLogin" @close="closeLoginForm">
    <div class="px-24">
      <div class="h-80 w-full flex-center">
        隐私政策提示
      </div>
      <button v-if="aloneChecked" class="w—full m-t-24 h-80 border-rd-40 primary-btn text-white" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
        登录
      </button>
      <button v-else class="w—full m-b-24 m-t-24 h-80 border-rd-40 primary-btn text-white" @click="checkAgree">
        登录
      </button>
      <div class="m-b-24 m-t-24 flex items-center gap10">
        <up-checkbox
          v-model:checked="aloneChecked"
          :custom-style="{ marginBottom: '8px' }"
          name="agree"
          usedAlone
          @change="change"
        >
          <template #label>
            <div class="text-28 text-#2F384C">
              同意<span class="primary-color" @click="showLaws('terms')">用户协议</span>与<span class="primary-color" @click="showLaws('privacy')">隐私条款</span>
            </div>
          </template>
        </up-checkbox>
      </div>
    </div>
  </u-popup>
</template>

<script setup lang='ts'>
import dayjs from 'dayjs';
import { wxLogin } from '@/utils/user';
import useMessageStore from '@/store/message';
import useServiceStore from '@/store/service';
import { getServiceInfo } from '@/api/service/ai';
import { getNotifyMessage } from '@/api/notifymsg';
import type { SignUpParams } from '@/api/user/types';
import { OtherPageConfig } from '@/config/otherPpage.config';
import type { getServiceInfoResult } from '@/api/service/ai/types';
import { getUserInfoByUnionId, getUserPhonenumber, loginByCode, signUp, uploadUser } from '@/api/user';
import { getFansList, getSystemConfig } from '@/api/follow';
import { getUsedDocHist } from '@/api/service/doctor';

const messageStore = useMessageStore();
const serviceStore = useServiceStore();

const goLogin = ref(false);
const aloneChecked = ref(false);
const isLogin = ref<boolean>(false);
const aiServiceIsExpired = ref<boolean>(false);

const avatar = ref<string>('');
const userName = ref<string>('');
const userPhone = ref<string>('');
const hasNewFans = ref<boolean>(false);
const hasNewUsageRecord = ref<boolean>(false);

const notReadMsg = ref<number>(0);

const serviceInfo = ref<getServiceInfoResult>();

const list = ref([
  {
    name: 'exchange',
    title: '权益兑换',
  },
  {
    name: 'ordersearch',
    title: '订单查询',
  },
  {
    name: 'devicelist',
    title: '设备列表',
  },
  {
    name: 'statistics',
    title: '月度统计',
  },
  {
    name: 'contactme',
    title: '联系客服',
  },
  {
    name: 'feedback', // 注意：这里修改了 name 从 'star' 改为 'volume'，以避免列表中两个元素具有相同的 name
    title: '意见反馈',
  },
  {
    name: 'aboutme', // 注意：这里修改了 name 从 'star' 改为 'volume'，以避免列表中两个元素具有相同的 name
    title: '关于我们',
  },
]);

const checkIsLogin = () => {
  if (!isLogin.value) {
    uni.showToast({ title: '请先登录', icon: 'none' });
    return false;
  }
  return true;
};

const getUserVipServiceInfo = async (acc_id: string) => {
  const res = await getServiceInfo(acc_id);
  serviceInfo.value = res;
  if (dayjs().isBefore(dayjs(res.ai_expired_dt))) {
    aiServiceIsExpired.value = false;
  }
  else {
    aiServiceIsExpired.value = true;
  }
  serviceStore.setAi(res.ai_expired_dt);
  serviceStore.setDoc(res.balance!);
};

// 获取通知消息数
const getMessageInfo = async () => {
  const acc_id = uni.getStorageSync('uuid');
  const dgNotifyList = await getNotifyMessage({ type: 'dg', acc_id, pageno: 1, pagecnt: 1 });
  const dataNotifyList = await getNotifyMessage({ type: 'data', acc_id, pageno: 1, pagecnt: 1 });
  const reportNotifyList = await getNotifyMessage({ type: 'report', acc_id, pageno: 1, pagecnt: 1 });
  const attentionNotifyList = await getNotifyMessage({ type: 'attention', acc_id, pageno: 1, pagecnt: 1 });
  await getUserVipServiceInfo(acc_id);

  messageStore.setDg(dgNotifyList.data);
  messageStore.setData(dataNotifyList.data);
  messageStore.setReport(reportNotifyList.data);
  messageStore.setAttention(attentionNotifyList.data);

  messageStore.setHasNotRead('dg', dgNotifyList.rows);
  messageStore.setHasNotRead('data', dataNotifyList.rows);
  messageStore.setHasNotRead('report', reportNotifyList.rows);
  messageStore.setHasNotRead('attention', attentionNotifyList.rows);

  notReadMsg.value = bgMsgLength.value + dataMsgLength.value + reportMsgLength.value + attentionMsgLength.value;
};

onLoad(async (params: any) => {
  if (uni.getStorageSync('from')) {
    uni.removeStorageSync('from');
  }
  params.from && uni.setStorageSync('from', params.from);
  console.log('params', params);
});

// 未读的消息数
const bgMsgLength = computed(() => messageStore.getHasNotReaddg);
const dataMsgLength = computed(() => messageStore.getHasNotReaddata);
const reportMsgLength = computed(() => messageStore.getHasNotReadreport);
const attentionMsgLength = computed(() => messageStore.getHasNotReadattention);

// 获取粉丝状态
const getFansStatus = async () => {
  const res2 = await getFansList({ acc_id: uni.getStorageSync('uuid') });
  console.log('res2', res2);
  const res = res2.some(item => item.status === '等待授权');
  if (res) {
    hasNewFans.value = true;
  }
  else {
    hasNewFans.value = false;
  }
};

// 获取最新的使用记录
const getUsageRecord = async () => {
  const res = await getUsedDocHist({ accid: uni.getStorageSync('uuid'), pageno: 1, pagecnt: 1 });
  console.log('getUsageRecord', res);
  if (res.length > 0 && res[0].readed !== 'Y') {
    hasNewUsageRecord.value = true;
  }
  else {
    hasNewUsageRecord.value = false;
  }
};

onPullDownRefresh(async () => {
  try {
    await getFansStatus();
    await getUserVipServiceInfo(uni.getStorageSync('uuid'));
    await getMessageInfo();
    await getUsageRecord();
  }
  catch (error) {
    console.log('getMessageInfo', error);
  }
  uni.stopPullDownRefresh();
  uni.showToast({ title: '刷新成功', icon: 'none' });
});

onShow(async () => {
  avatar.value = uni.getStorageSync('avatarurl');
  userName.value = uni.getStorageSync('nickname');
  userPhone.value = uni.getStorageSync('mobile');
  await getUserVipServiceInfo(uni.getStorageSync('uuid'));
  await getFansStatus();
  await getUsageRecord();
  try {
    await getMessageInfo();
  }
  catch (error) {
    console.log('getMessageInfo', error);
  }
});

onMounted(async () => {
  if (uni.getStorageSync('islogin')) {
    isLogin.value = true;
    goLogin.value = false;
    userName.value = uni.getStorageSync('nickname');
    avatar.value = uni.getStorageSync('avatarurl');
    userPhone.value = uni.getStorageSync('mobile');
  }
  else {
    const { code } = await wxLogin();
    if (code === 'NG')
      return;
    try {
      const { unionid, openid } = await loginByCode(code);
      console.log('App Launch', unionid, openid);
      uni.setStorageSync('unionid', unionid);
      uni.setStorageSync('openid', openid);
      const user = await getUserInfoByUnionId(unionid, '30x');
      console.log('旧用户', user);
      if (user.code === 'NG')
        return;
      goLogin.value = false;
      isLogin.value = true;
      // 如果用户没有 openid，则表示是采集小程序注册的用户
      if (!user.openid) {
        await uploadUser({ uuid: user.uuid, openid });
      }
      if (user.openid_coll) {
        uni.setStorageSync('openidcoll', user.openid_coll);
      }
      uni.setStorageSync('uuid', user.uuid);
      // 更新用户信息
      userName.value = user.nickname;
      avatar.value = user.avatarUrl;
      userPhone.value = user.mobile;
      uni.setStorageSync('islogin', true);
      uni.setStorageSync('nickname', user.nickname);
      uni.setStorageSync('avatarurl', user.avatarUrl);
      uni.setStorageSync('mobile', user.mobile);
      // 获取用户 VIP 服务信息和消息信息
      await getUserVipServiceInfo(user.uuid);
      await getMessageInfo();
    }
    catch (error) {
      console.log(error, '微信登录失败');
      uni.showToast({ icon: 'none', title: '获取数据失败,请刷新重试~' });
    }
  }
  await initSystemConfig();
});

const initSystemConfig = async () => {
  const config = await getSystemConfig();
  console.log('system config: ', config[7].value);
  if (config?.length > 0) {
    uni.setStorageSync('maxfollownum', config[7].value);
  }
  else {
    uni.showModal({
      title: '温馨提示',
      content: '服务器繁忙,请刷新重试~',
      success: (res) => {
        if (res.confirm) {
          initSystemConfig();
        }
      },
      fail: () => {
        uni.exitMiniProgram();
      },
    });
  }
};

const toLogin = async () => {
  if (isLogin.value) {
    return;
  }
  goLogin.value = true;
};

const closeLoginForm = () => {
  goLogin.value = false;
};

const change = () => {
  aloneChecked.value = !aloneChecked.value;
};

const showLaws = (type: string) => {
  uni.navigateTo({ url: `/pages/laws/index?type=${type}` });
};

const checkAgree = () => {
  if (!aloneChecked.value) {
    uni.showToast({ icon: 'none', title: '请勾选同意协议' });
  }
};

const getPhoneNumber = async (e: any) => {
  if (!uni.getStorageSync('islogin')) {
    const { code } = await wxLogin();
    if (code === 'NG')
      return;
    const { unionid, openid } = await loginByCode(code);
    console.log('App Launch', unionid, openid);
    uni.setStorageSync('unionid', unionid);
    uni.setStorageSync('openid', openid);
    const user = await getUserInfoByUnionId(unionid, '30x');
    console.log('旧用户', user);
    if (user.code !== 'NG') {
      goLogin.value = false;
      // 没有openid，说明是采集小程序注册的用户
      if (!user.openid) {
        await uploadUser({
          uuid: user.uuid,
          openid,
        });
      }
      // 从用户小程序注册的用户是没有openid_coll的, 这个用来区分是否是采集小程序注册的用户
      if (user.openid_coll) {
        uni.setStorageSync('openidcoll', user.openid_coll);
      }
      uni.setStorageSync('islogin', true);
      uni.setStorageSync('uuid', user.uuid);
      uni.setStorageSync('nickname', user.nickname);
      uni.setStorageSync('avatarurl', user.avatarUrl);
      uni.setStorageSync('mobile', user.mobile);
      isLogin.value = true;
      userName.value = uni.getStorageSync('nickname');
      avatar.value = uni.getStorageSync('avatarurl');
      userPhone.value = uni.getStorageSync('mobile');
      await getUserVipServiceInfo(user.uuid);
      try {
        await getMessageInfo();
      }
      catch (error) {
        console.log('getMessageInfo', error);
      }
      return;
    }
  }
  if (!e.detail.code) {
    uni.showToast({ icon: 'none', title: '登录前请授权获取手机号' });
    return;
  }
  uni.showLoading({ title: '登录中...', mask: true });
  const phoneInfo = await getUserPhonenumber(e.detail.code);
  uni.setStorageSync('mobile', phoneInfo.phone_info.purePhoneNumber);
  if (phoneInfo) {
    userPhone.value = phoneInfo.phone_info.purePhoneNumber;
  }
  const sign: SignUpParams = {
    unionid: uni.getStorageSync('unionid'),
    openid: uni.getStorageSync('openid'),
    nickname: '微信用户',
    avatarUrl: '',
    mobile: userPhone.value,
    app: '30x',
  };
  const res = await signUp(sign);
  console.log('res', res);
  uni.setStorageSync('uuid', res.uuid);
  uni.setStorageSync('nickname', '微信用户');
  userName.value = '微信用户';
  avatar.value = uni.getStorageSync('avatarurl');
  goLogin.value = false;
  isLogin.value = true;
  uni.hideLoading();
};

const clickFeature2 = (index: number) => {
  if (index === 2) {
    if (uni.getStorageSync('from') === 'collection') {
      uni.removeStorageSync('from');
      uni.navigateBackMiniProgram({
        success() {
          console.log('跳转成功');
        },
        fail(err) {
          console.log('跳转失败', err);
        },
      });
    }
    else {
      uni.navigateToMiniProgram({
        appId: 'wx00b11e338b10ae12',
        path: '/pages/tab/list/index?from=user',
        envVersion: import.meta.env.VITE_APP_ENV === 'development' ? 'trial' : 'release', // 'develop', 'trial', 'release'
        success() {
          console.log('跳转成功');
        },
        fail(err) {
          console.log('跳转失败', err);
        },
      });
    }
  }
  else {
    const ans = checkIsLogin();
    if (!ans) {
      return;
    }
    const page = OtherPageConfig[index];
    uni.navigateTo({ url: page });
  }
};

const editUserInfo = () => {
  const ans = checkIsLogin();
  if (!ans) {
    return;
  }
  uni.navigateTo({ url: '/pages/edituser/index' });
};
const getQrCode = () => {
  const ans = checkIsLogin();
  if (!ans) {
    return;
  }
  uni.navigateTo({ url: '/pages/user/qrcode' });
};
const getNotification = () => {
  const ans = checkIsLogin();
  if (!ans) {
    return;
  }
  uni.navigateTo({ url: '/pages/message/index' });
};
const buyDoctorVip = () => {
  const ans = checkIsLogin();
  if (!ans) {
    return;
  }
  uni.navigateTo({ url: '/pages/service/doctor/index' });
};
const useRecord = () => {
  const ans = checkIsLogin();
  if (!ans) {
    return;
  }
  uni.navigateTo({ url: '/pages/service/doctor/useList' });
};
const buyAiVip = () => {
  const ans = checkIsLogin();
  if (!ans) {
    return;
  }
  uni.navigateTo({ url: '/pages/service/ai/index' });
};
const toMemberList = () => {
  const ans = checkIsLogin();
  if (!ans) {
    return;
  }
  uni.navigateTo({ url: '/pages/member/index' });
};
const toApplyList = () => {
  const ans = checkIsLogin();
  if (!ans) {
    return;
  }
  uni.navigateTo({ url: '/pages/apply/index' });
};
const toFollowList = () => {
  const ans = checkIsLogin();
  if (!ans) {
    return;
  }
  uni.navigateTo({ url: '/pages/follow/index' });
};
</script>

<style>
.user-bg {
  position: absolute;
  top: 0 ;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 800rpx;
}

page{
  position: relative;
}

.vip-box{
  position: relative;
  z-index: 1;
  padding: 24rpx 16rpx;
  width: 100%;
  height: 418rpx;
  background: #fff;
  border-radius: 16rpx;
  box-sizing: border-box;
}

.desc-wrap{
  z-index: 1;
  padding: 22rpx 16rpx;
  margin-top: 18rpx;
  width: 310rpx;
  height: 156rpx;
  font-size: 24rpx;
  color: #2F384C;
  background: linear-gradient( 180deg, rgb(220 235 255 / 90%) 0%, #FFF 100%);
  border: 1rpx solid #FFF;
  border-radius: 16rpx;
  box-sizing: border-box;
  font-weight: 400;
}

.desc-wrap-ai {
  background: linear-gradient( 180deg, rgb(220 255 229 / 90%) 0%, #FFF 100%);
}

.red-dot {
  position: absolute;
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #FF3F3F;
}

.feature-box {
  z-index: -1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 154rpx;
  font-size: 28rpx;
  background-color: #fff;
  border-radius: 8rpx;
  flex-direction: column;
  box-sizing: border-box;
}

.feature-box-2 {
  padding: 24rpx;
  width: 100%;
  background: linear-gradient( 180deg, #EFF6FF 0%, #FFF 17%);
  border: 1rpx solid #FFF;
  border-radius: 16rpx;
  box-sizing: border-box;
}

.grid-text {
    padding: 10rpx 0 20rpx 0rpx;
    font-size: 14px;
    color: #909399;
    /* #ifndef APP-PLUS */
    box-sizing: border-box;
    /* #endif */
}

.use-record{
  height: 68rpx;
  font-size: 24rpx;
  color: #4F95FF;
  background: #FFF;
  border: 1px solid #4F95FF;
  border-radius: 16rpx;
  box-sizing: border-box;
  position: relative;
}

.buy-btn{
  height: 68rpx;
  font-size: 24rpx;
  color: #fff;
  background: linear-gradient( 138deg, #4FD3FF 0%, #4F95FF 100%);
  border-radius: 16rpx;
}

.buy-ai-btn{
  width: 100%;
  height: 68rpx;
  background: linear-gradient( 136deg, #4BD5DF 0%, #2FC49F 100%);
  border-radius: 16rpx;
}
</style>
