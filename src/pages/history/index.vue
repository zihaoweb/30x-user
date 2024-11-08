<template>
  <u-navbar autoBack title="历史记录" placeholder border bgColor="#F2F5F9" />
  <div class="px-24">
    <div class="tabs-wrap">
      <up-tabs
        :lineHeight="2" :activeStyle="{ color: '#4F95FF', fontSize: '28rpx' }" :lineWidth="58"
        :inactiveStyle="{ color: '#999999', fontSize: '28rpx' }"
        :lineColor="`${'#4F95FF'}`"
        :current="currentIndex" :list="tablist" :scrollable="false" @click="handleClickTabs"
      />
    </div>
    <div v-if="currentIndex === 1 && allMsg.length">
      <div v-for="(v, i) in allMsg" :key="i" class="box-border">
        <div class="use-card delete m-t-24">
          <div class="m-b-16 flex-between lh-42">
            <div class="flex items-center">
              <img src="@/static/doctor/use-list-1.png" alt="" class="m-r-18 size-28">
              <div>{{ dayjs(Number(v.create_tm)).format('YYYY/MM/DD HH:mm:ss') }}</div>
            </div>
            <div v-if="v.remark.includes('除')" class="icon">
              <div class="icon-text flex-center">
                已删除
              </div>
            </div>
            <div v-if="v.remark.includes('超时')" class="icon expired">
              <div class="icon-text flex-center">
                已超时
              </div>
            </div>
            <div v-if="v.remark.includes('等待授权')" class="icon success">
              <div class="icon-text flex-center">
                已提交
              </div>
            </div>
            <div v-if="v.remark.includes('已关注')" class="icon agree">
              <div class="icon-text flex-center">
                已同意
              </div>
            </div>
            <div v-if="v.remark === '已拒绝'" class="icon refuse">
              <div class="icon-text flex-center">
                已拒绝
              </div>
            </div>
            <div v-if="v.remark === '被已拒绝'" class="icon refuse">
              <div class="icon-text flex-center">
                被拒绝
              </div>
            </div>
          </div>
          <u-line />
          <div v-if="v.remark === '等待授权'" class="box1">
            你向“<span>
              {{ v.oper_be_name }}
            </span>”<span class="text-#4F95FF">提交</span>了关注申请。
          </div>
          <div v-else-if="v.remark === '被等待授权'" class="box1">
            “<span>
              {{ v.oper_name }}
            </span>”向你<span class="text-#4F95FF">提交</span>了关注申请。
          </div>
          <div v-else-if="v.remark === '已超时'" class="box1">
            你向“<span>
              {{ v.oper_be_name }}
            </span>”提交的关注申请<span class="text-#FD7F18">已超时</span>
          </div>
          <div v-else-if="v.remark === '被已超时'" class="box1">
            “<span>
              {{ v.oper_name }}
            </span>”向你提交的关注申请<span class="text-#FD7F18">已超时</span>
          </div>
          <div v-else-if="v.remark === '已关注'" class="box1">
            你<span class="text-#2FC465">同意</span>了“<span>
              {{ v.oper_be_name }}
            </span>”的关注申请。
          </div>
          <div v-else-if="v.remark === '被已关注'" class="box1">
            “<span>
              {{ v.oper_name }}
            </span>”<span class="text-#2FC465">同意</span>了你的关注申请。
          </div>
          <div v-else-if="v.remark === '已拒绝'" class="box1">
            你<span class="text-#FF3F3F">拒绝</span>了“<span>
              {{ v.oper_be_name }}
            </span>”的关注申请。
          </div>
          <div v-else-if="v.remark === '被已拒绝'" class="box1">
            “<span>
              {{ v.oper_name }}
            </span>”<span class="text-#FF3F3F">拒绝</span>了你的关注申请。
          </div>
          <div v-else-if="v.remark === '已删除'" class="box1">
            你<span class="text-#FF3F3F">删除</span>了“<span>
              {{ v.oper_be_name }}
            </span>”。
          </div>
          <div v-else-if="v.remark === '被已删除'" class="box1">
            “<span>
              {{ v.oper_name }}
            </span>”<span class="text-#FF3F3F">删除</span>了你。
          </div>
          <div v-else-if="v.remark === '已移除'" class="box1">
            你<span class="text-#FF3F3F">移除</span>了“<span>
              {{ v.oper_be_name }}
            </span>”的关注。
          </div>
          <div v-else-if="v.remark === '被已移除'" class="box1">
            “<span>
              {{ v.oper_name }}
            </span>”<span class="text-#FF3F3F">移除</span>了你。
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="currentIndex === 2 && myApply.length">
      <div v-for="(v, i) in myApply" :key="i" class="box-border">
        <div class="use-card delete m-t-24">
          <div class="m-b-16 flex-between lh-42">
            <div class="flex items-center">
              <img src="@/static/doctor/use-list-1.png" alt="" class="m-r-18 size-28">
              <div>{{ dayjs(Number(v.create_tm)).format('YYYY/MM/DD HH:mm:ss') }}</div>
            </div>
            <div v-if="v.remark.includes('除')" class="icon">
              <div class="icon-text flex-center">
                已删除
              </div>
            </div>
            <div v-if="v.remark.includes('超时')" class="icon expired">
              <div class="icon-text flex-center">
                已超时
              </div>
            </div>
            <div v-if="v.remark.includes('等待授权')" class="icon success">
              <div class="icon-text flex-center">
                已提交
              </div>
            </div>
            <div v-if="v.remark.includes('已关注')" class="icon agree">
              <div class="icon-text flex-center">
                已同意
              </div>
            </div>
            <div v-if="v.remark === '已拒绝'" class="icon refuse">
              <div class="icon-text flex-center">
                已拒绝
              </div>
            </div>
            <div v-if="v.remark === '被已拒绝'" class="icon refuse">
              <div class="icon-text flex-center">
                被拒绝
              </div>
            </div>
          </div>
          <u-line />
          <div v-if="v.remark === '等待授权'" class="box1">
            你向“<span>
              {{ v.oper_be_name }}
            </span>”<span class="text-#4F95FF">提交</span>了关注申请。
          </div>
          <div v-else-if="v.remark === '被等待授权'" class="box1">
            “<span>
              {{ v.oper_name }}
            </span>”向你<span class="text-#4F95FF">提交</span>了关注申请。
          </div>
          <div v-else-if="v.remark === '已超时'" class="box1">
            你向“<sapn>
              {{ v.oper_be_name }}
            </sapn>”提交的关注申请<span class="text-#FD7F18">已超时</span>
          </div>
          <div v-else-if="v.remark === '被已超时'" class="box1">
            “<sapn>
              {{ v.oper_name }}
            </sapn>”向你提交的关注申请<span class="text-#FD7F18">已超时</span>
          </div>
          <div v-else-if="v.remark === '已关注'" class="box1">
            你<span class="text-#2FC465">同意</span>了“<sapn>
              {{ v.oper_be_name }}
            </sapn>”的关注申请。
          </div>
          <div v-else-if="v.remark === '被已关注'" class="box1">
            “<sapn>
              {{ v.oper_name }}
            </sapn>”<span class="text-#2FC465">同意</span>了你的关注申请。
          </div>
          <div v-else-if="v.remark === '已拒绝'" class="box1">
            你<span class="text-#FF3F3F">拒绝</span>了“<sapn>
              {{ v.oper_be_name }}
            </sapn>”的关注申请。
          </div>
          <div v-else-if="v.remark === '被已拒绝'" class="box1">
            “<sapn>
              {{ v.oper_name }}
            </sapn>”<span class="text-#FF3F3F">拒绝</span>了你的关注申请。
          </div>
          <div v-else-if="v.remark === '已删除'" class="box1">
            你<span class="text-#FF3F3F">删除</span>了“<sapn>
              {{ v.oper_be_name }}
            </sapn>”。
          </div>
          <div v-else-if="v.remark === '被已删除'" class="box1">
            “<sapn>
              {{ v.oper_name }}
            </sapn>”<span class="text-#FF3F3F">删除</span>了你。
          </div>
          <div v-else-if="v.remark === '已移除'" class="box1">
            你<span class="text-#FF3F3F">移除</span>了“<sapn>
              {{ v.oper_be_name }}
            </sapn>”的关注。
          </div>
          <div v-else-if="v.remark === '被已移除'" class="box1">
            “<sapn>
              {{ v.oper_name }}
            </sapn>”<span class="text-#FF3F3F">移除</span>了你。
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="currentIndex === 3 && followApply.length">
      <div v-for="(v, i) in followApply" :key="i" class="box-border">
        <div class="use-card delete m-t-24">
          <div class="m-b-16 flex-between lh-42">
            <div class="flex items-center">
              <img src="@/static/doctor/use-list-1.png" alt="" class="m-r-18 size-28">
              <div>{{ dayjs(Number(v.create_tm)).format('YYYY/MM/DD HH:mm:ss') }}</div>
            </div>
            <div v-if="v.remark.includes('除')" class="icon">
              <div class="icon-text flex-center">
                已删除
              </div>
            </div>
            <div v-if="v.remark.includes('超时')" class="icon expired">
              <div class="icon-text flex-center">
                已超时
              </div>
            </div>
            <div v-if="v.remark.includes('等待授权')" class="icon success">
              <div class="icon-text flex-center">
                已提交
              </div>
            </div>
            <div v-if="v.remark.includes('已关注')" class="icon agree">
              <div class="icon-text flex-center">
                已同意
              </div>
            </div>
            <div v-if="v.remark === '已拒绝'" class="icon refuse">
              <div class="icon-text flex-center">
                已拒绝
              </div>
            </div>
            <div v-if="v.remark === '被已拒绝'" class="icon refuse">
              <div class="icon-text flex-center">
                被拒绝
              </div>
            </div>
          </div>
          <u-line />
          <div v-if="v.remark === '等待授权'" class="box1">
            你向“<sapn>
              {{ v.oper_be_name }}
            </sapn>”<span class="text-#4F95FF">提交</span>了关注申请。
          </div>
          <div v-else-if="v.remark === '被等待授权'" class="box1">
            “<sapn>
              {{ v.oper_name }}
            </sapn>”向你<span class="text-#4F95FF">提交</span>了关注申请。
          </div>
          <div v-else-if="v.remark === '已超时'" class="box1">
            你向“<sapn>
              {{ v.oper_be_name }}
            </sapn>”提交的关注申请<span class="text-#FD7F18">已超时</span>
          </div>
          <div v-else-if="v.remark === '被已超时'" class="box1">
            “<sapn>
              {{ v.oper_name }}
            </sapn>”向你提交的关注申请<span class="text-#FD7F18">已超时</span>
          </div>
          <div v-else-if="v.remark === '已关注'" class="box1">
            你<span class="text-#2FC465">同意</span>了“<sapn>
              {{ v.oper_be_name }}
            </sapn>”的关注申请。
          </div>
          <div v-else-if="v.remark === '被已关注'" class="box1">
            “<sapn>
              {{ v.oper_name }}
            </sapn>”<span class="text-#2FC465">同意</span>了你的关注申请。
          </div>
          <div v-else-if="v.remark === '已拒绝'" class="box1">
            你<span class="text-#FF3F3F">拒绝</span>了“<sapn>
              {{ v.oper_be_name }}
            </sapn>”的关注申请。
          </div>
          <div v-else-if="v.remark === '被已拒绝'" class="box1">
            “<sapn>
              {{ v.oper_name }}
            </sapn>”<span class="text-#FF3F3F">拒绝</span>了你的关注申请。
          </div>
          <div v-else-if="v.remark === '已删除'" class="box1">
            你<span class="text-#FF3F3F">删除</span>了“<sapn>
              {{ v.oper_be_name }}
            </sapn>”。
          </div>
          <div v-else-if="v.remark === '被已删除'" class="box1">
            “<sapn>
              {{ v.oper_name }}
            </sapn>”<span class="text-#FF3F3F">删除</span>了你。
          </div>
          <div v-else-if="v.remark === '已移除'" class="box1">
            你<span class="text-#FF3F3F">移除</span>了“<sapn>
              {{ v.oper_be_name }}
            </sapn>”的关注。
          </div>
          <div v-else-if="v.remark === '被已移除'" class="box1">
            “<sapn>
              {{ v.oper_name }}
            </sapn>”<span class="text-#FF3F3F">移除</span>了你。
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="w-full flex-center">
        <img src="/static/images/empty.png" alt="" class="size-480">
      </div>
      <div class="text-center text-39 text-#999999">
        暂无记录
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import dayjs from 'dayjs';
import { getFollowHist } from '@/api/other';
import type { FollowHistResult } from '@/api/other/types';

const currentIndex = ref<number>(1);
const allMsg = ref<FollowHistResult[]>([]);
const myApply = ref<FollowHistResult[]>([]);
const followApply = ref<FollowHistResult[]>([]);
const tablist = ref([
  { name: '', disabled: true },
  { name: '全部记录' },
  { name: '我的关注' },
  { name: '关注我的' },
  { name: '', disabled: true },
]);
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
onShow(async () => {
  console.log('onShow');
  const acc_id = uni.getStorageSync('uuid');
  const res = await getFollowHist({ acc_id });
  console.log(res);
  allMsg.value = res;
  res.forEach((v) => {
    if (v.acc_id === acc_id) {
      myApply.value.push(v);
    }
    else {
      followApply.value.push(v);
    }
  });
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
    padding: 0 10rpx;
    height: 44rpx;
    background: rgb(255 63 63 / 10%);
    border-radius: 8rpx;

    .icon-text{
      font-size:24rpx;
      color:#FF3F3F;
    }
  }

  .expired {
    background: rgb(253 127 24 / 10%);

    .icon-text {
      color: #FD7F18;
    }
  }

  .success {
    background: rgb(79 149 255 / 10%);

    .icon-text {
      color: #4F95FF;
    }
  }

  .agree {
    background: rgb(47 196 101 / 10%);

    .icon-text {
      color: #2FC465;
    }
  }

  .refuse {
    background: rgb(255 63 63 / 10%);

    .icon-text {
      color: #FF3F3F;
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
</style>
