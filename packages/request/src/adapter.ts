import type { AxiosError } from 'axios';
import {
    compose,
    defaultRequest,
    RESTful,
    pagination,
    preventDefault,
} from 'galaxy-axios-adapter';

const preventDefaultMiddleware = (
    handleError?: (err: AxiosError) => void,
) =>
    preventDefault({
        onError(err: AxiosError) {
            // 请求被 abort，直接跳过
            if (err.code === 'ECONNABORTED') {
                return;
            }
            if (handleError) {
                handleError(err);
            }
        },
    });

// 生成适配器
export const createAdapter = ({ handleError }) =>
    compose(
        preventDefaultMiddleware(handleError),
        RESTful(),
        pagination(),
        defaultRequest(),
    );
