<template>
  <div class="z-input w-full flex items-center" :style="{ height: `${props.height}rpx` }">
    <div class="h-full w-150 flex items-center p-l-20" :style="{ color: `${props.leftColor}`, fontSize: `${props.titleSize}rpx` }">
      <span v-if="dot" class="text-red">*</span>{{ props.title }}
    </div>
    <div class="h-full flex flex-1 items-center gap-10">
      <slot />
      <input
        v-if="!isAvatar" :type="props.type" :value="value" class="h-full flex-1"
        :maxlength="props.maxlength"
        :placeholder="$props.placeholder" :disabled="$props.disabled" @click="emit('click')"
        @change="emit('change', $event.detail.value)" @blur="emit('blur', $event.detail.value)"
      >
      <u-icon :name="$props.icon" />
    </div>
  </div>
</template>

<script setup lang='ts'>
interface IProps {
  title?: string;
  placeholder?: string;
  icon?: string;
  height?: number;
  disabled?: boolean;
  isAvatar?: boolean;
  leftColor?: string;
  titleSize?: number;
  dot?: boolean;
  type?: 'text' | 'password' | 'number' | 'nickname';
  maxlength?: number;
}

const props = withDefaults(defineProps<IProps>(), {
  title: '',
  placeholder: '',
  icon: 'arrow-right',
  height: 80,
  disabled: false,
  isAvatar: false,
  leftColor: '#000',
  titleSize: 32,
  dot: false,
  type: 'text',
  maxlength: 300,
});

const emit = defineEmits(['click', 'change', 'blur']);

const value = defineModel('value');
</script>

<style>
.z-input {
  border-bottom: 1px solid #DCDCDC;
  text-align: right;
}
</style>
