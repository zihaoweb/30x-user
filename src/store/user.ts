import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    avatar: '',
    phone: '',
    followTips: true,
  }),
  actions: {
    setName(name: string) {
      this.name = name;
    },
    setAvatar(avatar: string) {
      this.avatar = avatar;
    },
    setPhone(phone: string) {
      this.phone = phone;
    },
    setFollowTips(followTips: boolean) {
      this.followTips = followTips;
    },
  },
  getters: {
    getName(state) {
      return state.name;
    },
    getAvatar(state) {
      return state.avatar;
    },
    getPhone(state) {
      return state.phone;
    },
    getFollowTips(state) {
      return state.followTips;
    },
  },
});

export default useUserStore;
