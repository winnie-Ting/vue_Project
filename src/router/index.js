import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/users/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import GoodsList from '../components/goods/List.vue'
import Add from '../components/goods/Add.vue'
import Order from '../components/order/Order.vue'
import Report from '../components/report/Report.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/login'
},
{
  path: '/login', // 设置访问路径
  component: Login
},
{
  path: '/home',
  component: Home,
  redirect: '/welcome',
  children: [{
    path: '/welcome',
    component: Welcome
  },
  {
    path: '/users',
    component: Users
  },
  {
    path: '/rights',
    component: Rights
  },
  {
    path: '/roles',
    component: Roles
  },
  {
    path: '/categories',
    component: Cate
  },
  {
    path: '/params',
    component: Params
  },
  {
    path: '/goods',
    component: GoodsList
  },
  {
    path: '/goods/add',
    component: Add
  },
  {
    path: '/orders',
    component: Order
  },
  {
    path: '/reports',
    component: Report
  }
  ]
}
]

const router = new VueRouter({
  routes
})

export default router

// 挂载路由导航控制访问权限
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
