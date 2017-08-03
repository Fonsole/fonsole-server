import NetworkingAPI from 'fonsole-networking/client';
import Vue from 'vue';
import Vuex from 'vuex';

import App from './App';
import Localization from './localization';
import router from './router';

Vue.use(Vuex);
Vue.config.productionTip = false;

const networking = new NetworkingAPI();
const store = new Vuex.Store({
  state: {
    roomName: '',
    currentGame: '',
  },
  mutations: {
    setRoomName: (state, roomName) => {
      state.roomName = roomName;
    },
    attachNetworkingApi: (state, frame) => {
      // eslint-disable-next-line no-underscore-dangle
      frame.__NetworkingAPI = networking.export();
    },
  },
  actions: {
    async joinRoom(state, payload) {
      const { roomName } = await networking.joinRoom(payload.roomName);
      state.commit('setRoomName', roomName);
      return roomName;
    },
  },
});

Vue.use(Localization, store);

// eslint-disable-next-line no-new
new Vue({
  components: { App },
  el: '#app',
  template: '<App/>',
  store,
  router,
  /*
  methods: {
    disconnect() {
      this.$state.mutations.disconnect();
    },
  },
  */
});
