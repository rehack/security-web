import requests from '@/utils/request'

export const searchFromDb = (params: any) =>
    requests({
        url: '/search/sfdb',
        method: 'get',
        params
    });

export const removeOne = (fileId: string) =>
    requests({
        url: '/remover/deleteById/' + fileId,
        method: 'post',
    })

export const downloadById = (fileId: string) =>
    requests({
        url: '/downloader/downloadById/' + fileId,
        method: 'get',
        responseType: 'blob'
    })

export const downloadByIds = (params: any) =>
    requests({
        url: '/downloader/downloadByIds',
        method: 'get',
        responseType: 'blob',
        params
    })
