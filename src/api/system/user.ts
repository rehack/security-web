import requests from '@/utils/request'
import {AES_CBC_Decrypt, AES_CBC_Encrypt, RSA_Decrypt, RSA_Encrypt} from '@/utils/crypt';

export const doLogin = (params: any) =>
    requests({
        url: '/system/auth/login',
        method: 'post',
        data: {'reqData': RSA_Encrypt(params)}
    });

export const getUserInfo = () =>
    requests({
        url: '/order/auth/query_permissions',
        method: 'get',
    });

export const doLogout = () =>
    requests({
        url: '/order/auth/logout',
        method: 'post',
    });

export const refresh = (params: any) =>
    requests({
        url: '/system/auth/refresh',
        method: 'post',
        params,
    });

export const queryUsers = (params: any) =>
    requests({
        url: '/user/query_user',
        method: 'get',
        params,
    });

export const updateUser = (params: any) =>
    requests({
        url: '/user/update_user',
        method: 'post',
        params,
    });

export const enableUser = (userId: number) =>
    requests({
        url: '/user/enable/' + userId,
        method: 'post'
    });

export const addUser = (params: any) =>
    requests({
        url: '/user/create_user',
        method: 'post',
        params
    });

export const updatePassword = (params: any) =>
    requests({
        url: '/user/update_password',
        method: 'post',
        params,
    });
