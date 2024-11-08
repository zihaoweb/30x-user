<template>
  <u-navbar autoBack title="家庭成员" placeholder border bgColor="#F2F5F9" />
  <div class="m-t-24 box-border px-24">
    <div class="flex-between">
      <div class="flex items-center">
        <div class="m-r-8 text-32 text-#2F384C">
          成员
        </div>
        <up-icon name="info-circle" @click="goInfo" />
      </div>
      <div class="items-cente flex" @click="addMember">
        <up-icon name="plus-circle" :color="color" />
        <div class="m-l-10 text-32 text-#4F95FF">
          添加成员
        </div>
      </div>
    </div>

    <div v-for="v in memberList" :key="v.uuid" class="m-t-24 overflow-hidden border-rd-16">
      <up-swipe-action>
        <up-swipe-action-item
          v-for="(item, index) in options"
          :key="index"
          :options="item.options"
          :disabled="item.disabled"
          @click="deviceItemClick(v.uuid, v.name, v.create_tm)"
        >
          <div class="member-wrap relative box-border flex items-center p-24">
            <div class="size-96" @click="goDetail(v)">
              <up-avatar :size="48" :src="v.avatarUrl" />
            </div>
            <div class="m-l-24 h-96 flex-col justify-between" @click="goDetail(v)">
              <div class="flex text-36 text-#2F384C">
                <div class="text-elli max-w-200">
                  {{ v.name }}
                </div>
                <div v-if="v.birth" class="ml-24 box-border h-52 flex-center b-rd-8 bg-#F2F5F9 px-10 text-24 text-#2F384C">
                  <up-icon v-if="v.gender === 0" name="man" :color="`${'#4F95FF'}`" :size="18" />
                  <up-icon v-else name="woman" :color="`${'#ff93be'}`" :size="18" />
                  <div class="m-l-6">
                    {{ v.gender === 0 ? '男' : '女' }}
                  </div>
                  <div class="mx-10">
                    ·
                  </div>
                  <div>{{ dayjs().get('year') - dayjs(Number(v.birth)).get('year') }}岁</div>
                </div>
              </div>
              <div class="text-24 text-#999999">
                于 {{ dayjs(Number(v.create_tm)).format('YYYY-MM-DD HH:mm:ss') }} 添加
              </div>
            </div>
            <img v-if="v.birth" src="/static/user/qrcode.png" alt="" class="ml-auto mr-12 h-48 w-48" @click="getMemberQRCode(v)">
            <div v-if="!v.birth" class="valid-icon absolute right-0 top-0 flex-center text-24 text-#FF3F3F">
              资料待完善
            </div>
          </div>
        </up-swipe-action-item>
      </up-swipe-action>
    </div>
  </div>

  <z-model
    :show="deleteMemberFailModel" confirmText="我知道了" :isShowCancel="false" title="成员删除失败" icon="close-circle-fill" iconColor="#FF3F3F"
    @confirm="() => { deleteMemberFailModel = false; }" @close="() => { deleteMemberFailModel = false; }"
  >
    <template #default>
      <div class="m-b-40 m-t-24">
        成员 <span class="text-#4F95FF">{{ delName }}</span> 还有正在进行中的服务，暂时无法删除，请在服务结束后再试！
      </div>
    </template>
  </z-model>
  <z-model
    :show="deleteConfirmModel" confirmText="我在想想" cancelText="确认删除" cancelBtnColor="#FF3F3F" title="成员删除" icon="error-circle-fill" iconColor="#FD7F18"
    @confirm="deleteMemberFailConfirm" @cancel="deleteMemberCancel" @close="() => { deleteConfirmModel = false; }"
  >
    <template #default>
      <div class="m-b-40 m-t-24 text-26">
        <span class="text-#FF3F3F">成员{{ delName }}删除后相关个人信息将被清空，</span>还可查看上传记录和已出报告。
      </div>
    </template>
  </z-model>
  <z-model
    :show="exceedLimitModel" confirmText="我知道了" :isShowCancel="false" title="创建失败" icon="close-circle-fill" iconColor="#FF3F3F"
    @confirm="() => { exceedLimitModel = false; }" @close="() => { exceedLimitModel = false; }"
  >
    <template #default>
      <div class="m-b-82 m-t-24 flex-center text-28">
        当前家庭成员数量已达到5人上限
      </div>
    </template>
  </z-model>
  <z-model
    :show="memberDetailShow" confirmText="我知道了" :isShowCancel="false" title="温馨提示"
    @confirm="() => { memberDetailShow = false; }" @close="() => { memberDetailShow = false; }"
  >
    <template #default>
      <div class="m-b-40 m-t-24 text-28 text-#666666">
        每自然季度可添加<span class="primary-color">5名</span>固定成员进行心电采集和检测，如需更换成员可在下个自然季度进行成员更换。
      </div>
    </template>
  </z-model>
</template>

<script setup lang='ts'>
import dayjs from 'dayjs';
import type { MemberInfoList } from './helper';
import { delMember, getMember } from '@/api/user';
import useMemberStore from '@/store/member';
import { deletePre } from '@/api/other';

const memberStore = useMemberStore();

const color = ref('#4F95FF');
const memberList = ref<MemberInfoList[]>([]);
const memberDetailShow = ref<boolean>(false);
const deleteConfirmModel = ref<boolean>(false);
const exceedLimitModel = ref<boolean>(false);
const deleteMemberFailModel = ref<boolean>(false);

const deleteConfirmUuid = ref<string>('');
const delName = ref<string>('');

const options = ref([
  {
    text: '',
    disabled: false,
    options: [{
      text: '删除',
      style: {
        backgroundColor: '#FF4500',
      },
    }],
  },
]);

const init = async () => {
  const res = await getMember({ belongto: uni.getStorageSync('uuid') });
  memberList.value = [];
  memberList.value = res;
  memberStore.setMemberList(res);
};
onPullDownRefresh(async () => {
  await init();
  uni.stopPullDownRefresh();
});
onShow(async () => {
  await init();
});
onMounted(async () => {
  await init();
});
const goDetail = async (info: MemberInfoList) => {
  console.log('info', info);
  uni.navigateTo({ url: `/pages/member/updateMember?uuid=${info.uuid}` });
};
const deviceItemClick = async (uuid: string, name: string, createTime: string) => {
  console.log(getQuarter(Number(createTime)) === getQuarter(new Date().getTime()));
  if (createTime && getQuarter(Number(createTime)) === getQuarter(new Date().getTime()) && dayjs(Number(createTime)).year() === new Date().getFullYear()) {
    memberDetailShow.value = true;
    return;
  }
  if (memberList.value.length <= 1) {
    uni.showToast({ title: '至少保留一个成员', icon: 'none' });
    return;
  }
  delName.value = name;
  const res = await deletePre(uuid);
  if (res.pending > 0 || res.waiting > 0) {
    deleteMemberFailModel.value = true;
    return;
  }
  deleteConfirmModel.value = true;
  deleteConfirmUuid.value = uuid;
};

// 获取成员二维码
const getMemberQRCode = (info: MemberInfoList) => {
  uni.setStorageSync('memberAvatarUrl', info.avatarUrl!);
  uni.navigateTo({ url: `/pages/member/qrcode?uuid=${info.uuid}&name=${info.name}&birth=${info.birth}&gender=${info.gender}` });
};

const addMember = () => {
  console.log('添加成员');
  if (memberList.value.length >= 5) {
    exceedLimitModel.value = true;
    return;
  }
  uni.navigateTo({ url: '/pages/member/addMember' });
};
const deleteMemberFailConfirm = () => {
  deleteConfirmModel.value = false;
};

const deleteMemberCancel = async () => {
  deleteConfirmModel.value = false;
  console.log('删除成员取消');
  const res = await delMember({ uuid: deleteConfirmUuid.value });
  if (res.code === 'NG') {
    uni.showToast({ title: res.message, icon: 'none' });
    return;
  }
  await init();
};

const goInfo = () => {
  memberDetailShow.value = true;
};

const getQuarter = (time: number): number => {
  // 获取月份，dayjs 的月份是从 0 开始的（0 表示 1 月，11 表示 12 月）
  const month = dayjs(time).month() + 1; // 加 1 让月份从 1 开始

  // 根据月份判断季度
  if (month >= 1 && month <= 3) {
    return 1; // 第 1 季度
  }
  else if (month >= 4 && month <= 6) {
    return 2; // 第 2 季度
  }
  else if (month >= 7 && month <= 9) {
    return 3; // 第 3 季度
  }
  else {
    return 4; // 第 4 季度
  }
};
</script>

<style scoped lang='scss'>
.member-wrap{
  width: 100%;
  height: 146rpx;
  background: #FFF;
}

.valid-icon{
  width: 152rpx;
  height: 52rpx;
  background: rgb(255 63 63 / 10%);
  border-radius: 0rpx 16rpx;
}
</style>
