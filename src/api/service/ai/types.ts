export interface IOnceAIPriceResult {
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

export interface getServiceInfoResult {
  /**
   * 账号id
   */
  accid: string;
  /**
   * AI服务有效期
   */
  ai_expired_dt: string;
  /**
   * 剩余总次数
   */
  balance: number;
  /**
   * 消费掉的订单次数
   */
  consume_order_qty?: number;
  /**
   * 消费总次数
   */
  consume_qty?: number;
  /**
   * 消费掉的权益次数
   */
  consume_redeem_qty?: number;
  /**
   * 订单次数余额
   */
  order_balance?: number;
  /**
   * 套餐总次数
   */
  order_qty?: number;
  /**
   * 优先扣除的权益
   */
  prior_of_redeem?: string;
  /**
   * 权益次数余额
   */
  redeem_balance?: number;
  /**
   * 到期的权益次数
   */
  redeem_expired_qty?: number;
  /**
   * 权益总次数
   */
  redeem_qty?: number;
}
