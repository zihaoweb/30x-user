import type { EvaluateParams, GetOrderParams, IPayParams, IPriceAI, RuleRedeemParams, UseHistListResult } from './types';
import { get, post } from '@/utils/request';

enum URL {
  getDoctorPrice = '/admin/price-list',
  getAItorPrice = '/bu/ai/prices-set',
  buyDoctorVip = '/wx/mch/prepay', // 医生套餐
  buyDoctorVipOfUrgent = '/wx/mch/prepay-urgent', // 医生加急
  buyAITorVip = '/wx/mch/prepay4ai-set', // AI套餐
  scanQRCode = '/admin/check-code',
  ruleRedeem = '/bu/pat_app/redeem',
  getUsedDocHist = '/bu/pat_app/hist/consume/',
  getOnceDocPrice = '/bu/pat_app/urgent',
  reportEvaluate = '/bu/pat_app/report_evaluate/add',
  setUsedListRead = '/bu/pat_app/hist/consume/readed/',
}

export const getDoctorPrice = () => get({ url: URL.getDoctorPrice });
export const getOnceDocPrice = () => post({ url: URL.getOnceDocPrice });
export const getAItorPrice = () => post<IPriceAI>({ url: URL.getAItorPrice });
export const buyDoctorService = (data: IPayParams) => post({ url: URL.buyDoctorVip, data });
export const buyAItorService = (data: IPayParams) => post({ url: URL.buyAITorVip, data });
export const scanQRCode = (data: { code: string }) => post({ url: URL.scanQRCode, data });
export const ruleRedeem = (data: RuleRedeemParams) => post({ url: URL.ruleRedeem, data });
export const buyDoctorServiceOfUrgent = (data: IPayParams) => post({ url: URL.buyDoctorVipOfUrgent, data }); // 加急服务
export const getUsedDocHist = (data: GetOrderParams) => post<UseHistListResult[]>({ url: URL.getUsedDocHist + data.accid, data });
export const reportEvaluate = (data: EvaluateParams) => post<any>({ url: URL.reportEvaluate, data }); // 报告评价
export const setUsedListRead = (accId: string) => get<any>({ url: URL.setUsedListRead + accId }); //
