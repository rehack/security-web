import requests from '@/utils/request';

export const querySelectionRoles = () =>
    requests({
        url: '/system/role/query_roles_all',
        method: 'get'
    })
