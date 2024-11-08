<template>
  <u-navbar autoBack title="添加成员" placeholder border />
  <div class="box-border px-24">
    <div class="tips-wrap m-t-24">
      为保证分析的准确性，请如实填写成员信息。
    </div>
    <div class="m-t-24">
      <z-input :height="112" leftColor="#666" title="头像" icon="arrow-right" :isAvatar="true">
        <button
          class="avatar-wrapper flex-row-reverse"
          open-type="chooseAvatar"
          @chooseavatar="onChooseAvatar"
        >
          <u-avatar :src="avatarUrlValue" />
        </button>
      </z-input>
      <z-input v-model:value="relationship" :height="96" :disabled="true" leftColor="#666" title="标签" icon="arrow-right" placeholder="请选择..." @click="handleTagClick" />
    </div>
    <div class="m-b-16 m-t-36 text-36 text-#2F384C">
      基本信息
    </div>
    <div>
      <z-input :titleSize="32" :dot="true" :height="96" :maxlength="16" placeholder="请填写..." leftColor="#666" title="姓名" @change="handleNameChange" />
      <z-input
        v-model:value="sex" :titleSize="32"
        :dot="true" :height="96" placeholder="请选择..." :disabled="true" leftColor="#666" title="性别" @click="handleSexClick"
      />
      <z-input
        v-model:value="birthString" :titleSize="32"
        :dot="true" :height="96" placeholder="请选择..." :disabled="true" leftColor="#666" title="出生日期" @click="handleDateClick"
      />
      <z-input :titleSize="32" :height="96" type="number" :maxlength="11" placeholder="请填写..." leftColor="#666" title="手机号" @change="handlePhoneChange" />
    </div>
    <div class="m-b-16 m-t-36 text-36 text-#2F384C">
      快捷设置
    </div>
    <div class="auto-wrap h-80 flex items-center">
      <div class="m-l-24 text-32 text-#666666">
        数据上传后自动申请医生报告
      </div>
      <div class="switch-wrap">
        <up-switch v-model="autoApplyForDoc" activeColor="#4F95FF" inactiveColor="#DCDCDC" />
      </div>
    </div>
    <div class="auto-wrap h-96 flex items-center">
      <div class="m-l-24 text-32 text-#666666">
        数据上传后自动申请智能报告
      </div>
      <div class="switch-wrap">
        <up-switch v-model="autoApplyForAi" activeColor="#4F95FF" inactiveColor="#DCDCDC" />
      </div>
    </div>
    <div class="m-b-16 m-t-36 text-36 text-#2F384C">
      紧急联系人
    </div>
    <div>
      <z-input :titleSize="32" :height="96" placeholder="请填写..." leftColor="#666" title="姓名" @blur="handleENameChange" />
      <z-input
        :titleSize="32" :height="96" type="number" placeholder="请填写..."
        leftColor="#666" title="联系电话" @blur="handleEPhoneChange"
      />
      <z-input
        v-model:value="formData.contact_rela" :titleSize="32" :height="96" placeholder="请选择..."
        :disabled="true" leftColor="#666" title="关系" @click="handleERelationClick"
      />
    </div>
    <div class="confirm-btn m-t-40 flex-center text-white" @click="handleConfirmClick">
      保存
    </div>
    <div class="emptyEle" />
  </div>

  <z-model
    :show="autoApplyForAiModel" confirmText="去购买" cancel-text="我知道了" title="自动申请智能解读服务失败"
    icon="close-circle-fill" iconColor="#FF3F3F"
    @confirm="goBuyAi" @close="() => { autoApplyForAiModel = false }" @cancel="() => { autoApplyForAiModel = false }"
  >
    <template #default>
      <div v-if="aiExpiredTag" class="m-b-40 m-t-24 text-center text-28 text-#666666">
        您购买的智能解读服务已过期!
      </div>
      <div v-else class="m-b-40 m-t-24 text-center text-28 text-#666666">
        您尚未购买智能解读服务!
      </div>
    </template>
  </z-model>

  <z-model
    :show="autoApplyForDocModel" confirmText="去购买" cancel-text="我知道了" title="自动申请医生解读服务失败"
    icon="close-circle-fill" iconColor="#FF3F3F"
    @confirm="goBuyDoc" @close="() => { autoApplyForDocModel = false }" @cancel="() => { autoApplyForDocModel = false }"
  >
    <template #default>
      <div class="m-b-40 m-t-24 text-center text-28 text-#666666">
        您尚未购买医生解读服务!
      </div>
    </template>
  </z-model>
  <up-picker :show="genderPickerShow" :columns="columns" @confirm="genderConfirm" @cancel="genderCancel" />
  <up-picker :show="e_relationPickerShow" :columns="emergency_rela" @confirm="e_relationConfirm" @cancel="e_relationCancel" />
  <up-picker :show="tagPickerShow" :columns="contact_rela" @confirm="tagConfirm" @cancel="tagCancel" />
  <up-datetime-picker
    v-model="curDate"
    :show="birthdayPickerShow"
    mode="date"
    :minDate="minDate"
    :maxDate="maxDate"
    @confirm="birthdayConfirm"
    @cancel="birthdayCancel"
  />
</template>

<script setup lang='ts'>
import dayjs from 'dayjs';
import { checkRelaship, validForm } from './helper';
import { addMember } from '@/api/user';
import useServiceStore from '@/store/service';

const serviceStore = useServiceStore();

interface IFormData {
  [key: string]: string | number | boolean | null;
}

const formData = reactive<IFormData>({
  name: null,
  gender: 2,
  birth: null,
  mobile: null,
  relationship: null,
  auto_aireport: null,
  auto_docreport: null,
  contact_name: null,
  contact_mobile: null,
  contact_rela: null,
  avatarUrl: null,
});
const curDate = ref(dayjs().valueOf());
const maxDate = ref(dayjs().valueOf());
const minDate = ref(dayjs().subtract(100, 'year').month(0).date(1).valueOf());
const sex = ref<string>('');
const birthString = ref<string>('');
const relationship = ref<string>('');
const genderPickerShow = ref(false);
const autoApplyForAiModel = ref(false);
const autoApplyForDocModel = ref(false);
const e_relationPickerShow = ref(false);
const aiExpiredTag = ref<boolean>(false); // 自动申请智能解读服务过期
const tagPickerShow = ref(false);
const birthdayPickerShow = ref(false);
const avatarUrlValue = ref<string>('');
const columns = reactive([
  ['男', '女'],
]);
const contact_rela = reactive([
  ['本人', '父亲', '母亲', '其他'],
]);
const emergency_rela = reactive([
  ['父母', '子女', '朋友', '其他'],
]);
const autoApplyForAi = ref<boolean>(false);
const autoApplyForDoc = ref<boolean>(false);

watch(autoApplyForAi, () => {
  const aiTime = serviceStore.getAi;
  console.log('aiTime', aiTime);
  if (dayjs().isAfter(dayjs(aiTime))) {
    autoApplyForAi.value = false;
    aiExpiredTag.value = true;
    autoApplyForAiModel.value = true;
  }
  else if (!aiTime) {
    autoApplyForAi.value = false;
    aiExpiredTag.value = false;
    autoApplyForAiModel.value = true;
  }
});

watch(autoApplyForDoc, () => {
  console.log('autoApplyForDoc', autoApplyForDoc);
  const docTime = serviceStore.getDoc;
  if (docTime <= 0) {
    autoApplyForDoc.value = false;
    autoApplyForDocModel.value = true;
  }
});

const goBuyAi = () => {
  autoApplyForAiModel.value = false;
  console.log('去购买');
  uni.navigateTo({ url: '/pages/service/ai/index' });
};

const goBuyDoc = () => {
  autoApplyForDocModel.value = false;
  console.log('去购买');
  uni.navigateTo({ url: '/pages/service/doctor/index' });
};

const onChooseAvatar = (e: any) => {
  const url = e.detail.avatarUrl;
  avatarUrlValue.value = url;
  uni.compressImage({
    src: url,
    quality: 50,
    success: (res) => {
      uni.getFileSystemManager().readFile({
        filePath: res.tempFilePath,
        encoding: 'base64',
        success: (res) => {
          formData.avatarUrl = `data:image/jpeg;base64,${res.data}`;
        },
        fail: () => {},
      });
    },
  });
};
const handleNameChange = (name: string) => {
  console.log('点击了姓名', name);
  formData.name = name;
};
const handleSexClick = () => {
  console.log('点击了性别');
  genderPickerShow.value = true;
};
const handleDateClick = () => {
  console.log('点击了日期');
  birthdayPickerShow.value = true;
};
const handlePhoneChange = (mobile: string) => {
  console.log('点击了手机号', mobile);
  formData.mobile = mobile;
};
const genderConfirm = ({ value }: { value: string[] }) => {
  sex.value = value[0];
  genderPickerShow.value = false;
};
const e_relationConfirm = ({ value }: { value: string[] }) => {
  formData.contact_rela = value[0];
  e_relationPickerShow.value = false;
};
const tagConfirm = ({ value }: { value: string[] }) => {
  const res = checkRelaship(value[0], '');
  if (res) {
    relationship.value = value[0];
    tagPickerShow.value = false;
  }
};
const tagCancel = () => {
  tagPickerShow.value = false;
};
const e_relationCancel = () => {
  e_relationPickerShow.value = false;
};
const genderCancel = () => {
  genderPickerShow.value = false;
};
const birthdayConfirm = ({ value }: { value: string }) => {
  console.log('点击了日期', value);
  formData.birth = `${value}`;
  const formattedValue = dayjs(value).format('YYYY-MM-DD');
  birthString.value = formattedValue;
  birthdayPickerShow.value = false;
};
const birthdayCancel = () => {
  birthdayPickerShow.value = false;
};

const handleENameChange = (name: string) => {
  console.log('点击了紧急联系人姓名', name);
  formData.contact_name = name;
};
const handleEPhoneChange = (mobile: string) => {
  console.log('点击了紧急联系人手机号', mobile);
  formData.contact_mobile = mobile;
};
const handleERelationClick = () => {
  e_relationPickerShow.value = true;
};
const handleTagClick = () => {
  tagPickerShow.value = true;
};

// submit
const handleConfirmClick = async () => {
  uni.showLoading({ title: '保存中', mask: true });
  if (sex.value) {
    formData.gender = sex.value === '男' ? 0 : 1;
  }
  if (relationship.value) {
    formData.relationship = relationship.value;
  }
  if (autoApplyForAi.value) {
    formData.auto_aireport = 'Y';
  }
  if (autoApplyForDoc.value) {
    formData.auto_docreport = 'Y';
  }
  if (!validForm(formData))
    return;
  if (avatarUrlValue.value.startsWith('/static')) {
    formData.avatar = null;
  }
  else {
    formData.avatar = avatarUrlValue.value;
  }
  formData.belongto = uni.getStorageSync('uuid');
  const ans = await addMember(formData);
  console.log('保存结果', ans);
  uni.hideLoading();
  if (ans.code === 'NG') {
    uni.showToast({ title: ans.message, icon: 'none' });
  }
  else {
    uni.showToast({ title: '保存成功', icon: 'success' });
    uni.navigateBack();
  }
};
</script>

<style>
page{
  background: #fff;
}

button{
  background: none;
}
</style>

<style scoped lang='scss'>
button::after {
  border: none;
}

.emptyEle{
  width: 100%;
  height: 108rpx;
}

.confirm-btn{
  width: 100%;
  height: 80rpx;
  background: #4F95FF;
  border-radius: 16rpx;
}

.auto-wrap{
  border-bottom: 1px solid #DCDCDC;
}

.tips-wrap{
  padding: 16rpx;
  width: 100%;
  height: 68rpx;
  font-size: 24rpx;
  color: #4F95FF;
  background: rgb(79 149 255 / 10%);
  border-radius: 16rpx;
  box-sizing: border-box;
  font-weight: 400;
}

.avatar-wrapper{
  display: flex;
  align-items: center;
  margin-left: auto;
  background: none;
  border: none;
  flex: 1;
  flex-direction: row-reverse;
}

.switch-wrap{
  margin-left: auto;
}
</style>
