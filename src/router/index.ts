import {createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import hospitalRoutes from "@/router/modules/hospital"
import Dashboard from "@/views/dashboard/index.vue"

/** route.name: 组件名称,用于组件缓存
  * route.meta.title: 菜单标题,用于展示菜单和TagView的名称
 */

export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { title: '首页', root: true },
    children: [
      {
        name: 'dashboard',
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
