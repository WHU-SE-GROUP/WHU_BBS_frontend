import { createApp } from 'vue';
import App from './App';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import * as Icons from '@ant-design/icons-vue';
import router from './router';
import store from './store';
import '@/assets/css/main.css';
import '@/assets/font/font.css';
import '@/assets/icon/iconfont.css';
import '@/service/axios';
import moment from 'moment';
import './assets/css/main.less';
import utils from './utils/utils';
import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';

const app = createApp(App);
app.config.globalProperties.$utils = utils;
app.config.globalProperties.$moment = moment;
app.config.globalProperties.$t = store.state.translate.bind(store.state);

// 全局注册图标组件
const icons = Icons;
for (const i in icons) {
    app.component(i, icons[i]);
}

app
    .use(Antd)
    .use(store)
    .use(router)
    .use(mavonEditor)
    .mount('#app');