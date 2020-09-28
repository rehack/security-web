import {RouteRecordRaw} from "vue-router";
import Dashboard from "@/views/dashboard/index.vue";


export const orderRoutes: Array<RouteRecordRaw> = [
    {
        path: '/order',
        meta: { hidden: false, title: "订单中心" },
        component: Dashboard,
        children: [
            {
                path: '/order/order-info',
                name: 'order-info',
                meta: {hidden: false, title: "订单信息"},
                component: () => import('@/views/order/order-info.vue')
            }
        ]
    },
]

export default orderRoutes;
