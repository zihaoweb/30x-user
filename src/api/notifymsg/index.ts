import type { IMessageDetailParams, INotifyMessageRestult } from './types';
import { post } from '@/utils';

enum URL {
  getNotifyMessage = '/bu/pat_app/notifications/list',
}

export const getNotifyMessage = (data: IMessageDetailParams) => post<INotifyMessageRestult>({ url: URL.getNotifyMessage, data });
