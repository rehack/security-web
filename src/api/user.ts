import requests from '@/utils/request'
import {AES_CBC_Decrypt, AES_CBC_Encrypt, RSA_Decrypt, RSA_Encrypt} from '@/utils/crypt';

export const doLogin = (params: any) =>
    requests({
        url: '/system/auth/login',
        method: 'post',
        params
    });

export const getUserInfo = () =>
    requests({
        url: '/order/auth/query_permissions',
        method: 'get'
    });

export const logout = () => {
    requests({
        url: '/order/auth/logout',
        method: 'post',
    })
};

export const refresh = (params: any) => {
    requests({
        url: '/system/auth/refresh',
        method: 'post',
        params
    })
};

