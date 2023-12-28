import { AxiosError } from 'axios';
import type { ErrorHandleOptions } from '../types';

export default function defaultErrorHandler(err: AxiosError<any>, options: ErrorHandleOptions) {
    // 错误处理流程：
    // 基本原则：越清晰的错误，越优先处理
    // 1. 非 HTTP 请求错误，上报日志系统，直接跳过。一般为 axios-adapters 包内 JS 运行时错误
    // 2. 优先走错误处理机制，处理不了的再兜底
    // 3. Axios 内部的一些错误，一般是服务器无响应，比如超时、网络异常等
    // 4. 存在 HTTP 状态码，但接口未提供 response.message 字段，根据 HTTP 状态码提供统一的提示信息
    //    一般为不可预知的错误，比如阿里云服务异常
    // 5. 以上都处理不了的，做最后的兜底处理，统一报错信息

}
