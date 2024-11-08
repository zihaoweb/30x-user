export interface GetOrderParams {
  accid: string;
  pageno: number;
  pagecnt: number;
  type: string;
}

export interface OrderResult {
  ai_tag: string; // 标识 AI 服务类型
  ai_uuid: string; // AI 服务的唯一标识符
  amount: number; // 金额
  beneficiary_id: string; // 受益人 ID
  beneficiary_name: string; // 受益人姓名
  cancel_tm: string; // 取消时间戳
  create_tm: string; // 创建时间戳
  current_tm: number; // 当前时间戳
  description: string; // 服务描述
  doc_uuid: string; // 医生唯一标识符
  due_date: string; // 到期日
  expire_dt: string; // 过期时间
  openid: string; // 用户的 openid
  payer: string; // 支付人 ID
  quantity: number; // 购买数量
  status: string; // 状态码，03 代表某个状态
  success_time: string | null; // 成功时间，可以为空
  timeout_duration: number; // 超时时长
  type: string; // 订单类型，如 "ai-once"
  time?: number;
  tradeno: string;
};

export interface GetPayRedeemParam {
  accid: string;
  pageno?: number;
  pagecnt?: number;
}

export interface PayRedeemResultAll {
  code: string; // 交易的唯一标识符
  create_tm: string; // 创建时间的时间戳（以字符串表示）
  description: string; // 描述信息
  due_date: string; // 到期日期（可能为空字符串）
  expire_dt: string | null; // 过期日期（可能为 null）
  openid: string; // 用户的 openid
  payer: string; // 付款人的标识符
  quantity: number; // 数量
  type: string; // 交易类型
  uuid: string; // 全局唯一标识符
};
