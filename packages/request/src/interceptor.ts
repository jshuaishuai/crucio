import { AxiosRequestConfig } from 'axios';

/**
 * 合并中间件
 * @param middlewares
 * @returns
 */
const composeMiddlewares = (
    middlewares: ((
        config: AxiosRequestConfig,
    ) => Promise<AxiosRequestConfig> | AxiosRequestConfig)[],
) => {
    const total = middlewares.length;
    return async function (config: AxiosRequestConfig) {
        async function dispatch(i) {
            if (i === total) return config;
            const fn = middlewares[i];
            config = await fn(config);
            return dispatch(i + 1);
        }

        return dispatch(0);
    };
};

// 默认中间件
export const createDefaultMiddlewares = () => {
    // const o2cli = createOauth2Client();
    const authorizationHeaderMiddleware = async (config) => {
        // const authorizationHeader = await o2cli.getAuthorizationHeader();
        // if (authorizationHeader) {
        //     config.headers.Authorization = authorizationHeader;
        // }
        return config;
    };


    return [authorizationHeaderMiddleware];
};

// 请求拦截器
export const createRequestInterceptor = (config: {
    middlewares?: ((
        config: AxiosRequestConfig,
    ) => Promise<AxiosRequestConfig> | AxiosRequestConfig)[];
}) => {
    const { middlewares = [] } = config;
    const defaultMiddlewares = createDefaultMiddlewares();

    return composeMiddlewares([...defaultMiddlewares, ...middlewares]);
};
