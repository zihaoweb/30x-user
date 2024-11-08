<template>
  <u-navbar title="支付详情" autoBack placeholder border />
  <div class="box-border px-24">
    <div class="m-t-32 flex items-center justify-center gap-10">
      <up-icon :name="iconName" :color="topIconColor" />
      <div :style="{ color: textColor }">
        {{ orderDetail?.status === '00' ? '待支付' : orderDetail?.status === '01' ? '支付成功' : '订单已取消' }}
      </div>
    </div>
    <div v-if="isPaddingPayment" class="m-t-24 flex items-center justify-center">
      还剩<up-count-down :time="countdownTime" format="mm:ss" @finish="handleFinish" />关闭订单，请及时付款
    </div>
    <div v-if="isPaddingPayment" class="m-t-40 flex-between gap-18">
      <div class="btn btn-cancel flex-center text-#2F384C" @click="handleCancelOrder">
        取消订单
      </div>
      <div class="btn flex-center primary-btn text-white" @click="handleContinuePayment">
        继续支付
      </div>
    </div>
    <div :style="{ marginTop: isPaddingPayment ? '120rpx' : '73rpx' }">
      <div class="box-item box-border h-80 w-full flex-between px-24 py-16">
        <div class="text-32 text-#999999">
          购买服务
        </div>
        <div v-if="orderDetail?.type === 'doctor'" class="text-32 text-#2F384C">
          医生解读服务
        </div>
        <div v-else-if="orderDetail?.type === 'urgent'" class="text-32 text-#2F384C">
          医生解读服务<span class="text-#FF3F3F">(加急)</span>
        </div>
        <div v-else class="text-32 text-#2F384C">
          智能解读服务
        </div>
      </div>
      <div class="box-item box-border h-80 w-full flex-between px-24 py-16">
        <div v-if="orderDetail?.type === 'ai-set'" class="text-32 text-#999999">
          服务时长
        </div>
        <div v-else class="text-32 text-#999999">
          服务次数
        </div>
        <div v-if="orderDetail?.type === 'doctor'" class="text-32 text-#2F384C">
          {{ orderDetail?.quantity }}次
        </div>
        <div v-if="orderDetail?.type === 'ai-set'" class="text-32 text-#2F384C">
          {{ orderDetail?.ai_tag }}
        </div>
        <div v-if="orderDetail?.type === 'ai-once'" class="text-32 text-#2F384C">
          {{ orderDetail?.quantity }}次
        </div>
        <div v-if="orderDetail?.type === 'urgent'" class="text-32 text-#2F384C">
          {{ orderDetail?.quantity }}次
        </div>
      </div>
      <div v-if="orderDetail?.type !== 'urgent'" class="box-item box-border h-80 w-full flex-between px-24 py-16">
        <div class="text-32 text-#999999">
          订单类型
        </div>
        <div v-if="orderDetail?.type === 'urgent'" class="text-32 text-#2F384C">
          医生权益加急购买
        </div>
        <div v-else class="text-32 text-#2F384C">
          {{ orderDetail?.type === 'doctor' ? '医生权益购买' : orderDetail?.type === 'ai-set' ? '智能权益购买' : '智能单次购买' }}
        </div>
      </div>
      <div class="box-item box-border h-80 w-full flex-between px-24 py-16">
        <div class="text-32 text-#999999">
          创建时间
        </div>
        <div class="text-32 text-#2F384C">
          {{ dayjs(Number(orderDetail?.create_tm)).format('YYYY/MM/DD HH:mm:ss') }}
        </div>
      </div>
      <!-- <div class="box-item box-border h-80 w-full flex-between px-24 py-16">
        <div class="text-32 text-#999999">
          有效期至
        </div>
        <div class="text-32 text-#2F384C">
          2025/02/08 12:00:00
        </div>
      </div> -->
      <div class="box-item box-border h-80 w-full flex-between px-24 py-16">
        <div class="w-130 text-32 text-#999999">
          订单编号
        </div>
        <div v-if="orderDetail?.type === 'doctor'" class="text-elli w-380 text-32 text-#2F384C">
          {{ orderDetail?.doc_uuid }}
        </div>
        <div v-else-if="orderDetail?.type === 'urgent'" class="text-elli w-380 text-32 text-#2F384C">
          {{ orderDetail?.doc_uuid }}
        </div>
        <div v-else class="text-elli w-380 text-32 text-#2F384C">
          {{ orderDetail?.ai_uuid }}
        </div>
      </div>
      <div class="box-item box-border h-80 w-full flex-between px-24 py-16">
        <div class="text-32 text-#999999">
          实付金额
        </div>
        <div class="text-32 text-#2F384C">
          ￥{{ orderDetail?.amount }}
        </div>
      </div>
      <div v-if="orderDetail?.beneficiary_name" class="box-item box-border h-80 w-full flex-between px-24 py-16">
        <div class="text-32 text-#999999">
          受益人
        </div>
        <div class="text-elli max-w-200 text-32 text-#2F384C">
          {{ orderDetail?.beneficiary_name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import dayjs from 'dayjs';
import type { OrderResult } from '@/api/order/types';
import { cancelOrderOfUrgent, cancelPaddingOrder, cancelPaddingOrderOfAi, cancelPaddingOrderOfOnceAi } from '@/api/order';
import type { IPayParams } from '@/api/service/doctor/types';
import { buyAItorService, buyDoctorService, buyDoctorServiceOfUrgent } from '@/api/service/doctor';
import { buyOnceAi } from '@/api/service/ai';

const topIconColor = ref<string>('#2FC465');
const iconName = ref<string>('checkmark-circle-fill');
const textColor = ref<string>('#2FC465');
const isPaddingPayment = ref<boolean>(false);
const orderDetail = ref<OrderResult>();
const countdownTime = ref<number>(0);
const currentTime = dayjs().valueOf();

onLoad((params: any) => {
  const res = JSON.parse(params.item) as OrderResult;
  console.log(res);
  countdownTime.value = res.timeout_duration * 60 * 1000 - (currentTime - Number(res.create_tm));
  orderDetail.value = res;
  if (res.status === '01') {
    topIconColor.value = '#2FC465';
    iconName.value = 'checkmark-circle-fill';
    textColor.value = '#2FC465';
    isPaddingPayment.value = false;
  }
  else if (res.status === '00') {
    topIconColor.value = '#FD7F18';
    iconName.value = 'error-circle-fill';
    textColor.value = '#FD7F18';
    isPaddingPayment.value = true;
  }
  else if (res.status === '02' || res.status === '03') {
    topIconColor.value = '#4F95FF';
    iconName.value = 'checkmark-circle-fill';
    textColor.value = '#2F384C';
    isPaddingPayment.value = false;
  }
});

const handleCancelOrder = async () => {
  uni.showLoading({ title: '取消中...', mask: true });
  if (orderDetail.value!.type === 'ai-set') {
    await cancelPaddingOrderOfAi({ uuid: orderDetail.value!.ai_uuid });
  }
  else if (orderDetail.value!.type === 'ai-once') {
    await cancelPaddingOrderOfOnceAi({ uuid: orderDetail.value!.ai_uuid });
  }
  else if (orderDetail.value!.type === 'doctor') {
    await cancelPaddingOrder({ uuid: orderDetail.value!.doc_uuid });
  }
  else {
    await cancelOrderOfUrgent({ uuid: orderDetail.value!.doc_uuid });
  }
  uni.setStorageSync('needrefresh', true);
  setTimeout(() => {
    uni.navigateBack();
  }, 800);
};

const handleContinuePayment = async () => {
  uni.setStorageSync('needrefresh', true);
  const payDocParam: IPayParams = {
    payer: uni.getStorageSync('uuid'),
    openid: uni.getStorageSync('openid'),
    appid: 'wxd3c75fd54416963d',
    description: orderDetail.value!.description,
    amount: `${orderDetail.value!.amount}`,
    quantity: orderDetail.value!.quantity ? `${orderDetail.value!.quantity}` : '',
    tradeno: orderDetail.value!.doc_uuid || orderDetail.value!.ai_uuid,
  };
  let res: any;
  if (orderDetail.value!.type === 'doctor') {
    res = await buyDoctorService(payDocParam);
  }
  else if (orderDetail.value!.type === 'ai-set') {
    res = await buyAItorService(payDocParam);
  }
  else if (orderDetail.value!.type === 'ai-once') {
    res = await buyOnceAi(payDocParam);
  }
  else if (orderDetail.value!.type === 'urgent') {
    res = await buyDoctorServiceOfUrgent(payDocParam);
  }
  if (res.payment) {
    res = res.payment;
  }
  if (res) {
    wx.requestPayment({
      provider: 'wxpay', // 支付类型-固定值
      timeStamp: res.timeStamp, // 时间戳（单位：秒）
      nonceStr: res.nonceStr, // 随机字符串
      package: res.package, // 固定值
      signType: res.signType, // 固定值
      paySign: res.paySign, // 签名
      success() {
        uni.showToast({ icon: 'none', title: '支付成功' });
        uni.navigateBack();
      },
    });
  }
};

const handleFinish = () => {
  uni.setStorageSync('needrefresh', true);
  isPaddingPayment.value = false;
  orderDetail.value!.status = '02';
  topIconColor.value = '#4F95FF';
  iconName.value = 'checkmark-circle-fill';
  textColor.value = '#2F384C';
};
</script>

<style>
page{
  background: #fff;
}
</style>

<style scoped lang='scss'>
:deep(.u-count-down__text) {
  color: #FD7F18 !important;
}

.btn{
  height: 80rpx;
  font-size: 32rpx;
  border-radius: 16rpx;
  flex: 1;
}

.btn-cancel{
  border: 1rpx solid #999;
}

.box-item{
  border-bottom: 1rpx solid #DCDCDC;
  margin-bottom: 24rpx;
}

.text-elli {
  overflow: hidden;         /* 溢出隐藏 */
  text-overflow: ellipsis;  /* 溢出显示省略号 */
  white-space: nowrap;      /* 不换行 */
}
</style>
