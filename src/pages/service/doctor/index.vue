<template>
  <u-navbar autoBack title="医生解读服务" placeholder border bgColor="#F2F5F9" />
  <div class="m-t-24 px-20">
    <div class="desc-wrap">
      <div class="desc-title">
        服务内容：
      </div>
      <div class="desc-title-2">
        由专业心电医生为您提供数据解读服务，该服务次数可累加。
      </div>
    </div>
    <div class="m-t-24">
      <up-row :gutter="10">
        <up-col v-for="(item, index) in priceList" :key="index" :span="4" @click="buyDoctorVip(item, index)">
          <div class="price-wrap relative" :class="chooseVipIndex === index ? 'avtive ' : ''">
            <img v-if="chooseVipIndex === index" src="/static/doctor/vip-choose-bg.png" alt="" class="absolute h-260 w-224 -z-1">
            <div class="time">
              {{ item.quantity }} 次
            </div>
            <div class="price">
              <span class="text-24">¥</span>{{ item.amount }}
            </div>
            <div class="price-old">
              ¥{{ item.old_amt }}
            </div>
          </div>
        </up-col>
      </up-row>
    </div>
    <div class="m-t-160">
      <div class="confirm-btn flex-center text-32 text-white" @click="onBuyDebounce">
        ￥{{ priceList[chooseVipIndex].amount }} {{ dgName ? '替他购买' : cancelPay ? '立即支付' : '立即购买' }}
      </div>
    </div>
    <div class="m-t-64">
      <div class="other-buy">
        其他购买方式
      </div>
      <div v-if="memberList.length" class="other-buy-box flex justify-between" @click="userPopup = true">
        <div>帮他人购买</div>
        <div class="flex items-center text-[#4F95FF]">
          <div>{{ dgName ? `${dgName}的家庭账号` : '请选择家庭' }}</div>
          <div class="m-l-8 size-32 flex-center">
            <up-icon name="arrow-down" :size="12" color="4F95FF" />
          </div>
        </div>
      </div>
      <div v-else class="other-buy-box flex items-center text-24 text-#666666">
        暂时没有可以代购的已关注家庭~
      </div>
    </div>
  </div>

  <z-popup
    :show="userPopup"
    :mt="221"
    title="选择家庭"
    @confirm="userPopupConfirm"
    @close="() => { userPopup = false }"
    @cancel="() => { userPopup = false }"
  >
    <template #default>
      <div class="grid-container m-t-56">
        <div class="grid-item relative" :class="{ active: chooseSelf }" @click="handleChooseSelf">
          <div class="flex items-center">
            <div class="my-tag flex-center">
              我的
            </div>
            <div class="m-r-8 size-48">
              <img v-if="avatarurl" :src="avatarurl" alt="" class="wh-full" :style="{ borderRadius: '8rpx' }">
              <up-avatar v-else :size="24" url="" shape="square" />
            </div>
            <div class="flex">
              <div class="text-elli max-w-120 text-32 primary-color">
                {{ username }}
              </div>的家庭
            </div>
          </div>
        </div>
        <div v-for="(item, index) in memberList" :key="item.create_tm" class="grid-item" :class="{ active: index === activeUserIndex }" @click="activeUser(index)">
          <div class="flex items-center">
            <div class="m-r-8 size-48">
              <img v-if="item.followed_avatarUrl" :src="item.followed_avatarUrl" alt="" class="wh-full" :style="{ borderRadius: '8rpx' }">
              <up-avatar v-else :size="24" url="" shape="square" />
            </div>
            <div class="flex">
              <div class="text-elli max-w-120 text-32 primary-color">
                {{ item.followed_name }}
              </div>的家庭
            </div>
          </div>
        </div>
      </div>
    </template>
  </z-popup>

  <z-model :show="paySuccessModel" title="支付成功!" :confirmText="dgName ? '继续购买' : '我知道了'" icon="checkmark-circle-fill" iconColor="#2FC465" :isShowCancel="false" @confirm="paySuccessConfirm" @close="() => { paySuccessModel = false }">
    <template #default>
      <div class="success-box m-b-69 m-t-39 box-border px-24 py-16">
        <div class="my-16 flex-center justify-between">
          <div class="text-28 text-#666666">
            支付金额
          </div>
          <div class="text-28 text-#2F384C">
            ¥ {{ priceList[chooseVipIndex].amount }}
          </div>
        </div>
        <div class="my-16 flex-center justify-between">
          <div class="text-28 text-#666666">
            支付时间
          </div>
          <div class="text-28 text-#2F384C">
            {{ dayjs().format('YYYY/MM/DD HH:mm:ss') }}
          </div>
        </div>
        <div class="my-16 flex-center justify-between">
          <div class="text-28 text-#666666">
            服务类型
          </div>
          <div class="text-28 text-#2F384C">
            医生解读服务
          </div>
        </div>
        <div class="my-16 flex-center justify-between">
          <div class="text-28 text-#666666">
            服务次数
          </div>
          <div class="text-28 text-#2F384C">
            {{ priceList[chooseVipIndex].quantity }}
          </div>
        </div>
        <div v-if="dgName" class="my-16 flex-center justify-between">
          <div class="text-28 text-#666666">
            赠送成员
          </div>
          <div class="text-elli max-w-230 text-28 text-#2F384C">
            {{ dgName }}
          </div>
        </div>
      </div>
    </template>
  </z-model>
</template>

<script setup lang='ts'>
import dayjs from 'dayjs';
import { getFollowList } from '@/api/follow';
import type { FollowListResult } from '@/api/follow/types';
import { buyDoctorService, getDoctorPrice } from '@/api/service/doctor';
import type { IPayParams } from '@/api/service/doctor/types';
import { getServiceInfo } from '@/api/service/ai';
import useServiceStore from '@/store/service';
import { debounce } from '@/utils';

const serviceStore = useServiceStore();

const chooseVipIndex = ref<number>(0);
const priceList = ref();
const userPopup = ref<boolean>(false); // 选择家庭POP
const chooseSelf = ref<boolean>(false);
const activeUserIndex = ref<number>(0);
const memberList = ref<FollowListResult[]>([]);
const dgUuid = ref<string>('');
const dgName = ref<string>('');
const paySuccessModel = ref<boolean>(false);
const cancelPay = ref<boolean>(true);
const avatarurl = ref<string>(uni.getStorageSync('avatarurl')); // 当前家庭的头像
const username = ref<string>(uni.getStorageSync('nickname')); // 当前家庭的用户名

onMounted(async () => {
  priceList.value = await getDoctorPrice();
  memberList.value = await getFollowList({
    acc_id: uni.getStorageSync('uuid'),
    type: 'dg',
  });
});

const paySuccessConfirm = () => {
  console.log('去申请报告');
  paySuccessModel.value = false;
  if (!dgName.value) {
    setTimeout(() => {
      uni.navigateBack();
    }, 300);
  }
};

const buyDoctorVip = (item: any, index: number) => {
  console.log(item, index);
  chooseVipIndex.value = index;
};

const userPopupConfirm = () => {
  if (chooseSelf.value) {
    userPopup.value = false;
    return;
  }
  const { followed_id = '', followed_name } = memberList.value[activeUserIndex.value];
  dgUuid.value = followed_id;
  dgName.value = followed_name;
  console.log(followed_id);
  userPopup.value = false;
};

const getUserVipServiceInfo = async (acc_id: string) => {
  const res = await getServiceInfo(acc_id);
  serviceStore.setDoc(res.balance!);
};

const handleChooseSelf = async () => {
  chooseSelf.value = true;
  activeUserIndex.value = 10;
  dgName.value = '';
  dgUuid.value = '';
};

const onBuy = async () => {
  const payDocParam: IPayParams = {
    payer: uni.getStorageSync('uuid'),
    openid: uni.getStorageSync('openid'),
    appid: 'wxd3c75fd54416963d',
    description: '购买服务次数',
    amount: priceList.value[chooseVipIndex.value].amount,
    quantity: priceList.value[chooseVipIndex.value].quantity,
  };
  if (dgName.value !== '') {
    payDocParam.beneficiary_id = dgUuid.value;
  }
  const res = await buyDoctorService(payDocParam);
  console.log('res', res);
  if (res) {
    wx.requestPayment({
      provider: 'wxpay', // 支付类型-固定值
      timeStamp: res.timeStamp, // 时间戳（单位：秒）
      nonceStr: res.nonceStr, // 随机字符串
      package: res.package, // 固定值
      signType: res.signType, // 固定值
      paySign: res.paySign, // 签名
      async success() {
        await getUserVipServiceInfo(uni.getStorageSync('uuid'));
        paySuccessModel.value = true;
      },
      fail() {
        cancelPay.value = false;
        uni.showToast({ icon: 'none', title: '您尚未完成支付，可在"订单查询"页继续支付' });
      },
    });
  }
  console.log(chooseVipIndex.value);
};

const onBuyDebounce = debounce(onBuy, 500);

const activeUser = (index: number) => {
  activeUserIndex.value = index;
  chooseSelf.value = false;
};
</script>

<style scoped lang='scss'>
.success-box{
  width: 100%;
  background: #F2F5F9;
  border-radius: 8rpx;
}

.single-line-text {
  overflow: hidden;           /* 超出容器的部分隐藏 */
  text-overflow: ellipsis;    /* 超出部分显示省略号 */
  white-space: nowrap;        /* 强制文本在一行显示 */
}

.my-tag{
  background-color: rgba(79, 149, 255, 0.10);
  color: #4F95FF;
  padding: 5rpx 10rpx;
  position: absolute;
  top: 0;
  right: 0;
  font-size: 20rpx;
}

.desc-wrap{
  padding: 16rpx;
  height: 118rpx;
  background: rgb(79 149 255 / 10%);
  border-radius: 16rpx;
  box-sizing: border-box;

  .desc-title{
    height: 42rpx;
    font-weight: 400;
    font-size: 28rpx;
    color: #4F95FF;
    line-height: 42rpx;
  }

  .desc-title-2{
    margin-top: 8rpx;
    height: 36rpx;
    font-weight: 400;
    font-size: 24rpx;
    color: #4F95FF;
    line-height: 36rpx;
  }
}

.price-wrap{
  display: flex;
  align-items: center;
  width: 100%;
  height: 260rpx;
  background: linear-gradient( 180deg, rgb(220 235 255 / 90%) 0%, #FFF 22%);
  border-radius: 16rpx;
  box-shadow: inset 0rpx 4rpx 10rpx 0rpx rgb(255 255 255 / 30%);
  flex-direction: column;

  .time{
    margin-top: 48rpx;
    font-size: 32rpx;
    color: #4F95FF;
    line-height: 48rpx;
  }

  .price{
    margin-top: 24rpx;
    height: 48rpx;
    font-size: 48rpx;
    color: #2F384C;
    line-height: 48rpx;
    font-weight: 700;
  }

  .price-old{
    margin-top: 8rpx;
    height: 36rpx;
    font-size: 24rpx;
    text-decoration: line-through;
    color: #999;
    line-height: 36rpx;
    font-weight: 400;
  }
}

.avtive{
  display: flex;
  align-items: center;
  width: 100%;
  height: 260rpx;
  background: #4F95FF;
  background: none;
  border-radius: 16rpx;
  box-shadow: inset 0rpx 4rpx 10rpx 0rpx rgb(255 255 255 / 30%);
  flex-direction: column;

  .time{
    color: #fff;
  }

  .price{
    color: #fff;
  }

  .price-old{
    color: #fff;
  }
}

.confirm-btn{
  width: 100%;
  height: 96rpx;
  background: #4F95FF;
  border-radius: 16rpx;
}

.other-buy{
  height: 54rpx;
  font-weight: 400;
  font-size: 28rpx;
  color: #2F384C;
  line-height: 54rpx;
}

.other-buy-box{
  padding: 16rpx 24rpx;
  width: 100%;
  height: 80rpx;
  font-size: 32rpx;
  color: #2F384C;
  background: #FFF;
  border-radius: 16rpx;
  box-sizing: border-box;
  font-weight: 400;
}

.grid-container{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18rpx;

  .grid-item{
    padding: 24rpx;
    width: 100%;
    background: #F2F5F9;
    border: 2rpx solid #DCDCDC;
    border-radius: 8rpx;
    box-shadow: 0rpx 8rpx 16rpx 0rpx rgb(79 149 255 / 20%);
    box-sizing: border-box;
  }

  .active {
    background: #FFF;
    border: 2rpx solid #4F95FF;
  }
}
</style>
