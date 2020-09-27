import {createRouter, createWebHistory, RouteRecordRaw, ScrollBehavior} from 'vue-router'
import Home from '../views/Home.vue'
import systemRoutes from "@/router/modules/system";
import orderRoutes from "@/router/modules/order";

export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/dashboard',
    name: '首页',
    component: () => import("@/views/dashboard/index.vue"),
    meta: { title: '首页', root: true },
    children: [
      {
        name: '系统首页',
        meta: { title: '系统首页', affix: true, hidden: true},
        path: '/dashboard',
        component: () => import("@/views/dashboard/index.vue"),
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
  ...systemRoutes,
  ...orderRoutes
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
