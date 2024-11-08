<template>
  <u-navbar leftText="" autoBack title="月度统计" placeholder border bgColor="#F2F5F9" />
  <div class="box-border px-24">
    <div class="flex items-center">
      <div class="fe-btn m-l-49 m-r-24" @click="handlePreMonth">
        上个月
      </div>
      <div class="current-month relative m-r-24 flex items-center text-white" @click="chooseMonth">
        <span class="m-l-32">{{ currentDate }}</span>
      </div>
      <div class="fe-btn" @click="handleNextMonth">
        下个月
      </div>
    </div>
    <div class="m-t-24 h-124 flex-between gap-16">
      <div class="box-wrap">
        <div class="text-32 text-#2F384C font-700 lh-48">
          {{ coll }}
        </div>
        <div class="m-t-8 text-24 text-#999999 lh-36">
          本月采集数据/份
        </div>
        <div class="absolute right-8 top-0 h-124 w-186">
          <img src="/static/images/month-2.png" alt="" class="wh-full">
        </div>
      </div>
      <div class="box-wrap">
        <div class="text-32 text-#2F384C font-700 lh-48">
          {{ report }}
        </div>
        <div class="m-t-8 text-24 text-#999999 lh-36">
          本月获得报告/份
        </div>
        <div class="absolute right-8 top-0 h-124 w-186">
          <img src="/static/images/month-1.png" alt="" class="wh-full">
        </div>
      </div>
    </div>
    <div class="main-wrap">
      <div class="title">
        采集时长占比
      </div>
      <div v-if="isShowPie">
        <div class="grid-wrap">
          <div class="grid-item">
            <div class="text-36 text-#4F95FF lh-42">
              {{ report2percent }}%
            </div>
            <div class="m-t-6 text-28 text-#2F384C">
              小于2小时
            </div>
          </div>
          <div class="grid-item" style="border-color: #2FC465;">
            <div class="text-36 text-#2FC465 lh-42">
              {{ report4percent }}%
            </div>
            <div class="m-t-6 text-28 text-#2F384C">
              2-6小时
            </div>
          </div>
          <div class="grid-item" style="border-color: #FF3F3F;">
            <div class="text-36 text-#FF3F3F lh-42">
              {{ report6percent }}%
            </div>
            <div class="m-t-6 text-28 text-#2F384C">
              6-10小时
            </div>
          </div>
          <div class="grid-item" style="border-color: #FD7F18;">
            <div class="text-36 text-#FD7F18 lh-42">
              {{ report10percent }}%
            </div>
            <div class="m-t-6 text-28 text-#2F384C">
              大于10小时
            </div>
          </div>
        </div>
        <view class="charts-box">
          <qiun-data-charts
            type="pie"
            :opts="opts"
            :chartData="chartData"
            :canvas2d="true"
            canvasId="hatCYXKiywYtnfRCuOkxSzmEbNMCsvQs"
          />
        </view>
      </div>
      <div v-else>
        <div class="w-full flex-center">
          <img src="/static/images/empty.png" alt="" class="size-480">
        </div>
        <div class="text-center text-39 text-#999999">
          您本月的数据为空~
        </div>
      </div>
    </div>
    <up-datetime-picker
      v-model="currentDate"
      :show="chooseMonthPicker"
      mode="year-month"
      :minDate="minDate"
      :maxDate="maxDate"
      @confirm="chooseMonthConfirm"
      @cancel="() => { chooseMonthPicker = false }"
    />
  </div>
</template>

<script setup lang='ts'>
import dayjs from 'dayjs';
import { getPieData } from '@/api/other';

// 最小时间是5年前的数据
const minDate = dayjs().subtract(5, 'year').month(0).date(1).valueOf();
const maxDate = dayjs().valueOf();

const currentDate = ref<string>(dayjs().format('YYYY/MM'));
const chartData = ref({});
const isShowPie = ref<boolean>(true);
const chooseMonthPicker = ref<boolean>(false);

const coll = ref<number>(0);
const report = ref<number>(0);
const report2 = ref<number>(0);
const report4 = ref<number>(0);
const report6 = ref<number>(0);
const report10 = ref<number>(0);
const report2percent = ref<number>(0);
const report4percent = ref<number>(0);
const report6percent = ref<number>(0);
const report10percent = ref<number>(0);

const opts = {
  color: ['#4F95FF', '#2FC465', '#FF3F3F', '#FD7F18'],
  padding: [5, 5, 5, 5],
  enableScroll: false,
  legend: {
    show: false,
  },
  categories: {
    legendText: false,
  },
  extra: {
    pie: {
      activeOpacity: 0.5,
      activeRadius: 10,
      offsetAngle: 0,
      labelWidth: 15,
      border: true,
      borderWidth: 3,
      borderColor: '#FFFFFF',
    },
  },
};

const init = async (month: number, year: number) => {
  const res = await getPieData({
    acc_id: uni.getStorageSync('uuid'),
    month,
    year,
  });
  console.log(res);
  coll.value = res[0].val;
  report.value = res[1].val;
  if (coll.value === 0) {
    isShowPie.value = false;
    return;
  }
  else {
    isShowPie.value = true;
  };
  report2.value = res[2].val;
  report4.value = res[3].val;
  report6.value = res[4].val;
  report10.value = res[5].val;
  report2percent.value = report2.value === 0 ? 0 : Math.floor(report2.value / coll.value * 100);
  report4percent.value = report4.value === 0 ? 0 : Math.floor(report4.value / coll.value * 100);
  report6percent.value = report6.value === 0 ? 0 : Math.floor(report6.value / coll.value * 100);
  report10percent.value = report10.value === 0 ? 0 : Math.floor(report10.value / coll.value * 100);
  setTimeout(() => {
    const res = {
      series: [
        {
          data: [{ name: '大于2小时', value: report2.value }, { name: '大于4小时', value: report4.value }, { name: '大于6小时', value: report6.value }, { name: '大于10小时', value: report10.value }],
        },
      ],
    };
    chartData.value = JSON.parse(JSON.stringify(res));
  }, 300);
};

const chooseMonthConfirm = async (date: any) => {
  chooseMonthPicker.value = false;
  currentDate.value = dayjs(date.value).format('YYYY/MM');
  const res = currentDate.value.split('/');
  await init(Number(res[1]), Number(res[0]));
};

onShow(async () => {
  // 模拟从服务器获取数据时的延时
  await init(dayjs().month() + 1, dayjs().year());
});

const handlePreMonth = async () => {
  currentDate.value = dayjs(currentDate.value).subtract(1, 'month').format('YYYY/MM');
  const res = currentDate.value.split('/');
  await init(Number(res[1]), Number(res[0]));
};

const chooseMonth = () => {
  chooseMonthPicker.value = true;
};

const handleNextMonth = async () => {
  if (currentDate.value === dayjs().format('YYYY/MM'))
    return;
  currentDate.value = dayjs(currentDate.value).add(1, 'month').format('YYYY/MM');
  const res = currentDate.value.split('/');
  await init(Number(res[1]), Number(res[0]));
};
</script>

<style scoped lang='scss'>
.grid-wrap{
  display: grid;
  margin-top: 24rpx;
  margin-bottom: 24rpx;
  width: 100%; /* 容器宽度 */
  grid-template-columns: 1fr 1fr; /* 两列 */
  grid-template-rows: 1fr 1fr; /* 两行 */
  gap: 10rpx; /* 调整间距 */
  .grid-item{
    padding: 16rpx 36rpx;
    height: 114rpx;
    background: #F2F5F9;
    border-radius: 8rpx;
    border-left: 4rpx solid #4F95FF;
    box-sizing: border-box;
  }
}

.main-wrap{
  padding:24rpx;
  margin-top: 24rpx;
  height: 764rpx;
  background: #FFF;
  border-radius: 16rpx;
  box-sizing: border-box;

  .title{
    font-weight: 400;
    font-size: 36rpx;
    color: #2F384C;
    line-height: 54rpx;
  }
}

.box-wrap{
  position: relative;
  padding: 16rpx 24rpx;
  width: 343rpx;
  height: 124rpx;
  background: #FFF;
  border-radius: 16rpx;
  box-sizing: border-box;
}

.current-month{
  width: 236rpx;
  height: 64rpx;
  background: #4F95FF;
  border-radius: 50rpx;
}

.current-month::after {
  position: absolute;
  top: 28rpx;
  right: 38rpx;
  display: block;
  width: 0;
  height: 0;
  border:10rpx solid;
  border-color: #FFF transparent transparent;
  content: '';
}

.fe-btn{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 160rpx;
  height: 64rpx;
  font-size: 28rpx;
  color: #4F95FF;
  border: 1rpx solid #4F95FF;
  border-radius: 50rpx;
}

.charts-box {
  width: 100%;
  height: 200px;
}
</style>
