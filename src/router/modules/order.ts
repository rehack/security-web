import {RouteRecordRaw} from "vue-router";
import Dashboard from "@/views/dashboard/index.vue";


export const orderRoutes: Array<RouteRecordRaw> = [
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
]

export default orderRoutes;
