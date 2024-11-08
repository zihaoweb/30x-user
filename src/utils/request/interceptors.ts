import type {
  HttpRequestConfig,
  HttpResponse,
} from 'uview-plus/libs/luch-request/index';
// import { getToken } from '@/utils/auth';
// import useUserStore from '@/store/modules/user';

// 是否正在刷新token的标记
// const isRefreshing: boolean = false;
// 重试队列，每一项将是一个待执行的函数形式
// const requestQueue: (() => void)[] = [];

function requestInterceptors() {
  /**
   * 请求拦截
   * @param {object} http
   */
  uni.$u.http.interceptors.request.use(
    (config: HttpRequestConfig) => config,
  );
}
function responseInterceptors() {
  /**
   * 响应拦截
   * @param {object} http
   */
  uni.$u.http.interceptors.response.use(
    async (response: HttpResponse) => {
      if (response.code === 0) {
        return response.data;
      }
      else {
        return Promise.reject(response);
      }
    },
    (error: any) => {
      return Promise.reject(error);
    },
  );
}

export { requestInterceptors, responseInterceptors };
