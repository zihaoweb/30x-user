import type { IAddEcgRecord, IAddEcgRecordResult, IEcgBinary, IUploadEcgRecord, IUploadEcgRecordResult } from './types';
import { post } from '@/utils/request';

enum URL {
  addCollectRecord = `/bu/pat_app/collection/add`,
  updateCollectRecord = '/bu/pat_app/collection/update',
  uploadEcgBinaryData = '/bu/pat_app/upload-short-dat',
  uploadDataArray = '/bu/pat_app/heartrate',
}

export const addCollectionRecord = (data: IAddEcgRecord) => post<IAddEcgRecordResult>({ url: URL.addCollectRecord, data });
export const updateCollectionRecord = (data: IUploadEcgRecord) => post<IUploadEcgRecordResult>({ url: URL.updateCollectRecord, data });
export const uploadEcgBinaryData = (data: IEcgBinary) => post<IUploadEcgRecordResult>({ url: URL.uploadEcgBinaryData, data: data.buffer, header: { 'Content-Type': 'application/octet-stream', 'patid': data.patid, 'starttime': data.starttime, 'duration': data.duration } });
export const uploadNumberArrayData = (data: any) => post<string>({ url: URL.uploadDataArray, data });
