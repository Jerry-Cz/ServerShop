// 入口文件

import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'
import axios from 'axios';
// 导入nprogress 进度条 组件样式
import NProgress from 'nprogress'
// 富文本编译器
import VueQuillEditor from 'vue-quill-editor'

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
Vue.prototype.$http = axios;

// 通过 axios 请求拦截器 请求头添加 token，保证拥有获取数据的权限
// 在 request请求拦截器中，展示进度条 NProgress.start(),优化项目
axios.interceptors.request.use(config => {
    NProgress.start();
    // console.log(config);
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config; //最后必须 return config
});
// 在 Response 响应拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
    NProgress.done()
    return config;
})
Vue.config.productionTip = false

// 树形列表
Vue.component('tree-table', TreeTable)


// 定义一个时间格式过滤器
Vue.filter('dataFormat', function(originVal) {
    const dt = new Date(originVal)

    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0');
    const d = (dt.getDate() + 1 + '').padStart(2, '0');

    const hh = (dt.getHours() + 1 + '').padStart(2, '0');
    const mm = (dt.getMinutes() + 1 + '').padStart(2, '0');
    const ss = (dt.getSeconds() + 1 + '').padStart(2, '0');

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

// 把富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')