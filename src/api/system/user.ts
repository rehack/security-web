import requests from '@/utils/request'
import {AES_CBC_Decrypt, AES_CBC_Encrypt, RSA_Decrypt, RSA_Encrypt} from '@/utils/crypt';

export const doLogin = (params: any) =>
    requests({
        url: '/oauth/login',
        method: 'post',
        params
    });

export const getUserInfo = () =>
    requests({
        url: '/oauth/get_user_info',
        method: 'get',
    });

export const doLogout = (params: any) =>
    requests({
        url: '/oauth/logout',
        method: 'get',
        params
    });

export const refresh = (params: any) =>
    requests({
        url: '/auth/refresh',
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

export const deleteUser = (userId: any) =>
    requests({
        url: '/user/delete_user/' + userId,
        method: 'delete'
    })
