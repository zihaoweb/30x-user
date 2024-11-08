import type { ApplyAiReportParams, ApplyDoctorReportParams, ApplyReportParamsResult, IReportParams, IReportResult } from './types';
import { get, post } from '@/utils/request';

enum URL {
  getReportList = '/bu/pat_app/reports',
  applyAiReport = '/bu/ai/apply-report',
  applyDoctorReport = '/bu/pat_app/consume',
  setMessageNotificationRead = '/bu/pat_app/notifications/readed',
  setReportRead = '/bu/ai/report',
  setReportReadOfDoctor = '/bu/pat_app/report',
}

export const getReportList = (data: IReportParams) => post<IReportResult[]>({ url: URL.getReportList, data });
export const applyAiReport = (data: ApplyAiReportParams) => post<ApplyReportParamsResult>({ url: URL.applyAiReport, data });
export const applyDoctorReport = (data: ApplyDoctorReportParams) => post<ApplyReportParamsResult>({ url: URL.applyDoctorReport, data });
export const setMessageNotificationRead = (data: { acc_id: string; type: string }) => post<string>({ url: URL.setMessageNotificationRead, data });
export const setReportRead = (id: string, accid: string) => get<string>({ url: `${URL.setReportRead}/${id}/${accid}` });
export const setReportReadOfDoctor = (id: string, accid: string) => get<string>({ url: `${URL.setReportReadOfDoctor}/${id}/${accid}` });
