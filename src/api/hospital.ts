import requests from '@/utils/request'

export const queryHospitals = (params: any) =>
    requests({
        url: '/ms_hospital/q_hospitals',
        method: 'get',
        params
    })

export const addHospital = (params: any) =>
    requests({
        url: '/ms_hospital/a_hospital',
        method: 'post',
        params
    })

export const updateHospital = (params: any) =>
    requests({
        url: '/ms_hospital/u_hospital',
        method: 'post',
        params
    })

export const deleteHospital = (hsId: any) =>
    requests({
        url: '/ms_hospital/d_hs_goods/' + hsId,
        method: 'post'
    })

export const queryGoodsList = (params: any) =>
    requests({
        url: '/ms_hospital/q_ms_goods',
        method: 'get',
        params
    })

export const updateHospitalData = (hsId: any) =>
    requests({
        url: '/ms_goods/u_hospital_data/' + hsId,
        method: 'post'
    })
