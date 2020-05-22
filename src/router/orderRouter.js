export default[
    {
        path:"/order",
        name:"order",
        redirect:"/order/list",
        component: () => import(/*webpackChunkName: "order" */ '../views/order/List.vue'),
    },
    {
        path:"/order/list",
        name:"orderList",
        component:()=>import(/*webpackChunkName: "orderList" */ '../views/order/List.vue')
    },
    {
        path: "/order/list/detail",
        name: "orderListDetail",
        component: () => import(/*webpackChunkName: "orderList" */ '../views/order/Detail.vue')
    }
]