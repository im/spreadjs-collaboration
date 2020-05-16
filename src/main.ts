import Vue from 'vue'
import App from 'components/pages/app'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.use(_Vue => {
    _Vue.prototype.$bus = new Vue()
})


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
