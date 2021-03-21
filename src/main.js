import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueResource from 'vue-resource';
import BaiduMap from 'vue-baidu-map';
import Vs from 'd3-vs';
import Router from 'vue-router';
Vue.config.productionTip = false
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(ElementUI);
Vue.use(VueResource);
Vue.use(BaiduMap,{
  ak:'EyKVsKKwi5GsVIxkUV1ZHQkXENUcU9Qj'
});
Vue.use(Vs);
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
