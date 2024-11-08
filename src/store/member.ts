import { defineStore } from 'pinia';
import type { MemberInfoList } from '@/pages/member/helper';

export const useMemberStore = defineStore('member', {
  state: () => ({
    memberList: [] as MemberInfoList[],
  }),
  actions: {
    setMemberList(data: MemberInfoList[]) {
      this.memberList = data;
    },
  },
  getters: {
    getMemberList(): MemberInfoList[] {
      return this.memberList;
    },
  },
});

export default useMemberStore;
