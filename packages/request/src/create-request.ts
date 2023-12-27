import queryString from 'query-string';
import { createRequestClient } from './create-request-client';
import type { CrucioRequestConfig, PendingTask } from '../types';
import { AxiosInstance } from 'axios';
import defaultErrorHandler from './default-error-handler';

let refreshing = false;
const queue: PendingTask[] = [];



export const createRequest = (config: CrucioRequestConfig = {}): AxiosInstance => {
    const request = createRequestClient({
        paramsSerializer: function (params) {
            return queryString.stringify(params, { arrayFormat: 'comma' });
        },
        adapterOnError: (err) => {
            defaultErrorHandler(err, {
                env: '',
                config: {},
            })
        },
        ...config,
    });

    async function refreshToken() {
        const res = await request.get('/refresh', {
            params: {
              token: localStorage.getItem('refresh_token')
            }
        });
        localStorage.setItem('access_token', res.data.accessToken);
        localStorage.setItem('refresh_token', res.data.refreshToken);
        return res;
    }

    request.interceptors.response.use(
        (res) => res,
        async (err) => {
            let { data, config } = err.response;

            if (refreshing) {
                return new Promise((resolve) => {
                    queue.push({
                        config,
                        resolve
                    });
                });
            }
            if (data.statusCode === 401 && !config.url.includes('/refresh')) {
                refreshing = true;
                // TODO: refreshToken 待对接
                const res = await refreshToken();
                refreshing = false;
                if (res.status === 200) {
                    queue.forEach(({ config, resolve }) => {
                        resolve(request(config))
                    })
                    return request(config);
                } else {
                    console.log(data || '登录过期，请重新登录');
                }
            } else {
                return Promise.reject(err);
            }
            // err.preventDefault?.();
        },
    );
    return request;
};
