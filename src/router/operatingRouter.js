export default[
    {
        path:"/operating",
        name:"operating",
        redirect:"/operating/freight",
        component:()=>import(/*webpackChunkName: 'operating' */ '../views/operating/Freight.vue')
    },
    {
        path: "/operating/freight",
        name: "operatingFreight",
        component: () => import(/*webpackChunkName: 'operating' */ '../views/operating/Freight.vue')
    },
    {
        path: "/operating/freight/add",
        name: "operatingFreight",
        component: () => import(/*webpackChunkName: 'operating' */ '../views/operating/AddFreight.vue')
    }
]