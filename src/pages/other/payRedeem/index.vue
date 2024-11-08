<template>
  <u-navbar leftText="" autoBack title="权益兑换" placeholder border bgColor="#F2F5F9" />
  <div class="px-24">
    <div class="scan-code-wrap relative m-t-28">
      <img class="absolute left-0 top-0 h-182 w-full -z-1" src="@/static/other/payRedeem.png" alt="">
      <img class="absolute right-24 top-10 z-1 size-162" src="@/static/other/scanIcon.png" alt="" @click="scanCode">
      <div class="scan-text">
        扫描二维码兑换权益
      </div>
      <div class="scan-btn flex items-center">
        <div @click="scanCode">
          立即扫码
        </div>
        <div class="icon flex-center" />
      </div>
    </div>
    <scroll-view scroll-y enable-flex>
      <div class="m-t-80">
        <div class="title flex">
          <div class="m-r-11">
            历史兑换记录
          </div>
          <!-- <up-icon name="info-circle" color="4F95FF" size="32" /> -->
        </div>
        <template v-if="list?.length > 0">
          <div v-for="item in list" :key="item.create_tm" class="use-card m-t-24">
            <div class="m-b-16 flex items-center lh-42">
              <img src="@/static/doctor/use-list-1.png" alt="" class="m-r-18 size-28">
              <div>{{ dayjs(Number(item.create_tm)).format('YYYY/MM/DD HH:mm:ss') }}</div>
            </div>
            <u-line />
            <div class="m-t-16 flex-between lh-42">
              <div class="left-title">
                权益类型
              </div>
              <div class="right-title">
                {{ item.quantity ? `${item.quantity}次` : `${item.expire_dt}个月` }}{{ item.type === 'ai' ? '智能解读服务' : '医生解读服务' }}
              </div>
            </div>
            <div v-if="item.due_date" class="m-t-16 flex-between lh-42">
              <div class="left-title">
                有效期至
              </div>
              <div class="right-title">
                {{ dayjs(Number(item.due_date)).format('YYYY/MM/DD') }} 23:59:59
              </div>
            </div>
            <div class="m-t-16 flex-between lh-42">
              <div class="left-title">
                权益卡
              </div>
              <div class="right-title">
                {{ item.code.slice(0, 10) }}{{ '****' }}{{ item.code.slice(-10) }}
              </div>
            </div>
          </div>
        </template>
        <div v-else>
          <div class="w-full flex-center">
            <img src="/static/images/empty.png" alt="" class="size-480">
          </div>
          <div class="text-center text-39 text-#999999">
            您的兑换记录为空
          </div>
        </div>
      </div>
    </scroll-view>
  </div>

  <z-model :show="invaildCode" :isShowCancel="false" confirmText="重新扫码" title="异常" icon="error-circle-fill" iconColor="#FD7F18" @close="() => { invaildCode = false }" @confirm="handleValidCode">
    <template #default>
      <div class="m-b-82 m-t-24 flex-center text-28 text-#666666">
        无效二维码
      </div>
    </template>
  </z-model>
  <z-model :show="expiredCode" confirmText="我知道了" title="异常" icon="error-circle-fill" iconColor="#FD7F18" :isShowCancel="false" @close="() => { expiredCode = false }" @confirm="handleExpiredCode">
    <template #default>
      <div class="m-b-82 m-t-24 flex-center text-28 text-#666666">
        权益已被领取
      </div>
    </template>
  </z-model>
  <z-model :show="successCode" title="权益兑换成功!" confirmText="好的" icon="checkmark-circle-fill" iconColor="#2FC465" :isShowCancel="false" @close="scancodeConfirm" @confirm="scancodeConfirm">
    <template #default>
      <div class="success-box m-b-69 m-t-39 box-border px-24 py-16">
        <div class="flex-center justify-between">
          <div class="text-28 text-#666666">
            权益详情
          </div>
          <div class="text-28 text-#2F384C">
            {{ scanResult.type === 'ai' ? `${scanResult.expire_dt}个月` : `${scanResult.quantity}次` }}{{ scanResult.type === 'ai' ? '智能解读服务' : '医生解读服务' }}
          </div>
        </div>
        <div v-if="scanResult.due_date" class="m-t-16 flex-center justify-between">
          <div class="text-28 text-#666666">
            有效期至
          </div>
          <div class="text-28 text-#2F384C">
            {{ dayjs(Number(scanResult.due_date)).format('YYYY/MM/DD') }} 23:59:59
          </div>
        </div>
      </div>
    </template>
  </z-model>
</template>

<script setup lang='ts'>
import dayjs from 'dayjs';
import { getPayRedeemAll } from '@/api/order';
import { ruleRedeem, scanQRCode } from '@/api/service/doctor';
import type { RuleRedeemParams } from '@/api/service/doctor/types';
import type { PayRedeemResultAll } from '@/api/order/types';

interface RuleRedeem {
  code: string;
  due_date: number;
  expire_dt: number;
  quantity: number;
  type: string;
}

const invaildCode = ref<boolean>(false);
const expiredCode = ref<boolean>(false);
const successCode = ref<boolean>(false);
const pageNo = ref<number>(1);
const pageSize = ref<number>(10);
const list = ref<PayRedeemResultAll[]>([]);
const scanResult = reactive<RuleRedeem>({
  code: '',
  due_date: 0,
  expire_dt: 0,
  quantity: 0,
  type: '',
});

const init = async () => {
  const res = await getPayRedeemAll({
    accid: uni.getStorageSync('uuid'),
    pageno: pageNo.value,
    pagecnt: pageSize.value,
  });
  if (res.length < pageSize.value) {
    uni.showToast({
      title: '没有更多数据了',
      icon: 'none',
      duration: 2000,
    });
  }
  else {
    list.value = res;
    console.log('res', res);
  }
};

onMounted(async () => {
  const res = await getPayRedeemAll({
    accid: uni.getStorageSync('uuid'),
    pageno: pageNo.value,
    pagecnt: pageSize.value,
  });
  list.value = res;
});

onReachBottom(async () => {
  pageNo.value += 1;
  await init();
});

const scancodeConfirm = async () => {
  successCode.value = false;
  const res = await getPayRedeemAll({
    accid: uni.getStorageSync('uuid'),
    pageno: pageNo.value,
    pagecnt: pageSize.value,
  });
  list.value = res;
};

const scanCode = () => {
  uni.scanCode({
    onlyFromCamera: false, // 设置false,可以从相册中选择,也可以相机扫描
    scanType: ['qrCode'], // 类型扫描二维码
    success: async (res) => {
      const scanAns = await scanQRCode({ code: res.result });
      console.log('扫码结果', scanAns);
      if (scanAns.valid === 'Y') {
        const data: RuleRedeemParams = {
          payer: uni.getStorageSync('uuid'),
          code: res.result,
          description: '扫码权益兑换',
          openid: uni.getStorageSync('openid'),
        };
        const ans = await ruleRedeem(data);
        console.log('兑换结果', ans);
        if (ans.code === 'OK') {
          console.log('兑换成功', ans);
          scanResult.due_date = ans.due_date;
          scanResult.expire_dt = ans.expire_dt;
          scanResult.quantity = ans.quantity;
          scanResult.type = ans.type;
          successCode.value = true;
        }
        else if (ans.code === 'NG') {
          if (ans.msg === '权益已被领取') {
            console.log('权益已被领取');
            expiredCode.value = true;
          }
          else if (ans.msg === '无效兑换码') {
            console.log('无效兑换码');
          }
          else {
            console.log('兑换失败');
          }
        }
        else {
          console.log('兑换失败');
        }
      }
      else {
        invaildCode.value = true;
      }
    },
  });
};

const handleValidCode = () => {
  console.log('重新扫码');
  invaildCode.value = false;
  scanCode();
};
const handleExpiredCode = () => {
  console.log('我知道了');
  expiredCode.value = false;
};
</script>

<style scoped lang='scss'>
.scan-code-wrap{
  overflow: hidden;
  padding: 24rpx;
  width: 100%;
  height: 182rpx;
  background: #E4F5FF;
  border-radius: 16rpx;
  box-sizing: border-box;

  .scan-text{
    z-index: 10;
    height: 54rpx;
    font-size: 36rpx;
    color: #2F384C;
    font-weight: 400;
    line-height: 54rpx;
  }

  .scan-btn{
    padding: 16rpx 18rpx 16rpx 16rpx;
    margin-top: 16rpx;
    width: 204rpx;
    height: 64rpx;
    font-size: 32rpx;
    color: #fff;
    background: #4F95FF;
    border-radius: 8rpx;
    box-sizing: border-box;

    .icon{
      margin-left: 8rpx;
      width: 32rpx;
      height: 32rpx;
      background-color: #fff;
      border-radius: 50%;

      &::after{
        content: '\2192';
        color: #4F95FF;
      }
    }
  }
}

.title{
  height: 36rpx;
  font-weight: 400;
  font-size: 28rpx;
  color: #2F384C;
  line-height: 36rpx;
}

.use-card {
  padding: 24rpx;
  width: 100%;
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

.success-box{
  width: 100%;
  background: #F2F5F9;
  border-radius: 8rpx;
}
</style>
