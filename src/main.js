import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueStorage from './plugins/storage'
import VueAxios from './plugins/axios'
import Element from 'element-ui'
import DateTimeFormat from './plugins/datetime'
import WebConfig from './web.config'
import store from './store'
import * as qiniu from 'qiniu-js'

Vue.config.productionTip = false;

/**
 * web配置文件
 */
Vue.webConfig = WebConfig;
Vue.prototype.$webConfig = WebConfig;
Vue.prototype.$winHeight = window.innerHeight;


/**
 * element
 */
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Element);

Vue.use(qiniu)
/**
 * 基础样式表
 */
import './assets/css/base.css'

/**
 * animate动画
 */
import 'animate.css/animate.min.css'


/**
 * Storage
 */
Vue.use(VueStorage);


/**
 * axios
 */
Vue.use(VueAxios, {router: router, element: Element});


/**
 * 时间扩展方法
 */
Vue.use(DateTimeFormat);


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
