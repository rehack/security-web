import { RouteRecordRaw } from "vue-router"
import Dashboard from "@/views/dashboard/index.vue"

export const fileRoutes: Array<RouteRecordRaw> = [
    {
        path: '/file',
        meta: { hidden: false, title: "文件中心" },
        component: Dashboard,
        children: [
            {
                path: '/file/file-db',
                name: 'file-DB',
                meta: { hidden: false, title: "文件管理" },
                component: () => import('@/views/file/index.vue')
            }
        ]
    },
]

export default fileRoutes
