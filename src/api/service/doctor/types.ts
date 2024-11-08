export interface RuleRedeemParams {
  payer: string;
  openid: string;
  description: string;
  code: string;
}

export interface IPayParams {
  /**
   * 订单金额
   */
  amount: string;
  /**
   * 请求来源
   */
  appid: string;
  /**
   * 受益人id，字段不为空时表示代付订单
   */
  beneficiary_id?: string;
  /**
   * 订单描述
   */
  description: string;
  /**
   * 支付人微信号
   */
  openid: string;
  /**
   * 支付人UUID
   */
  payer: string;
  /**
   * 次数，订单包含的服务次数
   */
  quantity: string;
  /**
   * 订单号
   */
  tradeno?: string;
}

export interface IPayResult {
  result: boolean;
  msg: string;
  url?: string;
}

export interface IPriceAI {
  /**
   * 创建时间
   */
  create_tm: string;
  /**
   * 编号，从1开始
   */
  id: number;
  /**
   * 服务类型
   */
  item_type: string;
  /**
   * 服务名称
   */
  name: string;
  /**
   * 现价
   */
  now_price: number;
  /**
   * 原价
   */
  old_price: number;
  /**
   * 服务描述
   */
  remark: string;
}

export interface GetOrderParams {
  accid: string;
  pageno: number;
  pagecnt: number;
}

export interface UseHistListResult {
  readed: string;
  pat_name: string;
  acc_mobile: string;
  consume_type: 'order' | 'redeem';
  /**
   * 账号UUID
   */
  consumer: string;
  /**
   * 消费时间
   */
  create_tm: string;
  /**
   * 微信号
   */
  openid: string;
  /**
   * 消费掉的次数
   */
  quantity: number;
  /**
   * 任务编号
   */
  taskid: string;
  /**
   * 消费唯一编号
   */
  uuid: string;
}

export interface EvaluateParams {
  /**
   * 医生账户id
   */
  doc_id: string;
  /**
   * 使用者id
   */
  pat_id: string;
  /**
   * 评分，1、2、3、4、5的其中一个，对应星级评分
   */
  points: number;
  /**
   * 报告id
   */
  report_id: string;
}
