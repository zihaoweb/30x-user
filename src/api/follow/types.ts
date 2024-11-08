export interface FollowListResult {
  /**
   * 本人账号id
   */
  acc_id: string;
  /**
   * 本人昵称
   */
  acc_name: string;
  /**
   * 本人电话
   */
  acc_mobile: string;
  /**
   * 创建时间
   */
  create_tm: string;
  acc_avatarUrl: string;
  followed_avatarUrl: string;
  /**
   * 逻辑删除，Y：已删除  空：未删除
   */
  deleted: string;
  /**
   * 被关注者账号id
   */
  followed_id: string;
  /**
   * 被关注者昵称
   */
  followed_name: string;
  /**
   * 被关注者电话
   */
  followed_mobile: string;
  /**
   * 状态，'等待授权','已关注','被拒绝','已取消','已超时’的其中一个
   */
  status: string;
  /**
   * 修改时间
   */
  update_tm: string;
  /**
   * 记录唯一标识
   */
  uuid: string;
}

export interface SystemConfig {
  name: string;
  value: string;
}
