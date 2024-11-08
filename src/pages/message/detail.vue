<template>
  <u-navbar autoBack title="消息中心" placeholder border bgColor="#F2F5F9" />
  <scroll-view scroll-y enable-flex>
    <div class="box-border px-24">
      <template v-if="NotifyMessageList?.length > 0">
        <div v-for="(v, i) in NotifyMessageList" :key="i" class="use-card delete m-t-24">
          <div class="m-b-16 flex-between lh-42">
            <div class="flex items-center">
              <img src="/static/doctor/use-list-1.png" alt="" class="m-r-18 size-28">
              <div>{{ dayjs(Number(v.create_tm)).format('YYYY/MM/DD HH:mm:ss') }}</div>
            </div>
          </div>
          <u-line />
          <div v-if="type === 'data'" class="box1">
            <span v-if="v.attention_name">{{ v.attention_name }}--</span><span class="primary-color">{{ v.pat_name }}</span>采集了一条{{ Math.floor(Number(v.description) / 60) > 0 ? `${Math.floor(Number(v.description) / 60)}分钟` : `${v.description}秒` }}的数据
          </div>
          <div v-else-if="type === 'report' && v.description.startsWith('其他')" class="box1">
            <span v-if="v.pat_acc_name">{{ v.pat_acc_name }}--</span>
            <span class="primary-color">
              {{ v.pat_name }}
            </span>的{{ v.description.includes('AI') ? '智能分析' : '医生解读' }}报告已完成
          </div>
          <div v-else-if="type === 'report' && v.self" class="box1">
            你为<span v-if="v.attention_name">{{ v.pat_acc_name }}--</span><span class="primary-color">
              {{ v.pat_name }}
            </span>申请的{{ v.description === '医生报告' ? '医生解读' : '智能分析' }}报告已完成
          </div>
          <div v-else-if="type === 'report' && !v.self && v.attention_id" class="box1">
            <span class="primary-color">
              {{ v.attention_name }}
            </span>为你申请的{{ v.description === '医生报告' ? '医生解读' : '智能分析' }}报告已完成
          </div>
          <div v-else-if="type === 'report'" class="box1">
            <span v-if="v.pat_acc_name && v.owner === 'N'">你为{{ v.pat_acc_name }}--</span>
            <span class="primary-color">
              {{ v.pat_name }}
            </span><span v-if="v.pat_acc_name && v.owner === 'N'">申请</span>的{{ v.description === '医生报告' ? '医生解读' : '智能分析' }}报告已完成
          </div>
          <div v-else-if="type === 'attention' && v.description === '被删除'" class="box1">
            <span class="primary-color">{{ v.acc_name }}</span>删除了你的关注
          </div>
          <div v-else-if="type === 'attention' && v.description === '被移除'" class="box1">
            你被<span class="primary-color">{{ v.acc_name }}</span>移除了关注
          </div>
          <div v-else-if="type === 'attention' && v.description === '已删除'" class="box1">
            <span class="primary-color">{{ v.attention_name }}</span>删除了你的关注
          </div>
          <div v-else-if="type === 'attention' && v.description === '已移除'" class="box1">
            你被<span class="primary-color">{{ v.attention_name }}</span>移除了关注
          </div>
          <div v-else-if="type === 'dg' && v.description.startsWith('A')" class="box1">
            你为<span class="primary-color">
              {{ v.attention_name }}
            </span>代购的{{ getGdDocTime(v.description) }}{{ v.description.startsWith('AI') ? '智能分析' : '医生解读' }}服务已到账
          </div>
          <div v-else-if="type === 'dg' && v.description.startsWith('收')" class="box1">
            <span class="primary-color">
              {{ v.attention_name }}
            </span>为你代购的{{ getGdDocTime(v.description) }}{{ v.description.startsWith('收到AI') ? '智能分析' : '医生解读' }}服务已到账
          </div>
          <div v-else-if="type === 'dg' && v.description.startsWith('医生')" class="box1">
            你为<span class="primary-color">
              {{ v.attention_name }}
            </span>代购的{{ getGdDocTime(v.description) }}{{ v.description.startsWith('AI') ? '智能分析' : '医生解读' }}服务已到账
          </div>
        </div>
      </template>
      <div v-else>
        <div class="w-full flex-center">
          <img src="/static/images/empty.png" alt="" class="size-480">
        </div>
        <div class="text-center text-39 text-#999999">
          您的消息为空~
        </div>
      </div>
    </div>
    <canvas id="canvas" type="2d" style="width: 0; height: 0;pointer-events: none;" />
    <div class="emptyEle" />
  </scroll-view>
</template>

<script setup lang='ts'>
import dayjs from 'dayjs';
import useMessageStore from '@/store/message';
import { setMessageNotificationRead } from '@/api/report';
import type { MessageList } from '@/api/notifymsg/types';
import { getNotifyMessage } from '@/api/notifymsg';

const messageStore = useMessageStore();
const NotifyMessageList = ref<MessageList[]>([]);
const type = ref <string>('');
const pageNo = ref<number>(1);
const pageSize = ref<number>(10);

const initPage = async (type: string, pageno: number = 1, pagecnt: number = 10) => {
  return await getNotifyMessage({ acc_id: uni.getStorageSync('uuid'), type, pageno, pagecnt });
};

onReachBottom(async () => {
  pageNo.value += 1;
  const res = await initPage(type.value, pageNo.value, pageSize.value);
  if (res.data.length <= 0) {
    uni.stopPullDownRefresh();
    pageNo.value -= 1;
    uni.showToast({
      title: '没有更多数据了~',
      icon: 'none',
    });
  }
  else {
    NotifyMessageList.value.push(...res.data);
  }
});

onLoad(async (options: any) => {
  type.value = options.type;
  const { data } = await initPage(type.value);
  messageStore.setHasNotRead(type.value);
  if (type.value === 'report') {
    data.forEach((item) => {
      item.self = (item.attention_id === uni.getStorageSync('uuid'));
    });
  }
  NotifyMessageList.value = data;
});

const getGdDocTime = (str: string) => {
  return str.split('套餐')[1];
};

onShow(async () => {
  const res = await setMessageNotificationRead({
    acc_id: uni.getStorageSync('uuid'),
    type: type.value,
  });
  console.log(res);
});
</script>

<style scoped lang='scss'>
.box1 {
  margin-top: 16rpx;
  line-height: 42rpx;
}

.tabs-wrap::after{
  display: block;
  margin-top: -3px;
  width: 100%;
  height: 1px;
  background-color: #ccc;
  content: '';
}

.use-card{
  padding: 25rpx 24rpx;
  width: 100%;
  background: linear-gradient( 180deg, rgb(239 246 255 / 90%) 0%, #FFF 13%);
  border-radius: 0rpx 0rpx 16rpx 16rpx;
  border-top: 1rpx solid #4F95FF;
  box-sizing: border-box;
}

.delete{
  background: linear-gradient( 180deg, rgb(239 246 255 / 90%) 0%, #FFF 13%);
  border-top-color: #4F95FF;

  .icon {
    width: 88rpx;
    height: 44rpx;
    background: rgb(255 63 63 / 10%);
    border-radius: 8rpx;

    .icon-text{
      font-size:24rpx;
      color:#FF3F3F;
    }
  }
}

.success{
  .icon {
    width: 88rpx;
    height: 44rpx;
    background: rgb(79 149 255 / 10%);
    border-radius: 8rpx;

    .icon-text{
      font-size:24rpx;
      color:#4F95FF;
    }
  }
}

.expired{
  .icon {
    width: 88rpx;
    height: 44rpx;
    background: rgb(253 127 24 / 10%);
    border-radius: 8rpx;

    .icon-text{
      font-size:24rpx;
      color:#FD7F18;
    }
  }
}

.emptyEle{
  width: 100%;
  height: 108rpx;
}
</style>
