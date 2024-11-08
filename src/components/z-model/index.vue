<template>
  <up-popup
    :show="props.show" mode="center" :round="8" :safeAreaInsetBottom="false"
  >
    <div class="popop-wrap relative box-border p-40">
      <div class="absolute right-15 top-15 size-36" @click="handleClose">
        <up-icon name="close" :size="18" />
      </div>
      <div class="m-t-24 flex justify-center gap-10 text-36 text-#2F384C">
        <up-icon :name="props.icon" :color="props.iconColor" :size="props.iconSize" />
        {{ props.title }}
      </div>
      <slot />
      <div class="flex gap-16">
        <div
          v-if="props.isShowCancel" class="cancel-btn flex-center text-#4F95FF"
          :style="{ color: props.cancelBtnColor, borderColor: props.cancelBtnColor }" @click="handleCancel"
        >
          {{ props.cancelText }}
        </div>
        <div v-if="props.isShowConfirm" class="confirm-btn flex-center text-white" @click="handleConfirm">
          {{ props.confirmText }}
        </div>
      </div>
      <!-- <div class="text#999999 h-52 bg-#F2F5F9 text-center text-24">
        加急：工作时间申请后预计1小时内出报告
      </div> -->
    </div>
  </up-popup>
</template>

<script setup lang='ts'>
interface IProps {
  show?: boolean;
  title?: string;
  disabled?: boolean;
  cancelText?: string;
  confirmText?: string;
  icon?: string;
  iconColor?: string;
  iconSize?: number;
  isShowCancel?: boolean;
  cancelBtnColor?: string;
  isShowConfirm?: boolean;
}
const props = withDefaults(defineProps<IProps>(), {
  show: false,
  title: '',
  cancelText: '取消',
  confirmText: '确定',
  icon: '',
  iconColor: '',
  iconSize: 18,
  isShowCancel: true,
  cancelBtnColor: '#4F95FF',
  isShowConfirm: true,
});
const emit = defineEmits(['cancel', 'confirm', 'close']);

const handleCancel = () => {
  emit('cancel');
};
const handleConfirm = () => {
  emit('confirm');
};
const handleClose = () => {
  emit('close');
};
</script>

<style scoped lang='scss'>
.popop-wrap{
  width: calc(100vw - 110rpx);
}
.cancel-btn{
  height: 80rpx;
  border-radius: 16rpx 16rpx 16rpx 16rpx;
  border: 2rpx solid #4F95FF;
  flex:1;
}
.confirm-btn{
  height: 80rpx;
  background: #4F95FF;
  border-radius: 16rpx 16rpx 16rpx 16rpx;
  flex: 1;
}
</style>
