<template>
  <u-navbar autoBack title="使用记录" placeholder border bgColor="#F2F5F9" />
  <scroll-view scroll-y enable-flex>
    <div class="box-border px-24">
      <template v-if="list?.length > 0">
        <div v-for="v in list" :key="v.create_tm" class="use-card m-t-24">
          <div class="m-b-16 flex items-center lh-42">
            <img src="@/static/doctor/use-list-1.png" alt="" class="m-r-18 size-28">
            <div>{{ dayjs(Number(v.create_tm)).format('YYYY/MM/DD HH:mm:ss') }}</div>
          </div>
          <u-line />
          <div class="m-t-16 flex items-center justify-between lh-42">
            <div class="left-title">
              成员
            </div>
            <div class="right-title">
              {{ v.pat_name }}
            </div>
          </div>
          <div class="m-t-16 flex items-center justify-between lh-42">
            <div class="left-title">
              扣除方式
            </div>
            <div class="right-title">
              {{ v.consume_type === 'order' ? '购买次数' : '权益次数' }}
            </div>
          </div>
          <div class="m-t-16 flex items-center justify-between lh-42">
            <div class="left-title">
              操作账户
            </div>
            <div class="right-title">
              {{ v.acc_mobile.slice(0, 3) }}****{{ v.acc_mobile.slice(7, 11) }}
            </div>
          </div>
        </div>
        <div class="emptyEle" />
      </template>
      <div v-else class="main">
        <div class="w-full flex-center">
          <img src="/static/images/empty.png" alt="" class="size-480">
        </div>
        <div class="text-center text-39 text-#999999">
          暂无使用记录
        </div>
      </div>
    </div>
  </scroll-view>
</template>

<script setup lang='ts'>
import dayjs from 'dayjs';
import { getUsedDocHist, setUsedListRead } from '@/api/service/doctor';
import type { UseHistListResult } from '@/api/service/doctor/types';

const pageNo = ref(1);
const pageSize = ref(10);
const list = ref<UseHistListResult[]>([]);

const initPage = async (pageNo: number = 1, pageSize: number = 10) => {
  return await getUsedDocHist({
    accid: uni.getStorageSync('uuid'),
    pageno: pageNo,
    pagecnt: pageSize,
  });
};

onReachBottom(async () => {
  console.log('onReachBottom');
  pageNo.value += 1;
  const res = await initPage(pageNo.value, pageSize.value);
  if (res.length <= 0) {
    pageNo.value -= 1;
    uni.showToast({
      title: '没有更多数据了~',
      icon: 'none',
      duration: 2000,
    });
    uni.stopPullDownRefresh();
  }
  else {
    list.value.push(...res);
  }
});

onShow(async () => {
  const res = await initPage();
  console.log(res);
  list.value = res;

  const read = await setUsedListRead(uni.getStorageSync('uuid'));
  console.log('read', read);
});
</script>

<style scoped lang='scss'>
.emptyEle{
  width: 100%;
  height: 108rpx;
}

.use-card {
  padding: 24rpx;
  width: 100%;
  height: 280rpx;
  background: linear-gradient( 180deg, rgb(239 246 255 / 90%) 0%, #FFF 13%);
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
</style>
