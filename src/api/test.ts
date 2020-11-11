import requests from '@/utils/request'

export const roleTestOr = () =>
    requests({
        url: '/test/role_test_or',
        method: 'get',
    })


export const roleTestAnd = () =>
    requests({
        url: '/test/role_test_and',
        method: 'get',
    })

export const permissionTestForbidden = () =>
    requests({
        url: '/test/permission_test_forbiden',
        method: 'get',
    })


export const permissionTestOr = () =>
    requests({
        url: '/test/permission_test_or',
        method: 'get',
    })

export const getToken = (params: any) =>
    requests({
        url: '/oauth/code',
        method: 'get',
        params
    })

