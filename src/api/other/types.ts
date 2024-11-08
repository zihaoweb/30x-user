export interface FollowOtherParams {
  acc_id: string;
  followed_id: string;
  status?: string;
}

export interface ChangeFollowOtherParams {
  /**
   * 本人账号id
   */
  acc_id?: string;
  /**
   * 状态，'已关注','被拒绝'的其中一个
   */
  status: string;
  /**
   * 记录唯一标识
   */
  uuid: string;
}

export interface FollowHistResult {
  acc_id: string;
  /**
   * 对应关注信息
   */
  atten_id: string;
  /**
   * 创建时间
   */
  create_tm: string;
  /**
   * 被操作人id
   */
  oper_be_id: string;
  /**
   * 被操作人姓名
   */
  oper_be_name: string;
  /**
   * 操作人id
   */
  oper_id: string;
  /**
   * 操作人姓名
   */
  oper_name: string;
  /**
   * 备注
   */
  remark: string;
  /**
   * 历史操作记录唯一标识
   */
  uuid: string;
}

export interface DelFollow {
  /**
   * 发起删除人
   */
  acc_id: string;
  /**
   * 被删除的人
   */
  deleted_id: string;
  /**
   * 删除类型，"已删除”（取消对Ta的关注）和“已移除”（取消被Ta关注）的其中一个。
   */
  type: string;
  /**
   * 关注记录唯一标识
   */
  uuid: string;
}

export interface PieDataParams {

  /**
   * 账户id
   */
  acc_id: string;
  /**
   * 月份
   */
  month: number;
  /**
   * 年份
   */
  year: number;
}
