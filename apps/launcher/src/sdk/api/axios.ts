import { useNavigation } from '@react-navigation/native';
// 参考文档 https://developer.aliyun.com/article/986392
import axios, {AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios'
// 数据返回的接口
// 定义请求响应参数，不含data
interface Result {
  status: number; // 示例：200
  error: string;
  message: string;
}

// 请求响应参数，包含data
interface ResultData<T = any> extends Result {
  payload?: T;
}
const URL: string = '/api'
enum RequestEnums {
  TIMEOUT = 20000,
  OVERDUE = 600, // 登录失效
  OVERDUE_2 = 401, // 登录过期
  FAIL = 999, // 请求失败
  SUCCESS = 200, // 请求成功
}
const config = {
  // 默认地址
  baseURL: URL as string,
  // 设置超时时间
  timeout: RequestEnums.TIMEOUT as number,
  // 跨域时候允许携带凭证
  withCredentials: true
}

const navigation = useNavigation();

class RequestHttp {
  // 定义成员变量并指定类型
  service: AxiosInstance;
  public constructor(config: AxiosRequestConfig) {
    // 实例化axios
    this.service = axios.create(config);
    /**
     * 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     * token校验(JWT) : 接受服务器返回的token,存储到vuex/pinia/本地储存当中
     */
    this.service.interceptors.request.use(
      // @ts-ignore
      (config: AxiosRequestConfig) => {
        // const token = localStorage.getItem('token') || '';
        return {
          ...config,
          headers: {
            // 'Authorization': token, // 请求头中携带token信息
            "Content-Type": "application/json",
          }
        }
      },
      (error: AxiosError) => {
        // 请求报错
        Promise.reject(error)
      }
    )

    /**
     * 响应拦截器
     * 服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const {data, config} = response; // 解构
        if (data.code === RequestEnums.OVERDUE ) {
          // 登录信息失效，应跳转到登录页面，并清空本地的token
          // localStorage.setItem('token', '');
          // navigation.navigate('Login');

          // location.reload();
          return Promise.reject(data);
        }
        // 全局错误信息拦截（防止下载文件得时候返回数据流，没有code，直接报错）
        if (data.code && data.code !== RequestEnums.SUCCESS) {
          console.error(data.msg); // 此处也可以使用组件提示报错信息
          return Promise.reject(data)
        }
        return data;
      },
      (error: AxiosError) => {
        const {response} = error;
        if (response) {
          this.handleCode(response.status)
        }
        // if (!window.navigator.onLine) {
        //   console.error('网络连接失败');
        //   // 可以跳转到错误页面，也可以不做操作
        //   // return router.replace({
        //   //   path: '/404'
        //   // });
        // }
      }
    )
  }
  handleCode(code: number):void {
    switch(code) {
      case 403:
      case 401:
        console.error('登录失败，请重新登录');
        navigation.navigate('Login');
        break;
      default:
        console.error('请求失败');
        break;
    }
  }

  // 常用方法封装
  get<T>(url: string, params?: object): Promise<ResultData<T>> {
    return this.service.get(url, {params});
  }
  post<T>(url: string, params?: object): Promise<ResultData<T>> {
    return this.service.post(url, params);
  }
  put<T>(url: string, params?: object): Promise<ResultData<T>> {
    return this.service.put(url, params);
  }
  delete<T>(url: string, params?: object): Promise<ResultData<T>> {
    return this.service.delete(url, {params});
  }
}

// 导出一个实例对象
export default new RequestHttp(config);
