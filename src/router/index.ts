import {createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import hospitalRoutes from "@/router/modules/hospital"
import Dashboard from "@/views/dashboard/index.vue"

export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/dashboard',
    name: '首页',
    component: Dashboard,
    meta: { title: '首页', root: true },
    children: [
      {
        name: '系统首页',
        meta: { title: '系统首页', affix: true, hidden: true},
        path: '/dashboard',
        component: () => import("@/views/Home.vue"),
      }
    ]
  },
  {
    path: '/login',
    name: '登录',
    component: () => import("@/views/login/index.vue"),
    meta: {title: '登录', hidden: true}
  }
]

export const asyncRoutes: Array<RouteRecordRaw> = [
  ...hospitalRoutes
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
