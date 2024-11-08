import useMemberStore from '@/store/member';

export const MobileRule = /^(((13\d)|(15\d)|(17\d)|(18\d)|(19\d))+\d{8})$/;
export const NameRule = /^[\u4E00-\u9FA5a-z0-9.\s]{1,16}$/i;
export const relationRule = /^(本人|父母|朋友|父亲|母亲|子女|其他)$/;

const memberStore = useMemberStore();

export interface IFormData {
  name: string;
  gender: number;
  birth: string;
  mobile?: string;
  avatar?: string;
  relationship?: string;
  auto_aireport: string | null;
  auto_docreport: string | null;
  contact_name?: string;
  contact_mobile?: string;
  contact_rela?: string;
  belongto?: string;
  code?: string;
  message?: string;
  uuid?: string;
  avatarUrl?: string;
  nickname?: string;
  openid?: string;
}

export interface MemberInfoList extends IFormData {
  create_tm: string;
  deleted: string;
  uuid: string;
  avatarUrlValue?: string;
}

export const validForm = (form: any) => {
  console.log(form);
  if (form.mobile && !MobileRule.test(form.mobile)) {
    uni.showToast({ title: '手机号格式有误', icon: 'none' });
    return false;
  }
  if (!form.name) {
    uni.showToast({ title: '姓名不能为空', icon: 'none' });
    return false;
  }
  if (form.gender === 2) {
    uni.showToast({ title: '性别不能为空', icon: 'none' });
    return false;
  }
  if (!form.birth) {
    uni.showToast({ title: '出生日期不能为空', icon: 'none' });
    return false;
  }
  if (form.name && !NameRule.test(form.name)) {
    uni.showToast({ title: '姓名格式为1-16个中英文字符及数字', icon: 'none' });
    return false;
  }
  if (form.relationship && form.relationship === '父亲' && form.gender === 1) {
    uni.showToast({ title: '父亲性别有误', icon: 'none' });
    return false;
  }
  if (form.relationship && form.relationship === '母亲' && form.gender === 0) {
    uni.showToast({ title: '母亲性别有误', icon: 'none' });
    return false;
  }
  if (form.relationship && !relationRule.test(form.relationship)) {
    uni.showToast({ title: '与本人关系格式有误', icon: 'none' });
    return false;
  }
  if (form.contact_name && !NameRule.test(form.contact_name)) {
    uni.showToast({ title: '紧急联系人姓名格式为1-16个中英文字符及数字', icon: 'none' });
    return false;
  }
  if (form.contact_mobile && !MobileRule.test(form.contact_mobile)) {
    uni.showToast({ title: '紧急联系人手机号格式有误', icon: 'none' });
    return false;
  }
  if (form.contact_rela && !relationRule.test(form.contact_rela)) {
    uni.showToast({ title: '与紧急联系人关系格式有误', icon: 'none' });
    return false;
  }
  return true;
};

export const checkRelaship = (rela: string, curr: string): boolean => {
  if (rela === '其他' || rela === curr)
    return true;
  const memberList = memberStore.getMemberList;
  for (const item of memberList) {
    if (rela && item.relationship === rela) {
      uni.showToast({ title: '该关系已存在', icon: 'none' });
      return false;
    }
  }
  return true;
};
