import Vue from 'vue'
import Router from 'vue-router'
import homeRouter from "./router/homeRouter";
import orderRouter from "./router/orderRouter";
import goodsRouter from "./router/goodsRouter";//商品管理模块
import operatingRouter from "./router/operatingRouter";//商品管理模块

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*', name: '404', component: () => import(/* webpackChunkName: "404" */ "./views/NotFound.vue")
    },
    {
      path: '/', name: 'logon', component: () => import(/* webpackChunkName: "logon" */ "./views/Logon.vue")
    },
    {
      path: '/admin', name: 'admin', component: () => import(/* webpackChunkName: "admin" */ "./views/Admin.vue"),
      children: [...homeRouter, ...goodsRouter, ...orderRouter, ...operatingRouter]
    }
  ]
})

router.beforeEach((to, from, next) => {
  let token = Vue.ls.get(Vue.webConfig.authTokenName);
  if (!token) {
    if (to.name == 'logon' || to.name=='whiteList') {
      next()
    } else {
      next({name: 'logon'})
    }
  }else {
    next();
  }
});

export default router