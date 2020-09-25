import {createRouter, createWebHistory, RouteRecordRaw, ScrollBehavior} from 'vue-router'
import Home from '../views/Home.vue'
import systemRoutes from "@/router/modules/system";

export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: '登录',
    meta: { hidden: false, title: "登录"},
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/',
    redirect: '/dashboard',
    name: '首页',
    component: () => import("@/views/dashboard/index.vue"),
    meta: { title: '首页', hidden: true },
    children: [
      {
        name: '系统首页',
        meta: { title: '系统首页', affix: true},
        path: '/dashboard',
        component: () => import("@/views/dashboard/index.vue"),
      }
    ]
  }
]

export const asyncRoutes: Array<RouteRecordRaw> = [
  {
    path: '/order-center',
    name: '订单中心',
    meta: {hidden: false, title: "订单中心", icon: 'user-outlined'},
    component: () => import('@/views/dashboard/index.vue'),
    children: [
      {
        path: '/order-center/order',
        name: '订单',
        meta: {hidden: false, title: "订单信息"},
        component: () => import('@/views/dashboard/index.vue')
      }
    ]
  },
  {
    path: '/test',
    name: '测试',
    meta: { hidden: false, title: "测试" },
    component: () => import('@/views/dashboard/index.vue')
  },
  ...systemRoutes
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
