import requests from '@/utils/request';

export const queryPermissions = () =>
    requests({
        url: '/system/permission/query_permissions',
        method: 'get',
    });

export const queryPermission = (permissionId: number) =>
    requests({
        url: '/system/permission/query_permission/' + permissionId,
        method: 'get',
    });
