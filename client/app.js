import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueAuth from '@websanova/vue-auth'
import NProgress from 'vue-nprogress'
import { sync } from 'vuex-router-sync'
import App from './App.vue'
import router from './router'
import store from './store'
import * as filters from './filters'
import { TOGGLE_SIDEBAR } from 'vuex-store/mutation-types'
import { api } from './api'
global.api = api

Vue.router = router

Vue.use(VueAxios, axios)
Vue.use(VueAuth, {
  auth: {
    request: function (req, token) {
      this.options.http._setHeaders.call(this, req, {Authorization: 'Bearer ' + token})
    },
    response: function (res) {
      // Get Token from response body
      // this.token('test', res.data.access_token);
      return res.data.access_token
    }
  },
  http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
  router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
  loginData: { url: 'http://localhost:8000/api/v1/auth', fetchUser: false },
  logoutData: { url: 'http://localhost:8000/api/v1/auth', method: 'POST', redirect: '/', makeRequest: false},
  refreshData: {url: 'http://localhost:8000/api/v1/auth', method: 'POST', enabled: false, interval: 30}
})

Vue.use(NProgress)

// Enable devtools
Vue.config.devtools = true

sync(store, router)

const nprogress = new NProgress({ parent: '.nprogress-container' })

const { state } = store

router.beforeEach((route, redirect, next) => {
  if (state.app.device.isMobile && state.app.sidebar.opened) {
    store.commit(TOGGLE_SIDEBAR, false)
  }
  next()
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

const app = new Vue({
  router,
  store,
  nprogress,
  ...App
})

// POST传参序列化
axios.interceptors.request.use((config) => {
  // console.log(config.url = 'test');
  // config.params.access_token = "-gF0w_e6ykO1WJbOeRS_AKeBzpiqqthlth9Vyo2s";
  return Promise.resolve(config);
},(error) =>{
  alert("错误的传参");
  return Promise.reject(error);
});

axios.interceptors.response.use((res) =>{
  if(res.status != '200'){
    return res;
  }
  return res;
}, (error) => {
  if(error.response.status == '401'){
    app.$auth.logout({
      // redirect: 'Home',
      makeRequest: false
      // params: {},
      // success: function () {},
      // error: function () {},
      // etc...
    })
    app.$router.push('/login');
  }
  else{
    console.log(error.response)
  }
  // alert("网络异常");
  // return res;
});
export { app, router, store }
