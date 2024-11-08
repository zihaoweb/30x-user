import type { IOnceAIPriceResult, getServiceInfoResult } from './types';
import type { GetOrderParams } from '@/api/order/types';
import { get, post } from '@/utils/request';

enum URL {
  loginByCode = '/wx/wx/coll/session/',
  getOnceAiPrice = '/bu/ai/prices-once',
  getServiceInfo = '/bu/pat_app/balance',
  getAiReport = '/bu/ai/fetch-report/ai-',
  buyOnceAi = '/wx/mch/prepay4ai-once',
}

export const loginByCode = (code: GetOrderParams) => get<any>({ url: URL.loginByCode + code });
// 获取单次AI价格
export const getOnceAiPrice = () => post<IOnceAIPriceResult[]>({ url: URL.getOnceAiPrice });
export const getServiceInfo = (accid: string) => get<getServiceInfoResult>({ url: `${URL.getServiceInfo}/${accid}` }); // 获取AI | DOC 服务次数信息
export const getAiReport = (id: string) => post({ url: URL.getAiReport + id });
// 购买单次AI
export const buyOnceAi = (data: any) => post({ url: URL.buyOnceAi, data });
