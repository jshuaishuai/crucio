
import  type { AxiosRequestConfig, AxiosResponse } from 'axios';

export type Parameter<T extends (arg: any) => any> = T extends (arg: infer P) => any ? P : any;

declare module 'axios' {
    export interface AxiosInstance {
        createApi<T extends { [k: string]: any }>(apiList: { [k in keyof T]: string }): {
            [k in keyof T]: (
                data?: Parameter<T[Extract<keyof T, string>]>,
                config?: AxiosRequestConfig,
            ) => AxiosPromise<ReturnType<T[Extract<keyof T, string>]>>;
        };
    }
}


// 初始化配置
export type CrucioRequestConfig = AxiosRequestConfig & {
    adapterOnError?: (error: any, config: AxiosRequestConfig) => void;
    interceptors?: {
        request?: {
            onFulfilled?: (
                value: AxiosRequestConfig,
            ) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
            onRejected?: (error: any) => any;
        };
        response?: {
            onFulfilled?: (value: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
            onRejected?: (error: any) => any;
        };
    };
    middlewares?: any[];
};

export interface ErrorHandleOptions {
    env: string;
    config: AxiosRequestConfig;
}

// 等待中的接口
export interface PendingTask {
    config: AxiosRequestConfig
    resolve: Function
}
