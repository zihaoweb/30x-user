<template>
  <u-navbar autoBack title="消息中心" placeholder border />
  <div class="px-24">
    <div v-if="hasreport" class="container" @click="handleClick('report')">
      <div class="flex items-center">
        <div class="icon-wrap relative m-l-24 m-r-16 size-72">
          <div v-if="reportMsgLength > 0" class="tip-num">
            {{ reportMsgLength }}
          </div>
          <img class="icon absolute m-t-4 h-48 w-48" src="/static/message/reportIcon.png" alt="">
        </div>
        <div class="m-l-16">
          <div class="title-1">
            报告完成
          </div>
          <div v-if="reporttag" class="title-2">
            <div v-if="hasreport">
              你为<span v-if="m3attentionname">{{ m3attentionname }}--</span><span>
                {{ m3name }}
              </span>申请的{{ m3type }}报告已完成
            </div>
            <div v-else>
              快去完成报告吧
            </div>
          </div>
          <div v-else class="title-2">
            <div v-if="m3tag">
              {{ m3name2 }}为你申请的{{ m3type }}报告已完成
            </div>
            <div v-else-if="hasreport">
              <span v-if="m3attentionname">{{ m3attentionname }}--</span>
              <span>
                {{ m3name }}
              </span>的{{ m3type }}报告已完成
            </div>
            <div v-else>
              快去完成报告吧
            </div>
          </div>
        </div>
      </div>
      <div class="absolute right-24 text-24 text-#999999">
        {{ hasreport ? dayjs(Number(reportLastTime)).format('MM/DD HH:mm') : '' }}
      </div>
    </div>
    <up-line v-if="hasreport" />
    <div v-if="hasdg" class="container" @click="handleClick('dg')">
      <div class="flex items-center">
        <div class="icon-wrap icon-wrap-2 relative m-l-24 m-r-16 size-72">
          <div v-if="bgMsgLength > 0" class="tip-num">
            {{ bgMsgLength }}
          </div>
          <img class="icon absolute m-t-4 h-48 w-48" src="/static/message/buyIcon.png" alt="">
        </div>
        <div class="m-l-16">
          <div class="title-1">
            代购到账
          </div>
          <div v-if="dgtag" class="title-2">
            <div v-if="hasdg">
              <span>
                {{ m1name }}
              </span>为你代购的{{ m1type }}已到账
            </div>
            <div v-else>
              快去代购吧
            </div>
          </div>
          <div v-else class="title-2">
            <!-- {{ hasdg ? `你为${m1name}代购的${m1type}已到账` : '快去代购吧' }} -->
            <div v-if="hasdg">
              你为<span>
                {{ m1name }}
              </span>代购的{{ m1type }}已到账
            </div>
            <div v-else>
              快去代购吧
            </div>
          </div>
        </div>
      </div>
      <div class="absolute right-24 text-24 text-#999999">
        {{ hasdg ? dayjs(Number(dgLastTime)).format('MM/DD HH:mm') : '' }}
      </div>
    </div>
    <up-line v-if="hasdg" />
    <div v-if="hasdata" class="container" @click="handleClick('data')">
      <div class="flex items-center">
        <div class="icon-wrap icon-wrap-3 relative m-l-24 m-r-16 size-72">
          <div v-if="dataMsgLength > 0" class="tip-num">
            {{ dataMsgLength }}
          </div>
          <img class="icon absolute m-t-4 h-48 w-48" src="/static/message/dataIcon.png" alt="">
        </div>
        <div class="m-l-16">
          <div class="title-1">
            数据上传
          </div>
          <div class="title-2">
            <div v-if="hasdata">
              <span v-if="m2attentionname">{{ m2attentionname }}--</span><span class="text-elli max-w-220">
                {{ m2name }}
              </span>采集了一条{{ m2duration }}的数据
            </div>
            <div v-else class="flex">
              快去上传数据吧
            </div>
          </div>
        </div>
      </div>
      <div class="absolute right-24 text-24 text-#999999">
        {{ hasdata ? dayjs(Number(dataLastTime)).format('MM/DD HH:mm') : '' }}
      </div>
    </div>
    <up-line v-if="hasdata" />
    <div v-if="hasattention" class="container" @click="handleClick('attention')">
      <div class="flex items-center">
        <div class="icon-wrap icon-wrap-4 relative m-l-24 m-r-16 size-72">
          <div v-if="attentionMsgLength > 0" class="tip-num">
            {{ attentionMsgLength }}
          </div>
          <img class="icon absolute m-t-4 h-48 w-48" src="/static/message/followIcon.png" alt="">
        </div>
        <div class="m-l-16">
          <div class="title-1">
            关注消息
          </div>
          <div v-if="attentionTag" class="title-2">
            <div v-if="hasattention" class="flex">
              你被<div class="text-elli max-w-220">
                {{ m4name }}
              </div>移除了关注
            </div>
            <div v-else>
              快去关注吧
            </div>
          </div>
          <div v-else class="title-2">
            <div v-if="hasattention" class="flex">
              <div class="text-elli max-w-220">
                {{ m4name }}
              </div>删除了你的关注
            </div>
            <div v-else>
              快去关注吧
            </div>
          </div>
        </div>
      </div>
      <div class="absolute right-24 text-24 text-#999999">
        {{ hasattention ? dayjs(Number(attentionLastTime)).format('MM/DD HH:mm') : '' }}
      </div>
    </div>
    <div v-if="showEmpty">
      <div class="w-full flex-center">
        <img src="/static/images/empty.png" alt="" class="size-480">
      </div>
      <div class="text-center text-39 text-#999999">
        你的消息为空~
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import dayjs from 'dayjs';
import useMessageStore from '@/store/message';
import type { MessageList } from '@/api/notifymsg/types';

const messageStore = useMessageStore();

const hasdg = ref<boolean>(false);
const hasdata = ref<boolean>(false);
const hasreport = ref<boolean>(false);
const hasattention = ref<boolean>(false);

const showEmpty = ref<boolean>(true);

const dgLastTime = ref<string>('');
const dataLastTime = ref<string>('');
const reportLastTime = ref<string>('');
const attentionLastTime = ref<string>('');
const m1type = ref<string>('');
const m1name = ref<string>('');
const m2name = ref<string>('');
const m2duration = ref<number | string>();
const m2attentionname = ref<string>('');
const m3type = ref<string>('');
const m3name = ref<string>('');
const m3attentionname = ref<string>('');
const m3tag = ref<boolean>(false);
const m3name2 = ref<string>('');
const dgtag = ref<boolean>(false);
const reporttag = ref<boolean>(false);
const attentionTag = ref<boolean>(false);
const m4name = ref<string>('');

onLoad(() => {
  const m1 = toRaw(messageStore.getDg) as MessageList[];
  const m2 = toRaw(messageStore.getData) as MessageList[];
  const m3 = toRaw(messageStore.getReport) as MessageList[];
  const m4 = toRaw(messageStore.getAttention) as MessageList[];
  console.log(m1, m2, m3, m4, '消息');

  // 处理 m1 数据
  if (m1.length > 0) {
    const { description, attention_name } = m1[0];
    const isReceived = description.startsWith('收到');
    m1name.value = attention_name!;

    dgtag.value = isReceived;
    const res = isReceived ? description.split('收到')[1] : description;
    const aa = res.split('套餐');
    m1type.value = `${aa[1]}` + `${description.startsWith('A') ? '智能分析' : '医生解读'}` + '服务';
  }

  if (m2.length > 0) {
    const { pat_name, description, attention_name } = m2[0];
    m2attentionname.value = attention_name!;
    m2name.value = pat_name!;
    m2duration.value = (Number(description) / 60) > 1 ? `${Math.floor(Number(description) / 60)}分钟` : `${description}秒`;
  }

  if (m3.length > 0) {
    const { pat_name, description, attention_id, pat_acc_name, owner, attention_name } = m3[0];
    if (attention_id === uni.getStorageSync('uuid')) {
      reporttag.value = true;
    }
    else {
      reporttag.value = false;
    }
    if (owner === 'N') {
      m3attentionname.value = pat_acc_name!;
    }
    if (attention_id) {
      m3name2.value = attention_name!;
      m3tag.value = true;
    }
    else {
      m3tag.value = false;
    }
    m3name.value = pat_name!;
    m3type.value = description.includes('A') ? '智能分析' : '医生解读';
  }

  if (m4.length > 0) {
    const { description, attention_name, acc_name } = m4[0];
    const isAttention = !description.startsWith('被');
    const name = isAttention ? attention_name : acc_name;

    m4name.value = name!;
    attentionTag.value = description.includes('移除');
  }

  hasdg.value = m1.length > 0;
  hasdata.value = m2.length > 0;
  hasreport.value = m3.length > 0;
  hasattention.value = m4.length > 0;

  if (hasattention.value || hasreport.value || hasdg.value || hasdata.value) {
    showEmpty.value = false;
    dgLastTime.value = m1.length > 0 ? m1[0].create_tm : '0';
    dataLastTime.value = m2.length > 0 ? m2[0].create_tm : '0';
    reportLastTime.value = m3.length > 0 ? m3[0].create_tm : '0';
    attentionLastTime.value = m4.length > 0 ? m4[0].create_tm : '0';
  }
  else {
    showEmpty.value = true;
  }
});

// 未读的消息数
const bgMsgLength = computed(() => messageStore.getHasNotReaddg);
const dataMsgLength = computed(() => messageStore.getHasNotReaddata);
const reportMsgLength = computed(() => messageStore.getHasNotReadreport);
const attentionMsgLength = computed(() => messageStore.getHasNotReadattention);

const handleClick = (type: string) => {
  uni.navigateTo({ url: `/pages/message/detail?type=${type}` });
};
</script>

<style>
page{
  background: #fff;
}
</style>

<style scoped lang='scss'>
.container {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16rpx 0;
  height: 120rpx;
}

.tip-num {
  position: absolute;
  top: -4rpx;
  right: -4rpx;
  width: 32rpx;
  height: 32rpx;
  font-size: 20rpx;
  text-align: center;
  color: #fff;
  background: #FF3F3F;
  border-radius: 50%;
}

.icon-wrap{
  background: rgb(79 149 255 / 20%);
  border-radius: 50%;

  .icon{
    top: 50%;
    left: 50%;
    transform: translate(-50%,-55%);
  }
}

.icon-wrap-2{
  background: rgb(253 127 24 / 20%);
}

.icon-wrap-3{
  background: rgb(47 196 101 / 20%);
}

.icon-wrap-4{
  background: rgb(255 63 63 / 20%);
}

.title-1{
  height: 48rpx;
  font-weight: 400;
  font-size: 32rpx;
  color: #2F384C;
  line-height: 48rpx;
}

.title-2{
  display: flex;
  font-weight: 400;
  font-size: 24rpx;
  color: #999;
  max-width: 370rpx;
}
</style>
