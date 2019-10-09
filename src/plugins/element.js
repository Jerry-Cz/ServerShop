import Vue from 'vue'
// Message 弹框提示
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

// 把 Message弹框组件挂载到 vue 原型对象上
Vue.prototype.$message = Message