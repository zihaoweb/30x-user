import { defineStore } from 'pinia';

export const useMessageStore = defineStore('message', {
  state: () => ({
    report: [],
    attention: [],
    data: [],
    dg: [],
    hasNotReadreport: 0,
    hasNotReadattention: 0,
    hasNotReaddata: 0,
    hasNotReaddg: 0,
  }),
  actions: {
    setReport(data: any) {
      this.report = data;
    },
    setAttention(data: any) {
      this.attention = data;
    },
    setData(data: any) {
      this.data = data;
    },
    setDg(data: any) {
      this.dg = data;
    },
    setHasNotRead(type: string, data: number = 0) {
      switch (type) {
        case 'report':
          this.hasNotReadreport = data;
          break;
        case 'attention':
          this.hasNotReadattention = data;
          break;
        case 'data':
          this.hasNotReaddata = data;
          break;
        case 'dg':
          this.hasNotReaddg = data;
          break;
        default:
          break;
      }
    },
  },
  getters: {
    getReport: (state) => {
      return state.report;
    },
    getAttention: (state) => {
      return state.attention;
    },
    getData: (state) => {
      return state.data;
    },
    getDg: (state) => {
      return state.dg;
    },
    getHasNotReadreport: (state) => {
      return state.hasNotReadreport;
    },
    getHasNotReadattention: (state) => {
      return state.hasNotReadattention;
    },
    getHasNotReaddata: (state) => {
      return state.hasNotReaddata;
    },
    getHasNotReaddg: (state) => {
      return state.hasNotReaddg;
    },
  },
});

export default useMessageStore;
