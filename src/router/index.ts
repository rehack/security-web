import {createRouter, createWebHistory, RouteRecordRaw, ScrollBehavior} from 'vue-router'
import Home from '../views/Home.vue'

export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    meta: {hidden: true},
    component: () => import('@/views/login/index.vue')
  },
  {
    path: "/",
    meta: {},
    component: () => import("@/views/dashboard/index.vue")
  }
]

export const asyncRoutes: Array<RouteRecordRaw> = [

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
