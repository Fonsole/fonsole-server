import Vue from 'vue';
import Vuex from 'vuex';
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App.vue';
import router from './router';
import { PPlatform } from './network/pplatformclient';
import TAG from './network/tags';

Vue.use(Vuex);
Vue.use(BootstrapVue);
Vue.config.productionTip = false;

const gPlatform = new PPlatform();
const store = new Vuex.Store({
  state: {
    currentGame: 'menu',
  },
  mutations: {
    injectPlatform: (state, frame) => {
      gPlatform.injectAPI(frame);
    },
    joinRoom: (state, payload) => {
      gPlatform.Log('Join room');
      gPlatform.join(payload.roomname, payload.playername);
    },
    disconnect: () => {
      gPlatform.Log('Closing');
      gPlatform.disconnect();
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

gPlatform.addMessageListener((lTag, lContent) => {
  gPlatform.Log(`${lTag}: ${lContent}`);
  console.log(lTag);

  if (lTag === TAG.DISCONNECTED) {
    window.location.reload();
  }
});
