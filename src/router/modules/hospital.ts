import {RouteRecordRaw} from "vue-router"
import Dashboard from "@/views/dashboard/index.vue"

export const hospitalRoutes: Array<RouteRecordRaw> = [
    {
        path: '/hospital',
        meta: { hidden: false, title: "医院数据" },
        component: Dashboard,
        children: [
            {
                path: '/hospital/hospital-goods',
                name: 'hospital-goods',
                meta: {hidden: false, title: "医院数据"},
                component: () => import('@/views/hospital/index.vue')
            }
        ]
    },
]

export default hospitalRoutes
