<template>
  <u-navbar title="支付订单" autoBack placeholder border bgColor="rgb(239,243,248)" />
  <div class="tabs-wrap">
    <up-tabs
      :lineHeight="2" :activeStyle="{ color: '#4F95FF', fontSize: '28rpx' }" :lineWidth="58"
      :inactiveStyle="{ color: '#999999', fontSize: '28rpx' }"
      :lineColor="`${'#4F95FF'}`"
      :current="currentIndex" :list="tablist" :scrollable="false" @click="handleClickTabs"
    />
  </div>
  <scroll-view enable-flex="flexbox" scroll-y>
    <div v-if="currentIndex === 1 && tableList!?.length > 0">
      <div class="box-border px-24">
        <div
          v-for="(item, index) in tableList" :key="index" class="use-card m-t-24"
          :class="{
            'wait': item.status === '00',
            'close': item.status === '02' || item.status === '03',
            'success': item.status === '01',
            'type-ai': item.type.includes('ai'),
          }"
          @click="goDetail(item)"
        >
          <div class="m-b-16 flex-between lh-42">
            <div class="flex items-center">
              <img src="@/static/doctor/use-list-1.png" alt="" class="m-r-18 size-28">
              <div>{{ dayjs(Number(item.create_tm)).format('YYYY/MM/DD HH:mm:ss') }}</div>
            </div>
            <div class="icon">
              <div class="icon-text flex-center">
                {{ item.status === '00' ? '待支付' : item.status === '01' ? '交易成功' : '交易关闭' }}
              </div>
            </div>
          </div>
          <u-line />
          <div v-if="item.beneficiary_id" class="m-t-16 flex-between lh-42">
            <div class="left-title">
              交易类型
            </div>
            <div class="right-title" style="color:#2FC465">
              代购
            </div>
          </div>
          <div v-if="item.type === 'urgent'" class="m-t-16 flex-between lh-42">
            <div class="left-title">
              交易类型
            </div>
            <div class="right-title" style="color:#FF3F3F">
              加急订单
            </div>
          </div>
          <div v-if="item.type !== 'urgent'" class="m-t-16 flex-between lh-42">
            <div class="left-title">
              {{ item.type === 'doctor' ? '医生解读' : '智能分析' }}
            </div>
            <div v-if="item.type === 'doctor'" class="right-title">
              {{ item.quantity }}次
            </div>
            <div v-if="item.type === 'ai-set'" class="right-title">
              {{ item.ai_tag }}
            </div>
            <div v-if="item.type === 'ai-once'" class="right-title">
              {{ item.quantity }}次
            </div>
          </div>
          <div class="m-t-16 flex-between lh-42">
            <div class="left-title">
              {{ item.status === '01' ? '实付款' : '应付款' }}
            </div>
            <div class="right-title">
              {{ item.amount }}元
            </div>
          </div>
          <div v-if="item.beneficiary_name" class="m-t-16 flex-between lh-42">
            <div class="left-title">
              受益人
            </div>
            <div class="right-title">
              {{ item.beneficiary_name }}
            </div>
          </div>
          <div v-if="item.status === '00'" class="m-t-16 flex-between lh-58">
            <div class="flex text-28 text-#FD7F18">
              剩余时间<up-count-down :time="item.time" format="mm:ss" @finish="handleFinish(item)" />
            </div>
            <div class="flex gap-16">
              <div class="cancel-order-btn flex-center" @click.stop="cancelOrder(item)">
                取消订单
              </div>
              <div class="confirm-order-btn flex-center" @click.stop="goPay(item)">
                继续支付
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="currentIndex === 2 && paddingPaymentList?.length > 0">
      <div class="box-border px-24">
        <div
          v-for="(item, index) in paddingPaymentList" :key="index" class="use-card wait m-t-24"
          @click="goDetail(item)"
        >
          <div class="m-b-16 flex-between lh-42">
            <div class="flex items-center">
              <img src="@/static/doctor/use-list-1.png" alt="" class="m-r-18 size-28">
              <div>{{ dayjs(Number(item.create_tm)).format('YYYY/MM/DD HH:mm:ss') }}</div>
            </div>
            <div class="icon">
              <div class="icon-text flex-center">
                待支付
              </div>
            </div>
          </div>
          <u-line />
          <div class="m-t-16 flex-between lh-42">
            <div class="left-title">
              {{ item.type === 'doctor' ? '医生解读' : '智能分析' }}
            </div>
            <div v-if="item.type === 'doctor'" class="right-title">
              {{ item.quantity }}次
            </div>
            <div v-if="item.type === 'ai-set'" class="right-title">
              {{ item.ai_tag }}
            </div>
            <div v-if="item.type === 'ai-once'" class="right-title">
              {{ item.quantity }}次
            </div>
          </div>
          <div class="m-t-16 flex-between lh-42">
            <div class="left-title">
              应付款
            </div>
            <div class="right-title">
              {{ item.amount }}元
            </div>
          </div>
          <div v-if="item.beneficiary_name" class="m-t-16 flex-between lh-42">
            <div class="left-title">
              受益人
            </div>
            <div class="right-title">
              {{ item.beneficiary_name }}
            </div>
          </div>
          <div class="m-t-16 flex-between lh-58">
            <div class="flex text-28 text-#FD7F18">
              剩余时间<up-count-down :time="item.time" format="mm:ss" @finish="handleFinish" />
            </div>
            <div class="flex gap-16">
              <div class="cancel-order-btn flex-center" @click.stop="cancelOrder(item)">
                取消订单
              </div>
              <div class="confirm-order-btn flex-center" @click.stop="goPay(item)">
                继续支付
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="currentIndex === 3 && resolvePaymentList?.length > 0">
      <div class="box-border px-24">
        <div
          v-for="(item, index) in resolvePaymentList" :key="index" class="use-card success m-t-24"
          :class="{
            'type-ai': item.type.includes('ai'),
          }"
          @click="goDetail(item)"
        >
          <div class="m-b-16 flex-between lh-42">
            <div class="flex items-center">
              <img src="@/static/doctor/use-list-1.png" alt="" class="m-r-18 size-28">
              <div>{{ dayjs(Number(item.create_tm)).format('YYYY/MM/DD HH:mm:ss') }}</div>
            </div>
            <div class="icon">
              <div class="icon-text flex-center">
                交易成功
              </div>
            </div>
          </div>
          <u-line />
          <div v-if="item.beneficiary_id" class="m-t-16 flex-between lh-42">
            <div class="left-title">
              交易类型
            </div>
            <div class="right-title" style="color:#2FC465">
              代购
            </div>
          </div>
          <div v-if="item.type !== 'urgent'" class="m-t-16 flex-between lh-42">
            <div class="left-title">
              {{ item.type === 'doctor' ? '医生解读' : '智能分析' }}
            </div>
            <div v-if="item.type === 'doctor'" class="right-title">
              {{ item.quantity }}次
            </div>
            <div v-if="item.type === 'ai-set'" class="right-title">
              {{ item.ai_tag }}
            </div>
            <div v-if="item.type === 'ai-once'" class="right-title">
              {{ item.quantity }}次
            </div>
          </div>
          <div v-if="item.type === 'urgent'" class="m-t-16 flex-between lh-42">
            <div class="left-title">
              交易类型
            </div>
            <div class="right-title" style="color:#FF3F3F">
              加急订单
            </div>
          </div>
          <div class="m-t-16 flex-between lh-42">
            <div class="left-title">
              实付款
            </div>
            <div class="right-title">
              {{ item.amount }}元
            </div>
          </div>
          <div v-if="item.beneficiary_name" class="m-t-16 flex-between lh-42">
            <div class="left-title">
              受益人
            </div>
            <div class="right-title">
              {{ item.beneficiary_name }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="w-full flex-center">
        <img src="/static/images/empty.png" alt="" class="size-480">
      </div>
      <div class="text-center text-39 text-#999999">
        您的订单为空
      </div>
    </div>
    <div class="emptyEle" />
  </scroll-view>
</template>

<script setup lang='ts'>
import dayjs from 'dayjs';
import { cancelOrderOfUrgent, cancelPaddingOrder, cancelPaddingOrderOfAi, cancelPaddingOrderOfOnceAi, getOrderAll } from '@/api/order';
import type { GetOrderParams, OrderResult } from '@/api/order/types';
import type { IPayParams } from '@/api/service/doctor/types';
import { buyAItorService, buyDoctorService, buyDoctorServiceOfUrgent } from '@/api/service/doctor';
import { buyOnceAi } from '@/api/service/ai';

const currentIndex = ref<number>(1);
const tableList = ref<OrderResult[]>();
const paddingPaymentList = ref<OrderResult[]>([]);
const resolvePaymentList = ref<OrderResult[]>([]);
const pageNo = ref<number>(1);
const pageSize = ref<number>(5);
const tablist = ref([
  { name: '', disabled: true },
  { name: '全部' },
  { name: '待付款' },
  { name: '已付款' },
  { name: '', disabled: true },
]);

const init = async (refresh: boolean = true) => {
  if (refresh) {
    pageNo.value = 1;
    paddingPaymentList.value = [];
    resolvePaymentList.value = [];
    tableList.value = [];
  }
  const data: GetOrderParams = {
    accid: uni.getStorageSync('uuid'),
    pageno: pageNo.value,
    pagecnt: pageSize.value,
    type: 'order',
  };
  const res = await getOrderAll(data);
  if (res?.length < pageSize.value && !refresh) {
    uni.showToast({
      title: '没有更多数据了',
      icon: 'none',
      duration: 2000,
    });
  }
  else {
    res.forEach((item) => {
      item.time = item.timeout_duration * 60 * 1000 - (item.current_tm - Number(item.create_tm));
    });
    console.log('res', res);
    tableList.value?.push(...res);
    paddingPaymentList.value = tableList.value!.filter(item => item.status === '00');
    resolvePaymentList.value = tableList.value!.filter(item => item.status === '01');
  }
};

onShow(async () => {
  if (uni.getStorageSync('needrefresh')) {
    uni.removeStorageSync('needrefresh');
    await init();
  }
});

onReachBottom(async () => {
  pageNo.value += 1;
  await init(false);
});

const getOrder = async () => {
  const data: GetOrderParams = {
    accid: uni.getStorageSync('uuid'),
    pageno: pageNo.value,
    pagecnt: 10,
    type: 'order',
  };
  const res = await getOrderAll(data);
  res.forEach((item) => {
    item.time = item.timeout_duration * 60 * 1000 - (item.current_tm - Number(item.create_tm));
  });
  console.log('res', res);
  tableList.value = res;
  paddingPaymentList.value = tableList.value.filter(item => item.status === '00');
  resolvePaymentList.value = tableList.value.filter(item => item.status === '01');
};

onMounted(async () => {
  await getOrder();
});
const handleClickTabs = ({ index }: { index: number }) => {
  if (index === 1) {
    currentIndex.value = index;
  }
  else if (index === 2) {
    currentIndex.value = index;
  }
  else if (index === 3) {
    currentIndex.value = index;
  }
};
const goDetail = (item: OrderResult) => {
  uni.navigateTo({
    url: `/pages/other/orderSearch/detail?item=${JSON.stringify(item)}`,
  });
};
const cancelOrder = async (item: OrderResult) => {
  if (item.type === 'ai-set') {
    await cancelPaddingOrderOfAi({ uuid: item.ai_uuid });
    await getOrder();
    console.log('取消ai订单', item.ai_uuid);
  }
  else if (item.type === 'ai-once') {
    await cancelPaddingOrderOfOnceAi({ uuid: item.ai_uuid });
    await getOrder();
    console.log('取消ai单次订单', item.ai_uuid);
  }
  else if (item.type === 'doctor') {
    const res = await cancelPaddingOrder({ uuid: item.doc_uuid });
    await getOrder();
    console.log('取消医生订单', res);
  }
  else {
    const res = await cancelOrderOfUrgent({ uuid: item.doc_uuid });
    await getOrder();
    console.log('取消医生加急订单', res);
  }
};
// 继续支付
const goPay = async (item: OrderResult) => {
  const payDocParam: IPayParams = {
    payer: uni.getStorageSync('uuid'),
    openid: uni.getStorageSync('openid'),
    appid: 'wxd3c75fd54416963d',
    description: item.description,
    amount: `${item.amount}`,
    quantity: item.quantity ? `${item.quantity}` : '',
    tradeno: item.doc_uuid || item.ai_uuid,
  };
  let res: any;
  if (item.type === 'doctor') {
    res = await buyDoctorService(payDocParam);
  }
  else if (item.type === 'ai-set') {
    res = await buyAItorService(payDocParam);
  }
  else if (item.type === 'ai-once') {
    res = await buyOnceAi(payDocParam);
  }
  else if (item.type === 'urgent') {
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
const handleFinish = async (item: OrderResult) => {
  console.log('完成订单', item);
  await getOrder();
};
</script>

<style scoped lang='scss'>
.emptyEle{
  width: 100%;
  height: 108rpx;
}

.tabs-wrap{
  top: 50%;
  padding: 0 20rpx;
}

.tabs-wrap::after{
  display: block;
  margin-top: -3px;
  width: 100%;
  height: 1px;
  background-color: #ccc;
  content: '';
}

.use-card {
  padding: 24rpx;
  width: 100%;
  background: linear-gradient( 180deg, rgb(239 246 255 / 90%) 0%, #FFF 100%);
  border-radius: 0rpx 0rpx 16rpx 16rpx;
  box-sizing: border-box;
  border-top: 1rpx solid #4F95FF;

  .left-title{
    height: 42rpx;
    font-weight: 400;
    font-size: 24rpx;
    color: #999;
    line-height: 42rpx;
  }

  .right-title{
    height: 42rpx;
    font-weight: 400;
    font-size: 28rpx;
    color: #2F384C;
    line-height: 42rpx;
  }
}

.type-ai{
  background: linear-gradient( 180deg, rgb(227 255 237 / 90%) 0%, #FFF 13%);
  border-top-color: #2FC465;
}

.wait{
  .icon {
    padding: 4rpx 8rpx;
    height: 44rpx;
    background: rgb(253 127 24 / 10%);
    border-radius: 8rpx;

    .icon-text{
      font-size:24rpx;
      color:#FD7F18;
    }
  }
}

.success{
  .icon {
    padding: 4rpx 8rpx;
    height: 44rpx;
    background: rgb(47 196 101 / 10%);
    border-radius: 8rpx;

    .icon-text{
      font-size:24rpx;
      color:#2FC465;
    }
  }
}

.close{
  .icon {
    padding: 4rpx 8rpx;
    height: 44rpx;
    background: rgb(153 153 153 / 10%);
    border-radius: 8rpx;

    .icon-text{
      font-size:24rpx;
      color:#999;
    }
  }
}

.cancel-order-btn{
  width: 144rpx;
  height: 58rpx;
  font-size: 28rpx;
  color: #999;
  border: 1rpx solid #DCDCDC;
  border-radius: 8rpx;
}

.confirm-order-btn{
  width: 144rpx;
  height: 58rpx;
  font-size: 28rpx;
  color: #FFF;
  background: #4F95FF;
  border-radius: 8rpx;
}

:deep(.u-count-down__text) {
  color: #FD7F18 !important;
}
</style>
