import type { ChangeFollowOtherParams, DelFollow, FollowHistResult, FollowOtherParams, PieDataParams } from './types';
import { get, post } from '@/utils';

enum URL {
  followOther = '/bu/pat_app/follow/add',
  changeFollowOther = '/bu/pat_app/follow/update',
  findUserByUuid = '/bu/pat_app/accounts/',
  getFeedBackId = '/bu/pat_app/feeback/add',
  getFollowHist = '/bu/pat_app/follow/history',
  delFollow = '/bu/pat_app/follow/del',
  getPieData = '/bu/pat_app/report/statistics',
  deletePre = '/bu/pat_app/patients/predelete/',
}

export const followOther = (data: FollowOtherParams) => post<any>({ url: URL.followOther, data });
export const changeFollowOther = (data: ChangeFollowOtherParams) => post<any>({ url: URL.changeFollowOther, data });
export const getFollowHist = (data: { acc_id: string }) => post<FollowHistResult[]>({ url: URL.getFollowHist, data });
export const findUserByUuid = (uuid: string) => get<any>({ url: URL.findUserByUuid + uuid });
export const getFeedBackId = (data: { acc_id: string; description: string }) => post<{ code: string; feeback_id?: string }>({ url: URL.getFeedBackId, data });
export const delFollow = (data: DelFollow) => post<any>({ url: URL.delFollow, data });
export const getPieData = (data: PieDataParams) => post<any>({ url: URL.getPieData, data });
export const deletePre = (uuid: string) => post<any>({ url: URL.deletePre + uuid });
