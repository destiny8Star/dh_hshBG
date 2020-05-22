export default [
  {
    path: '/home',
    name: 'adminHome',
    component: () => import(/* webpackChunkName: "adminHome" */  '../views/home/Index.vue'),
  },
]
