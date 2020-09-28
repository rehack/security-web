import requests from '@/utils/request';

export const querySelectionRoles = () =>
    requests({
        url: '/system/role/query_roles_all',
        method: 'get',
    });

export const queryRoles = (params: any) =>
    requests({
        url: 'system/role/query_roles',
        method: 'get',
        params
    });
