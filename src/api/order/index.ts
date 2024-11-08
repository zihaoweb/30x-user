import type { GetOrderParams, GetPayRedeemParam, OrderResult, PayRedeemResultAll } from './types';
import { post } from '@/utils/request';

enum URL {
  getOrderAll = '/bu/ai/order/all',
  getPayRedeemAll = '/bu/pat_app/hist/redeem/',
  getOrderPadding = '/bu/ai/order/pending',
  cancelOrder = '/bu/pat_app/order/cancel',
  cancelOrderOfUrgent = '/bu/pat_app/urgent/cancel',
  cancelOrderOfAi = '/bu/ai/order/cancel-set',
  cancelOrderOfOnceAi = '/bu/ai/order/cancel-once',
}

export const getOrderAll = (data: GetOrderParams) => post<OrderResult[]>({ url: URL.getOrderAll, data }); // 获取订单
export const getPayRedeemAll = (data: GetPayRedeemParam) => post<PayRedeemResultAll[]>({ url: URL.getPayRedeemAll + data.accid, data });
// export const getOrderPadding = (data: GetOrderParams) => post<OrderResult[]>({ url: URL.getOrderPadding, data }); // 获取待支付订单
export const cancelPaddingOrder = (data: { uuid: string }) => post<string>({ url: URL.cancelOrder, data }); // 取消医生订单
export const cancelOrderOfUrgent = (data: { uuid: string }) => post<string>({ url: URL.cancelOrderOfUrgent, data }); // 取消医生加急订单
export const cancelPaddingOrderOfAi = (data: { uuid: string }) => post<string>({ url: URL.cancelOrderOfAi, data }); // 取消ai订单
export const cancelPaddingOrderOfOnceAi = (data: { uuid: string }) => post<string>({ url: URL.cancelOrderOfOnceAi, data }); // 取消ai单次订单
