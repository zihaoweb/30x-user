import type { FollowListResult, SystemConfig } from './types';
import { get, post } from '@/utils';

enum URL {
  getFollowList = '/bu/pat_app/my_follows',
  getFansList = '/bu/pat_app/am_followed',
  config = '/bu/pat_coll/configs',
}

export const getFollowList = (data: { acc_id: string; type?: string }) => post<FollowListResult[]>({ url: URL.getFollowList, data });
export const getFansList = (data: { acc_id: string }) => post<FollowListResult[]>({ url: URL.getFansList, data });
export const getSystemConfig = () => get<SystemConfig[]>({ url: URL.config });
