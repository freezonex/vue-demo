// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import {http,login } from './util/http'
Vue.prototype.$http = http

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

Vue.config.productionTip = false
// 进入页面前先进行登录凭证验证
login(() => {
  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
})
