export interface MessageList {
  owner: string;
  pat_acc_id: string;
  pat_acc_name: string;
  /**
   * 账户id
   */
  acc_id: string;
  /**
   * 账户昵称
   */
  acc_name?: string;
  /**
   * 关注人账户id
   */
  attention_id?: string;
  /**
   * 关注人账户昵称
   */
  attention_name?: string;
  /**
   * 关注人账户下的使用者id
   */
  attention_pat_id?: string;
  /**
   * 关注人账户下的使用者昵称
   */
  attention_pat_name?: string;
  /**
   * 创建时间
   */
  create_tm: string;
  /**
   * 通知内容描述，如果type是report，该值为“医生报告”或“AI报告”；
   * 如果type是date，该值为采集时长（毫秒级时间戳）；
   * 如果type是dg，该值为“医生套餐n次” 或 “AI套餐n个月”；
   * 如果type是attention，该值为“已删除”或“已移除”。
   */
  description: string;
  /**
   * 使用者id
   */
  pat_id?: string;
  /**
   * 使用者昵称
   */
  pat_name?: string;
  /**
   * 是否已读，Y已读，空未读
   */
  readed: string;
  /**
   * 通知类型分类，report（报告生成）和dg（代购到账) 和date（数据上传）和attention（关注消息）的其中一个
   */
  type: string;
  /**
   * 记录唯一标识
   */
  uuid: string;
  /**
   * 是否是自己为他人购买的服务
   */
  self: boolean;
}

export interface INotifyMessageRestult {
  rows: number;
  data: MessageList[];
}

export interface IMessageDetailParams {
  acc_id: string;
  type: string;
  pageno: number;
  pagecnt: number;
}
