import UAParser from 'ua-parser-js';

export default {
  state: {
    isMobile: true,
  },
  mutations: {
    setMobile: (state, isMobile) => { state.isMobile = isMobile; },
  },
  actions: {
    init({ commit }) {
      // Create user agent parser instance and parse user agent
      const uaParser = new UAParser(navigator.userAgent);
      // Get device info from user agent
      const deviceInfo = uaParser.getDevice();
      // If we device's type is mobile|tablet|console it's considered as a controller
      const isMobile = deviceInfo && (deviceInfo.type === 'mobile' || deviceInfo.type === 'tablet' || deviceInfo.type === 'console');
      commit('setMobile', isMobile);
    },
  },
};
