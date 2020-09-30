import requests from '@/utils/request';

export const calculateUserLogInfo = (params: any) =>
    requests({
        url: '/system/user_log/calculate',
        method: 'get',
        params
    })
