import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd, { message, Form, notification } from 'ant-design-vue'
import axios from "axios"
import SvgIcon from "@/icon/SvgIcon.vue"
import '@/icon'
import '@/permission'

const app = createApp(App)

app.use(store).use(router).use(Antd).component('svg-icon', SvgIcon).mount('#app')
app.config.globalProperties.$message = message
app.config.globalProperties.$form = Form
app.config.globalProperties.$notification = notification
