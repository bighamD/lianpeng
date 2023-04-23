import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import 'lib-flexible'
import '@/icons' // icon
import './permission.js'
import '@/assets/index.less' // global css
import { Lazyload } from 'vant'

if (process.env.NODE_ENV === 'development') {
  try {
    const VConsole = require('vconsole')
    new VConsole()
  } catch (error) {
  }
}

Vue.use(Lazyload)
// 注册时可以配置额外的选项
Vue.use(Lazyload, {
  lazyComponent: true
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
