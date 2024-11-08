export interface IReportParams {
  /**
   * 账号UUID
   */
  accid: string;
  /**
   * 数据采集时长，[n小时，n小时] ，单位/小时
   */
  coll_duration?: string[];
  /**
   * 数据上传时间，[起始时间，结束时间]，单位/时间戳
   */
  data_up_time?: string[];
  /**
   * 数据上传时间，[年份，月份]
   */
  data_up_tm?: number[];
  /**
   * 显示条数
   */
  pagecnt?: number;
  /**
   * 页码
   */
  pageno?: number;
  /**
   * 使用者UUID
   */
  pat_id?: string;
  /**
   * 类型，ReportOnly（是否仅显示有报告的数据）
   */
  type?: string;
  follow_create_tm?: string;
}

export interface IReportResult {
  score_points: string;
  once_nickname: string;
  urgent_nickname: string;
  once_payer: string;
  urgent_payer: string;
  time: number; // ai单次订单倒计时
  time2: number; // 医生加急订单倒计时
  current_tm: number;
  timeout_duration: number;
  pat_deleted: string;
  isShowText: boolean;
  doc_name: string;
  /**
   * 患者姓名
   */
  patient_name: string;
  /**
   * 接诊时间
   */
  accept_tm: string;
  /**
   * 接诊医生id
   */
  accepted_by: string;
  /**
   * 用户id
   */
  accid: string;
  /**
   * 年龄
   */
  age: number;
  /**
   * AI报告申请时间
   */
  ai_applied_tm: string;
  /**
   * AI报告是否已读
   */
  ai_readed: string;
  /**
   * AI报告备注
   */
  ai_remark: string;
  /**
   * AI报告UUID
   */
  ai_report_id: string;
  /**
   * AI报告上传时间
   */
  ai_report_up_tm: string;
  /**
   * 消费状态
   */
  applied: string;
  /**
   * 采集结束时间
   */
  collect_end_tm: string;
  /**
   * 采集开始时间
   */
  collect_sta_tm: string;
  /**
   * 数据id
   */
  data_id: string;
  /**
   * 上传时间月份
   */
  data_up_month: number;
  /**
   * 数据上传时间
   */
  data_up_tm: string;
  /**
   * 上传时间年份
   */
  data_up_year: number;
  /**
   * 诊断医生id
   */
  diagnosed_by: string;
  /**
   * 诊断时间
   */
  diagnosed_tm: string;
  /**
   * 采集时长
   */
  duration: number;
  /**
   * 完成时间
   */
  finish_tm: string;
  /**
   * 性别
   */
  gender: number;
  /**
   * AI报告申请状态
   */
  has_ai_report: string;
  /**
   * 报告申请状态
   */
  has_report: string;
  /**
   * 是否是短程数据，y（是短程数据）
   */
  is_short_range?: string;
  /**
   * 单次服务的订单取消时间
   */
  once_cancel_tm?: string;
  /**
   * 单次服务的订单创建时间
   */
  once_create_tm?: string;
  /**
   * 单次服务的订单状态
   */
  once_status?: string;
  /**
   * 使用者id
   */
  pat_id: string;
  /**
   * 是否已读
   */
  readed: string;
  /**
   * 简易分析，医生简易分析结论
   */
  remark: string;
  /**
   * 报告id
   */
  report_id: string;
  /**
   * 报告上传时间
   */
  report_up_tm: string;
  /**
   * 复核医生
   */
  reviewed_by: string;
  /**
   * 复核时间
   */
  reviewed_tm: string;
  /**
   * 任务状态
   */
  status: string;
  /**
   * 任务id
   */
  taskid: string;
  /**
   * 单次服务的订单编号，该任务绑定的单次服务订单编号
   */
  tradeno?: string;
  /**
   * 加急服务的订单取消时间
   */
  urgent_cancel_tm: string;
  /**
   * 加急服务的订单创建时间
   */
  urgent_create_tm?: string;
  /**
   * 加急服务的订单状态
   */
  urgent_status: string;
  /**
   * 加急服务的系统订单号
   */
  urgent_tradeno: string;
}

export interface ApplyAiReportParams {
  /**
   * 使用哪一个AI算法
   */
  agent?: string;
  /**
   * 来自哪个小程序
   */
  app: string;
  /**
   * 申请人账号UUID
   */
  applicant: string;
  /**
   * 申请人微信openid
   */
  openid: string;
  /**
   * 当前申请的任务编号
   */
  taskid: string;
}

export interface ApplyReportParamsResult {
  code?: string;
  msg?: string;
  key?: number;
}

export interface ApplyDoctorReportParams {
  /**
   * 来着哪个小程序，301|302
   */
  app?: string;
  /**
   * 关注人id ，不为空表示关注人代替申请报告
   */
  attention_id?: string;
  /**
   * 消费者UUID
   */
  consumer: string;
  /**
   * 是否允许扣除次数，当该任务所属账户没有可用次数时可以扣除申请人的次数，弹窗二次确认后，该值为‘Y’
   */
  is_apply?: string;
  /**
   * 账号UUID
   */
  openid: string;
  /**
   * 消费次数，默认为1
   */
  quantity?: number;
  /**
   * 任务编号，当前消费的任务编号UUID
   */
  taskid: string;
}
