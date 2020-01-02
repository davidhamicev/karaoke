import Vue from 'vue'
import App from './App.vue'
import store from '@/store/admin.js'
import VueTabs from 'vue-nav-tabs'
import '@/normalize.scss'
import '@/assets/scss/fonts.scss'

Vue.config.productionTip = false

Vue.use(VueTabs)

new Vue({
	store,
	render: h => h(App)
}).$mount('#app')
