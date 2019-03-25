import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
import router from './router'
import axios from 'axios'
import { AlertPlugin,DatetimePlugin,ToastPlugin,LoadingPlugin,XImg } from 'vux'
import store from './store/index'
import { Tree } from 'element-ui'
import common from './assets/js/common'
// import vconsole from './vconsole/vconsole'

Vue.prototype.$common = common
Vue.prototype.axios = axios
Vue.component('x-img', XImg)
Vue.use(LoadingPlugin)
Vue.use(AlertPlugin)
Vue.use(DatetimePlugin)
Vue.use(VueRouter)
Vue.use(Tree)
Vue.use(ToastPlugin)

FastClick.attach(document.body)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    console.log('登录，绑定',store.state);
    if (store.state.token.length > 0) {  // 通过store获取当前的token是否存在
      next();
    }else {
      next({
        path: '/login',
        query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  }
  else {
    next();
  }
});

router.afterEach((to,from,next) => {
  window.scrollTo(0,0);
});

axios.interceptors.request.use(function (config) {
  if(store.state.token){
    config.headers['AuthToken'] = store.state.token;
  }
  config.headers['Accept'] = 'application/json';
  return config;
}, function (error) {
  return Promise.reject(error);
});
