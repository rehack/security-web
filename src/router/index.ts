import {createRouter, createWebHistory, RouteRecordRaw, ScrollBehavior} from 'vue-router'
import Home from '../views/Home.vue'

export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: '登录',
    meta: { hidden: false, title: "登录"},
    component: () => import('@/views/login/index.vue')
  },
  {
    path: "/",
    meta: { hidden: false, title: "Dashboard" },
    component: () => import("@/views/dashboard/index.vue")
  },
  {
    path: '/test',
    name: '测试',
    meta: { hidden: false, title: "测试" },
    component: () => import('@/views/dashboard/index.vue')
  }
]

export const asyncRoutes: Array<RouteRecordRaw> = [
  {
    path: '/dashboard',
    name: '首页',
    meta: { hidden: false, title: "Dashboard" },
    component: () => import('@/views/dashboard/index.vue'),
    children: [
      {
        path: '/order',
        name: '订单',
        meta: { hidden: false, title: "订单信息"},
        component: () => import('@/views/dashboard/index.vue')
      }
    ]
  }
]

const createRoutes = () => createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: constantRoutes
});

const router = createRoutes()

export function resetRouter() {
  const newRouter = createRoutes();
  (router as any).matcher = (newRouter as any).matcher
}

export default router
