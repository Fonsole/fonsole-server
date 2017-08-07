import Vue from 'vue';
import Vuex from 'vuex';

import App from './App';
import store from './store';
import Localization from './localization';
import router from './router';

Vue.config.productionTip = false;
Vue.config.devtools = true;

Vue.use(Vuex);
Vue.use(Localization, store);

const vm = new Vue({
  components: { App },
  el: '#app',
  template: '<App/>',
  store,
  router,
});

// Initialize mobileInterface module
vm.$store.dispatch('init');
