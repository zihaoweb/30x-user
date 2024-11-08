<template>
  <div>
    <up-popup :show="props.show" :round="10" mode="bottom">
      <div class="p-30">
        <div class="header flex items-center justify-between">
          <span>{{ props.title }}</span>
          <up-icon name="close" @click="close" />
        </div>
        <slot />
        <div class="flex gap-16" :style="{ marginTop: `${props.mt}rpx` }">
          <div
            v-if="props.isShowCancel" class="cancel-btn flex-center text-#4F95FF"
            :style="{ color: props.cancelBtnColor, borderColor: props.cancelBtnColor }" @click="handleCancel"
          >
            {{ props.cancelText }}
          </div>
          <div class="confirm-btn flex-center text-white" @click="handleConfirm">
            {{ props.confirmText }}
          </div>
        </div>
      </div>
    </up-popup>
  </div>
</template>

<script setup lang='ts'>
interface IProps {
  title?: string;
  show?: boolean;
  cancel?: () => void;
  confirm?: () => void;
  close?: () => void;
  round?: number;
  mode?: string;
  cancelText?: string;
  confirmText?: string;
  isShowCancel?: boolean;
  cancelBtnColor?: string;
  mt?: number;
}

const props = withDefaults(defineProps<IProps>(), {
  title: '',
  show: false,
  cancel: () => {},
  confirm: () => {},
  close: () => {},
  round: 0,
  mode: 'bottom',
  cancelText: '取消',
  confirmText: '确定',
  isShowCancel: true,
  cancelBtnColor: '#4F95FF',
  mt: 0,
});

const emit = defineEmits(['cancel', 'confirm', 'close']);

const handleCancel = () => {
  emit('cancel', false);
};

const handleConfirm = () => {
  emit('confirm', true);
};

const close = () => {
  emit('close');
};
</script>

<style scoped lang='scss'>
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
