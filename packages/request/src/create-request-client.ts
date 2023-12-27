import Axios, { AxiosPromise, AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';
import { merge } from 'lodash-es';
import { createAdapter } from './adapter';
import { createRequestInterceptor } from './interceptor';
import type {Parameter,CrucioRequestConfig} from '../types'


export const registerCreateApi = (request) => {
    request.createApi = <T extends { [k: string]: any }>(apiList: { [k in keyof T]: string }) => {
        const api: {
            [k in keyof T]: (
                data?: Parameter<T[Extract<keyof T, string>]>,
                config?: AxiosRequestConfig,
            ) => AxiosPromise<ReturnType<T[Extract<keyof T, string>]>>;
        } = Object.create(null);

        for (const key in apiList) {
            if (Object.prototype.hasOwnProperty.call(apiList, key)) {
                const value = apiList[key] as string;
                let method: any = 'get';
                let url = value;
                const paramsArray = value.split(' ');
                if (paramsArray.length === 2) {
                    method = paramsArray[0];
                    url = paramsArray[1];
                }
                // 请求参数需要根据请求类型，分别处理为 params 或 data
                const paramsInData = !['get', 'delete'].includes(method.toLocaleLowerCase());
                api[key] = (data, config) => {
                    return request.request({
                        method,
                        url,
                        [paramsInData ? 'data' : 'params']: data,
                        ...config,
                    });
                };
            }
        }
        return api;
    };
};


const defaultRequestConfig: CrucioRequestConfig = {
    baseURL: '/api',
    timeout: 30 * 1000, // 超时限制 30秒
};

// 初始化 axios 实例
export const createRequestClient = (config: CrucioRequestConfig): AxiosInstance => {
    const { adapterOnError, interceptors, adapter, ...axiosConfig } = merge(
        {},
        defaultRequestConfig,
        config,
    );

    const axiosInstance = Axios.create({
        ...axiosConfig,
        adapter:
            adapter ||
            createAdapter({
                handleError: adapterOnError,
            }),
    });
    // 设置拦截器
    const { request, response } = interceptors || {};
    axiosInstance.interceptors.request.use(
        request?.onFulfilled ||
            createRequestInterceptor({
                middlewares: axiosConfig.middlewares,
            }),
        request?.onRejected,
    );
    axiosInstance.interceptors.response.use(response?.onFulfilled, response?.onRejected);

    // 注册一个 createApi
    registerCreateApi(axiosInstance);

    return axiosInstance;
};
