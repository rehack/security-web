import requests from '@/utils/request'

export const doLogin = (params: any) =>
    requests({
        url: '/auth/login',
        method: 'post',
        params
    })

export const getUserInfo = () =>
    requests({
        url: '/user/query_my_permissions',
        method: 'get',
    })

export const doLogout = () =>
    requests({
        url: '/auth/logout',
        method: 'post',
    })

export const refresh = (params: any) =>
    requests({
        url: '/system/auth/refresh',
        method: 'post',
        params,
    })

export const queryUsers = (params: any) =>
    requests({
        url: '/system/user/query_user',
        method: 'get',
        params,
    })

export const updateUser = (params: any) =>
    requests({
        url: '/system/user/update_user',
        method: 'post',
        params,
    })

export const enableUser = (userId: number) =>
    requests({
        url: '/system/user/enable/' + userId,
        method: 'post'
    })

export const addUser = (params: any) =>
    requests({
        url: '/system/user/create_user',
        method: 'post',
        params
    })

export const updatePassword = (params: any) =>
    requests({
        url: '/system/user/update_password',
        method: 'post',
        params,
    })
