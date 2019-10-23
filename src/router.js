import Vue from 'vue'
import Router from 'vue-router'
// 路由懒加载
const Login = () =>
    import ( /* webpackChunkName:"login_home_welcome" */ './components/Login.vue')
    // import Login from './components/Login.vue'
const Home = () =>
    import ( /* webpackChunkName:"login_home_welcome" */ './components/Home.vue')
    // import Home from './components/Home.vue'
const WelCome = () =>
    import ( /* webpackChunkName:"login_home_welcome" */ './components/WelCome.vue')
    // import WelCome from './components/WelCome.vue'

const Users = () =>
    import ( /* webpackChunkName:"Users_Rights_Roles" */ './components/user/users.vue')
    // import Users from './components/user/users.vue'
const Rights = () =>
    import ( /* webpackChunkName:"Users_Rights_Roles" */ './components/power/Rights.vue')
    // import Rights from './components/power/Rights.vue'
const Roles = () =>
    import ( /* webpackChunkName:"Users_Rights_Roles" */ './components/power/Roles.vue')
    // import Roles from './components/power/Roles.vue'

const Cate = () =>
    import ( /* webpackChunkName:"Cate_Params" */ './components/goods/Cate.vue')
    // import Cate from './components/goods/Cate.vue'
const Params = () =>
    import ( /* webpackChunkName:"Cate_Params" */ './components/goods/Params.vue')
    // import Params from './components/goods/Params.vue'

const Goods = () =>
    import ( /* webpackChunkName:"Goods_Add" */ './components/goods/Goods.vue')
    // import Goods from './components/goods/Goods.vue'
const Add = () =>
    import ( /* webpackChunkName:"Goods_Add" */ './components/goods/Add.vue')
    // import Add from './components/goods/Add.vue'

const Order = () =>
    import ( /* webpackChunkName:"Order_Report" */ './components/order/Order.vue')
    // import Order from './components/order/Order.vue'
const Report = () =>
    import ( /* webpackChunkName:"Order_Report" */ './components/report/Report.vue')
    // import Report from './components/report/Report.vue'
    // 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'

Vue.use(Router)

const router = new Router({
    routes: [
        { path: '/', component: Login }, // 路由重定向
        { path: '/login', component: Login },
        {
            path: '/home',
            component: Home,
            redirect: '/welcome', //redirect 路由重定向
            children: [
                { path: '/welcome', component: WelCome },
                { path: '/users', component: Users },
                { path: '/rights', component: Rights },
                { path: '/roles', component: Roles },
                { path: '/categories', component: Cate },
                { path: '/params', component: Params },
                { path: '/goods', component: Goods },
                { path: '/goods/add', component: Add },
                { path: '/orders', component: Order },
                { path: '/reports', component: Report }
            ]
        }
    ]
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // to 将要访问的路径
    // from 代表从哪个路径跳转而来
    // next 是一个函数，表示放行
    // next() 放行 next('/login') 强制跳转
    if (to.path === '/login') return next()
        // 获取 token
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})

export default router