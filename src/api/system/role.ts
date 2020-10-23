import requests from '@/utils/request';

export const querySelectionRoles = () =>
    requests({
        url: '/system/role/query_roles_all',
        method: 'get',
    });

export const queryRoles = (params: any) =>
    requests({
        url: '/role/query_roles',
        method: 'get',
        params
    });

export const updateRole = (params: any) =>
    requests({
        url: '/role/update_role',
        method: 'post',
        params
    })

export const enableRole = (roleId: number) =>
    requests({
        url: '/role/enable/' + roleId,
        method: 'post'
    })

export const addRole = (params: any) =>
    requests({
        url: '/role/add_role',
        method: 'post',
        params
    })

export const updateRolePermission = (params: any) =>
    requests({
        url: '/role_permission/add_r_p',
        method: 'post',
        params
    })
