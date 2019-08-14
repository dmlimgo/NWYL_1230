import Vue from 'vue'
import axios from 'axios'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'font-awesome/css/font-awesome.min.css'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

Vue.config.productionTip = false
Vue.prototype.$http = axios

Vue.use(Vuetify, {
	iconfont: 'fa',
	theme: {
		primary: '#3f51b5',
		secondary: '#b0bec5',
		accent: '#8c9eff',
		error: '#b71c1c'
	}
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

export const eventBus = new Vue({
	methods: {
		menuSended(date) {
			this.$emit('menuSended', date)
		}
	}
})
