import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Antd from 'ant-design-vue';
import axios from "axios";
import SvgIcon from "@/icon/SvgIcon.vue";

const app = createApp(App);

app.use(store).use(router).use(Antd).component('svg-icon', SvgIcon).mount('#app');
