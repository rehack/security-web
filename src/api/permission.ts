import requests from '@/utils/request'

export const queryPermissions = () =>
    requests({
        url: '/system/permission/query_permissions',
        method: 'get',
    })

export const queryPermission = (permissionId: number) =>
    requests({
        url: '/system/permission/query_permission/' + permissionId,
        method: 'get',
    })

export const updatePermission = (params: any) =>
    requests({
        url: '/system/permission/update_permission',
        method: 'post',
        params
    })

export const addPermission = (params: any) =>
    requests({
        url: '/system/permission/add_permission',
        method: 'post',
        params
    })

export const deletePermission = (permissionId: number) =>
    requests({
        url: '/system/permission/delete_permission/' + permissionId,
        method: 'delete',
    })

export const queryByRoleId = (roleId: number) =>
    requests({
        url: '/system/permission/query_per_by_role/' + roleId,
        method: 'get'
    })
