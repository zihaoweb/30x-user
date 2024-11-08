/**
 * 用户信息相关接口
 */
import type { AccountInfo, SignUpParams, UserId, UserPhoneNumber } from './types';
import type { IFormData, MemberInfoList } from '@/pages/member/helper';

import { get, post } from '@/utils/request';

enum URL {
  signUp = '/bu/pat_app/accounts/signup',
  loginByCode = '/wx/wx/account/session/', // 登录
  phonenumber = '/wx/wx/account/phone/', // 获取手机号
  getUserInfoByOpenId = '/bu/pat_app/account-openid/', // 根据openid获取用户信息
  getUserInfoByUnionId = '/bu/pat_app/account-unionid/', // 根据unionid获取用户信息
  addMember = '/bu/pat_app/patients/add2',
  getMember = '/bu/pat_app/patients/find',
  updateMember = '/bu/pat_app/patients/update',
  delMember = '/bu/pat_app/patients/delete2',
  uploadUser = '/bu/pat_app/accounts/update',
  getLaws = '/bu/doc_web/fetch-laws',
}

export const signUp = (data: SignUpParams) => post<any>({ url: URL.signUp, data });
export const loginByCode = (code: string) => get<UserId>({ url: URL.loginByCode + code });
export const getUserPhonenumber = (code: any) => get<UserPhoneNumber>({ url: URL.phonenumber + code });
export const getUserInfoByOpenId = (openid: string) => get<AccountInfo>({ url: URL.getUserInfoByOpenId + openid });
export const getUserInfoByUnionId = (unionid: string, app: string) => get<AccountInfo>({ url: `${URL.getUserInfoByUnionId + unionid}/${app}` });
export const getMember = (data: { belongto?: string; uuid?: string }) => post<MemberInfoList[]>({ url: URL.getMember, data });
export const addMember = (data: any) => post<IFormData>({ url: URL.addMember, data });
export const updateMember = (data: any) => post<IFormData>({ url: URL.updateMember, data });
export const delMember = (data: { uuid: string }) => post<IFormData>({ url: URL.delMember, data });
export const uploadUser = (data: Partial<IFormData>) => post<IFormData>({ url: URL.uploadUser, data });
export const getLaws = (fileName: string) => get<string>({ url: `${URL.getLaws}/${fileName}` });
