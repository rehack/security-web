import {RouteRecordRaw} from "vue-router";
import Dashboard from "@/views/dashboard/index.vue";

export const systemRoutes: Array<RouteRecordRaw> = [
    {
        path: '/system',
        component: Dashboard,
        meta: { title: "系统管理", icon: 'user-outlined' },
        children: [
            {
                path: '/system/user',
                name: '用户管理',
                meta: { title: '用户管理' },
                component: () => import("@/views/system/user/index.vue")
            },
            {
                path: '/system/role',
                name: '角色管理',
                meta: { title: "角色管理" },
                component: () => import("@/views/system/role/index.vue")
            },
            {
                path: '/system/permission',
                name: '权限管理',
                meta: { title: "权限管理" },
                component: () => import("@/views/system/permission/index.vue")
            }
        ]
    }
]

export default systemRoutes;
