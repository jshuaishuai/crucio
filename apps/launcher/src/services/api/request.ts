import { createRequest, type PendingTask } from '@crucio/request';

import Config from './config';

// 判断当前环境
const isDevelopment = __DEV__;

// 根据环境选择配置
const environmentConfig = isDevelopment ? Config.development : Config.production;

const crucioRequest = createRequest({
    baseURL: environmentConfig.baseURL,
});

const apis = {
     // 获取用户配置
     getUserSetting: 'GET /user-settings/:key',
     // 增加用户配置
     setUserSetting: 'POST /user-settings/:key',
     // 获取系统配置
     getSystemConfig: 'GET /dict',
}
export const crucioApi = crucioRequest.createApi(apis);

let refreshing = false;
const queue: PendingTask[] = [];
async function refreshToken() {
    const res = await crucioRequest.get('/refresh', {
        params: {
        //   token: localStorage.getItem('refresh_token')
        }
    });
    // localStorage.setItem('access_token', res.data.accessToken);
    // localStorage.setItem('refresh_token', res.data.refreshToken);
    return res;
}

crucioRequest.interceptors.response.use(
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
                    resolve(crucioRequest(config))
                })
                return crucioRequest(config);
            } else {
                console.log(data || '登录过期，请重新登录');
            }
        } else {
            return Promise.reject(err);
        }
        // err.preventDefault?.();
    },
);
