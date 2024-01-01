import queryString from 'query-string';
import { createRequestClient } from './create-request-client';
import type { CrucioRequestConfig } from '../types';
import { AxiosInstance } from 'axios';
import defaultErrorHandler from './default-error-handler';





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


    return request;
};
