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
    // if (config.url?.startsWith('/bu/')) {
    //   config.url = config.url?.replace('/bu/', '');
    //   // config.baseURL = `https://test2.api.alphaecg.cn`;
    //   config.baseURL = `${import.meta.env.VITE_APP_BASE_API}:4004`;
    // }
    // else if (config.url?.startsWith('/wx')) {
    //   config.url = config.url?.replace('/wx', '');
    //   config.baseURL = `${import.meta.env.VITE_APP_BASE_API}:3001`;
    //   // config.baseURL = `https://test2.api.alphaecg.cn`;
    // }
    // else if (config.url?.startsWith('/admin/')) {
    //   config.url = config.url?.replace('/admin/', '');
    //   config.baseURL = `${import.meta.env.VITE_APP_BASE_API}:4040`;
    //   // config.baseURL = `https://test2.api.alphaecg.cn`;
    // }
    //   return config;
    // },
    // (
    //   config: any, // 可使用async await 做异步操作
    // ) => Promise.reject(config),
  );
}
function responseInterceptors() {
  /**
   * 响应拦截
   * @param {object} http
   */
  uni.$u.http.interceptors.response.use(
    async (response: HttpResponse) => response.data,
    /* 对响应成功做点什么 可使用async await 做异步操作 */
    //   const data = response.data;
    //   // // 配置参数
    //   const config = response.config;
    //   // // 自定义参数
    //   // const custom = config?.custom;

    //   // 请求成功则返回结果
    //   if (data.code === 200 || response.statusCode === 200)
    //     return data || {};

    //   // 登录状态失效，重新登录
    //   if (data.code === 401) {
    //     // 是否在获取token中,防止重复获取
    //     if (!isRefreshing) {
    //       // 修改登录状态为true
    //       isRefreshing = true;
    //       // await useUserStore().authLogin();
    //       // 登录完成之后，开始执行队列请求
    //       requestQueue.forEach(cb => cb());
    //       // 重试完了清空这个队列
    //       requestQueue = [];
    //       isRefreshing = false;
    //       // 重新执行本次请求
    //       return uni.$u.http.request(config);
    //     }
    //     else {
    //       return new Promise((resolve) => {
    //         // 将resolve放进队列，用一个函数形式来保存，等登录后直接执行
    //         requestQueue.push(() => {
    //           resolve(uni.$u.http.request(config));
    //         });
    //       });
    //     }
    //   }

    //   // // 如果没有显式定义custom的toast参数为false的话，默认对报错进行toast弹出提示
    //   // if (custom?.toast !== false)
    //   //   uni.$u.toast(data.message);

    //   // // 如果需要catch返回，则进行reject
    //   // if (custom?.catch) {
    //   //   return Promise.reject(data);
    //   // }
    //   else {
    //     // 否则返回一个pending中的promise
    //     return new Promise(() => { });
    //   }
    // },
    // (response: HttpError) => {
    //   if (response.statusCode) {
    //     // 请求已发出，但是不在2xx的范围
    //     showMessage(response.statusCode);
    //     return Promise.reject(response.data);
    //   }
    //   showMessage('网络连接异常,请稍后再试!');
    // },
  );
}

export { requestInterceptors, responseInterceptors };
