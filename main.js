import Vue from 'vue'
import App from './App'
import wxRequest from 'wechat-request';
import * as filters from '@/filters/index'
import store from './store'
import validate from './util/validate.js'
import debounce from './util/debounce.js'

// wxRequest.defaults.baseURL = "https://funnyduck.raysler.com/rentbird";
wxRequest.defaults.baseURL = "https://funnyduck.raysler.com/rentbird_test";//测试地址
// wxRequest.defaults.baseURL = "http://192.168.10.184:8889";
wxRequest.defaults.headers.post['Content-Type'] = 'application/json';
Vue.prototype.$baseUrl = "https://funnyduck.raysler.com/rentbird";
Vue.prototype.$store = store;
Vue.prototype.$validate = validate;
Vue.config.productionTip = false;
Vue.prototype.$request = wxRequest;
Vue.prototype.$debounce = debounce;


App.mpType = 'app'

Object.keys(filters).forEach(key => {
  console.log(key)
  Vue.filter(key, filters[key])
})

const app = new Vue({
  store,
  ...App
})
app.$mount()
