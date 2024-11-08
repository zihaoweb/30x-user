<template>
  <u-navbar autoBack title="成员详情" placeholder border />
  <div class="box-border px-24">
    <div class="tips-wrap m-t-24">
      为保证分析的准确性，请如实填写成员信息。
    </div>
    <div class="m-t-24">
      <z-input :height="112" leftColor="#666" title="头像" icon="arrow-right" :isAvatar="true">
        <button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="chooseAvatar">
          <u-avatar :src="avatar" />
        </button>
      </z-input>
      <z-input v-model:value="relationship" :height="96" :disabled="true" leftColor="#666" title="标签" icon="arrow-right" placeholder="请选择..." @click="handleTagClick" />
    </div>
    <div class="m-b-16 m-t-36 text-36 text-#2F384C">
      基本信息
    </div>
    <div>
      <z-input v-model:value="formData.name" :titleSize="32" :dot="true" :height="96" placeholder="请填写..." leftColor="#666" title="姓名" @blur="handleNameChange" />
      <z-input
        v-model:value="sex" :titleSize="32"
        :dot="true" :height="96" placeholder="请选择..." :disabled="true" leftColor="#666" title="性别" @click="handleSexClick"
      />
      <z-input
        v-model:value="birthString" :titleSize="32"
        :dot="true" :height="96" placeholder="请选择..." :disabled="true" leftColor="#666" title="出生日期" @click="handleDateClick"
      />
      <z-input v-model:value="formData.mobile" :titleSize="32" :height="96" type="number" placeholder="请填写..." leftColor="#666" title="手机号" @blur="handlePhoneChange" />
    </div>
    <div class="m-b-16 m-t-36 text-36 text-#2F384C">
      快捷设置
    </div>
    <div class="auto-wrap h-80 flex items-center">
      <div class="m-l-24 text-32 text-#666666">
        数据上传后自动申请医生报告
      </div>
      <div class="switch-wrap">
        <up-switch v-model="autoApplyForDoc" :activeColor="`${'#4F95FF'}`" :inactiveColor="`${'#DCDCDC'}`" />
      </div>
    </div>
    <div class="auto-wrap h-96 flex items-center">
      <div class="m-l-24 text-32 text-#666666">
        数据上传后自动申请智能报告
      </div>
      <div class="switch-wrap">
        <up-switch v-model="autoApplyForAi" :activeColor="`${'#4F95FF'}`" :inactiveColor="`${'#DCDCDC'}`" />
      </div>
    </div>
    <div class="m-b-16 m-t-36 text-36 text-#2F384C">
      紧急联系人
    </div>
    <div>
      <z-input v-model:value="formData.contact_name" :titleSize="32" :height="96" placeholder="请填写..." leftColor="#666" title="姓名" @blur="handleENameChange" />
      <z-input
        v-model:value="formData.contact_mobile"
        :titleSize="32" :height="96" type="number" placeholder="请填写..."
        leftColor="#666" title="联系电话" @blur="handleEPhoneChange"
      />
      <z-input
        v-model:value="formData.contact_rela" :titleSize="32" :height="96" placeholder="请选择..."
        :disabled="true" leftColor="#666" title="关系" @click="handleERelationClick"
      />
    </div>
    <div class="m-t-40 flex gap-16">
      <div class="del-btn flex-center text-#FF3F3F" @click="handleDelClick">
        删除
      </div>
      <div class="confirm-btn flex-center text-white" @click="handleConfirmClick">
        保存
      </div>
    </div>

    <div class="emptyEle" />
  </div>

  <z-model
    :show="deleteConfirmModel" confirmText="我在想想" cancelText="确认删除" cancelBtnColor="#FF3F3F" title="成员删除" icon="error-circle-fill" iconColor="#FD7F18"
    @confirm="() => { deleteConfirmModel = false }" @cancel="deleteMemberCancel" @close="() => { deleteConfirmModel = false }"
  >
    <template #default>
      <div class="m-b-40 m-t-24 text-26">
        <span class="text-#FF3F3F">成员{{ formData.name }}删除后相关个人信息将被清空，</span>还可查看上传记录和已出报告。
      </div>
    </template>
  </z-model>
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
import { delMember, updateMember } from '@/api/user';
import useServiceStore from '@/store/service';
import useMemberStore from '@/store/member';

const maxDate = ref();
const minDate = ref();
const curDate = ref(dayjs().valueOf());
const serviceStore = useServiceStore();
const memberStore = useMemberStore();

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
  create_tm: null,
  uuid: null,
  deleted: null,
  avatarUrlValue: null,
});
const deleteConfirmModel = ref<boolean>(false);
const autoApplyForAiModel = ref(false);
const autoApplyForDocModel = ref(false);
const autoApplyForAi = ref<boolean>(false);
const autoApplyForDoc = ref<boolean>(false);
const aiExpiredTag = ref<boolean>(false); // 自动申请智能解读服务过期
const sex = ref<string>('');
const birthString = ref<string | null>(null);
const relationship = ref<string>('');
const member = ref<any>();
const columns = reactive([
  ['男', '女'],
]);
const contact_rela = reactive([
  ['本人', '父亲', '母亲', '其他'],
]);
const emergency_rela = reactive([
  ['父母', '子女', '朋友', '其他'],
]);
const genderPickerShow = ref(false);
const e_relationPickerShow = ref(false);
const birthdayPickerShow = ref(false);
const memberUuid = ref<string>('');
const avatar = ref<string>('');
const tagPickerShow = ref(false);

onLoad(async (params: any) => {
  maxDate.value = dayjs().valueOf();
  minDate.value = dayjs().subtract(100, 'year').month(0).date(1).valueOf();
  memberUuid.value = params.uuid;
  if (params.mobile) {
    formData.mobile = params.mobile;
    formData.relationship = '本人';
    relationship.value = '本人';
    formData.belongto = uni.getStorageSync('uuid');
    formData.name = '微信用户';
    return;
  }
  member.value = memberStore.getMemberList;
  member.value.forEach((item: any) => {
    if (item.uuid === params.uuid) {
      if ([0, 1].includes(item.gender)) {
        sex.value = item.gender === 0 ? '男' : '女';
      }
      avatar.value = item.avatarUrl || '';
      autoApplyForAi.value = item.auto_aireport === 'Y';
      autoApplyForDoc.value = item.auto_docreport === 'Y';
      relationship.value = item.relationship!;
      if (item.birth) {
        curDate.value = Number(item.birth);
      }
      birthString.value = item.birth && dayjs(Number(item.birth)).format('YYYY-MM-DD');
      Object.assign(formData, item);
    }
  });
});

watch(autoApplyForAi, () => {
  const aiTime = serviceStore.getAi;
  console.log('aiTime', aiTime);
  if (dayjs().isAfter(dayjs(aiTime))) {
    aiExpiredTag.value = true;
    console.log('自动申请智能解读服务已过期', aiExpiredTag.value);
    autoApplyForAi.value = false;
    autoApplyForAiModel.value = true;
  }
  else if (!aiTime) {
    autoApplyForAi.value = false;
    aiExpiredTag.value = false;
    autoApplyForAiModel.value = true;
  }
});

watch(autoApplyForDoc, () => {
  console.log('autoApplyForDoc', autoApplyForDoc.value);
  const docTime = serviceStore.getDoc;
  if (docTime <= 0) {
    autoApplyForDoc.value = false;
    autoApplyForDocModel.value = true;
  }
});

const deleteMemberCancel = async () => {
  deleteConfirmModel.value = false;
  const res = await delMember({ uuid: memberUuid.value });
  if (res.code === 'NG') {
    uni.showToast({ title: res.message, icon: 'none' });
    return;
  }
  uni.navigateBack({ delta: 1 });
};

const goBuyAi = () => {
  autoApplyForAiModel.value = false;
  uni.navigateTo({ url: '/pages/service/ai/index' });
};

const goBuyDoc = () => {
  autoApplyForDocModel.value = false;
  uni.navigateTo({ url: '/pages/service/doctor/index' });
};

const chooseAvatar = (e: any) => {
  avatar.value = e.detail.avatarUrl;
  // uni.setStorageSync('avatarurl', avatar.value);
  uni.compressImage({
    src: e.detail.avatarUrl,
    quality: 50,
    success: (res) => {
      uni.getFileSystemManager().readFile({
        filePath: res.tempFilePath,
        encoding: 'base64',
        success: async (res) => {
          formData.avatarUrl = `data:image/jpeg;base64,${res.data}`;
        },
        fail: () => {},
      });
    },
  });
};
const handleNameChange = (name: string) => {
  formData.name = name;
};
const handleSexClick = () => {
  genderPickerShow.value = true;
};
const handleDateClick = () => {
  birthdayPickerShow.value = true;
};
const handlePhoneChange = (mobile: string) => {
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
const e_relationCancel = () => {
  e_relationPickerShow.value = false;
};
const handleTagClick = () => {
  tagPickerShow.value = true;
};
const tagConfirm = ({ value }: { value: string[] }) => {
  const res = checkRelaship(value[0], formData.relationship! as string);
  if (res) {
    relationship.value = value[0];
    tagPickerShow.value = false;
  }
};
const tagCancel = () => {
  tagPickerShow.value = false;
};
const genderCancel = () => {
  genderPickerShow.value = false;
};
const birthdayConfirm = ({ value }: { value: string }) => {
  formData.birth = `${value}`;
  const formattedValue = dayjs(value).format('YYYY-MM-DD');
  birthString.value = formattedValue;
  birthdayPickerShow.value = false;
};
const birthdayCancel = () => {
  birthdayPickerShow.value = false;
};

const handleENameChange = (name: string) => {
  formData.contact_name = name;
};
const handleEPhoneChange = (mobile: string) => {
  formData.contact_mobile = mobile;
};
const handleERelationClick = () => {
  e_relationPickerShow.value = true;
};
const handleConfirmClick = async () => {
  formData.auto_aireport = autoApplyForAi.value ? 'Y' : '';
  formData.auto_docreport = autoApplyForDoc.value ? 'Y' : '';
  if (avatar.value.startsWith('/static')) {
    formData.avatar = null;
  }
  if (relationship.value) {
    formData.relationship = relationship.value;
  }
  if (sex.value) {
    formData.gender = sex.value === '男' ? 0 : 1;
  }
  if (!validForm(formData))
    return;
  formData.uuid = memberUuid.value;

  const ans = await updateMember(formData);
  console.log('保存结果', ans);
  uni.hideLoading();
  if (ans.code === 'NG') {
    uni.showToast({ title: ans.message, icon: 'none' });
  }
  else {
    uni.showToast({ title: '修改成功', icon: 'none' });
    setTimeout(() => {
      uni.navigateBack();
    }, 1000);
  }
};
const handleDelClick = async () => {
  if (member.value && member.value.length === 1) {
    uni.showToast({ title: '至少保留一个成员', icon: 'none' });
    return;
  }
  deleteConfirmModel.value = true;
};
</script>

<style>
page{
  background: #fff;
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

.del-btn{
  width: 100%;
  height: 80rpx;
  border: 1px solid #FF3F3F;
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
  flex-direction: row-reverse
}

.switch-wrap{
  margin-left: auto;
}
</style>
