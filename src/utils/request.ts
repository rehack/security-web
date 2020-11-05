import axios, {AxiosRequestConfig, AxiosResponse} from 'axios'
import { message } from "ant-design-vue"
import { UserModule} from "@/store/module/user"
import router from "@/router"

const service = axios.create({
    headers: { 'content-type': 'application/json; charset=utf-8' },
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 500 * 1000,
    withCredentials: true
})

service.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        if (UserModule.hasAccessToken()) {
            config.headers.Authorization = `${UserModule.access_token}`
        }
        return config
    },
    (error) => {
        Promise.reject(error)
    }
)

service.interceptors.response.use(
    (response: AxiosResponse) => {
        const res: any = response.data
        if (res.code) {
            res.code = parseInt(res.code)
        }
        if (res.size && res.type) {
            return Promise.resolve(res)
        }
        if (res.code === 95 || res.code === 96 || res.code === 201) {
            message.error(res.msg, 5 )
            router.replace('/login')
            return Promise.reject(res)
        } else if (res.code !== 200) {
            if (res.code !== 101) {
                message.error(res.msg || 'Error', 5)
                return Promise.resolve(res)
            } else {
                message.error(res.msg, 5)
                return Promise.resolve(res)
            }
        } else {
            return Promise.resolve(res)
        }
    },
    (error) => {
        message.error(error.message, 5)
        return Promise.reject(error)
    }
)

export default service
