import axios from 'axios'
import { message } from "ant-design-vue";
import {AES_CBC_Decrypt, AES_CBC_Encrypt} from "@/utils/crypt";
import {RSA_Decrypt, RSA_Encrypt} from "@/utils/crypt";
import { UserModule} from "@/store/module/user";

const encryptModes = ['AES', 'RSA'];
const service = axios.create({
    headers: { 'content-type': 'application/json; charset=utf-8', 'Set-Cookie': 'widget_session=abc123; SameSite=None; Secure' },
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 10 * 1000
})

service.interceptors.request.use(
    (config) => {
        if (UserModule.hasAccessToken()) {
            config.headers.Authorization = `Bearer ${UserModule.access_token}`;
        }
        if (encryptModes.indexOf(process.env.VUE_APP_SECURITY_MODE) >= 0) {
            let data;
            switch (process.env.VUE_APP_SECURITY_MODE) {
                case encryptModes[0]:
                    data = {reqData: AES_CBC_Encrypt(JSON.stringify(config.data))};
                    break;
                case encryptModes[1]:
                    data = {reqData: RSA_Encrypt(JSON.stringify(config.data))};
                    break;
            }
            config.data = data;
        }
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
)

service.interceptors.response.use(
    (response) => {
        if (encryptModes.indexOf(process.env.VUE_APP_SECURITY_MODE) >= 0) {
            let res;
            switch (process.env.VUE_APP_SECURITY_MODE) {
                case encryptModes[0]:
                    res = JSON.parse(AES_CBC_Decrypt(response.data));
                    break;
                case encryptModes[1]:
                    res = JSON.parse(RSA_Decrypt(response.data));
                    break;
            };
            if (res.code != 200) {
                message.error("出错啦", 5);
                return Promise.reject(new Error(res.message || 'Error'))
            } else {
                return response.data;
            }
        }
        return response.data;
    },
    (error) => {
        message.error(error.message, 5);
        return Promise.reject(error)
    }
)

export default service
