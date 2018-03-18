import Vue from 'vue'
import VueRouter from 'vue-router';
import wysiwyg from "vue-wysiwyg"
import App from './App.vue'
import router from './routes'

Vue.use(VueRouter)
Vue.use(wysiwyg, {
  hideModules: {
    image: true,
    table: true,
    removeFormat: true
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
