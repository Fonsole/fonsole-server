import NetworkingAPI from 'fonsole-networking/client';

const networking = new NetworkingAPI();

export default {
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
    async joinRoom(store, payload) {
      const { roomName } = await networking.joinRoom(payload.roomName);
      store.commit('setRoomName', roomName);
      return roomName;
    },
  },
};
