export default [
  {
    path: '/goods',
    name: 'goods',
    redirect:"/goods/list",
    component: () => import(/* webpackChunkName: "goods" */  '../views/home/Index.vue'),
  },
  {
    path: '/goods/list',
    name: 'goodsList',
    component: () => import(/* webpackChunkName: "goodsList" */  '../views/goods/List.vue'),
  },
  {
    path: '/goods/index',
    name: 'goodsIndex',
    component: () => import(/* webpackChunkName: "goodsIndex" */  '../views/goods/Index.vue'),
  },
  {
    path: '/goods/edit',
    name: 'goodsEdit',
    component: () => import(/* webpackChunkName: "goodsEdit" */  '../views/goods/Edit.vue'),
  },
  {
    path: '/goods/editDetail',
    name: 'goodsEditDetail',
    component: () => import(/* webpackChunkName: "goodsEditDetail" */  '../views/goods/EditDetail.vue'),
  },
  {
    path: '/goods/update',
    name: 'goodsUpdate',
    component: () => import(/* webpackChunkName: "goodsUpdate" */  '../views/goods/Update.vue'),
  },
  {
    path: '/goods/virtualEdit',
    name: 'goodsVirtualEdit',
    component: () => import(/* webpackChunkName: "goodsVirtualEdit" */  '../views/goods/VirtualEdit.vue'),
  },
  {
    path: '/goods/video/list',
    name: 'goodsVideoList',
    component: () => import(/* webpackChunkName: "goodsVideoList" */  '../views/goods/video/List.vue'),
  },
  {
    path: '/goods/video/add',
    name: 'goodsVideoAdd',
    component: () => import(/* webpackChunkName: "goodsVideoAdd" */  '../views/goods/video/Add.vue'),
  },
  {
    path: '/goods/video/update',
    name: 'goodsVideoUpdate',
    component: () => import(/* webpackChunkName: "goodsVideoUpdate" */  '../views/goods/video/Update.vue'),
  }
  
  
]
