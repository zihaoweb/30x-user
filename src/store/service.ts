import { defineStore } from 'pinia';

export const useServiceStore = defineStore('service', {
  state: () => ({
    ai: '',
    doc: 0,
  }),
  actions: {
    setAi(ai: string) {
      this.ai = ai;
    },
    setDoc(doc: number) {
      this.doc = doc;
    },
  },
  getters: {
    getAi(): string {
      return this.ai;
    },
    getDoc(): number {
      return this.doc;
    },
  },
});

export default useServiceStore;
