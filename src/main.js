import NetworkingAPI from 'fonsole-networking/client';
import Vue from 'vue';
import Vuex from 'vuex';
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App.vue';
import router from './router';

Vue.use(Vuex);
Vue.use(BootstrapVue);
Vue.config.productionTip = false;

const networking = new NetworkingAPI();

const store = new Vuex.Store({
  state: {
    currentGame: 'menu',
  },
  mutations: {
    injectPlatform: (state, frame) => {
      networking.injectAPI(frame);
    },
    setName: (state, name) => {
      networking.playername = name;
    },
    joinRoom: (state, payload) => {
      networking.joinRoom(payload.roomname);
    },
  },
});

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  /*
  methods: {
    disconnect() {
      this.$state.mutations.disconnect();
    },
  },
  */
});
