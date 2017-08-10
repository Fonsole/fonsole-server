import Vue from 'vue';
import store from '@/store';
import Home from '@/components/Home/Home';

describe('Home.vue', () => {
  const vm = new Vue({
    el: document.createElement('div'),
    render: h => h(Home),
    store,
  }).$mount();

  it('should render HomeDesktop on desktops', async () => {
    store.commit('setMobile', false);
    await Vue.nextTick();
    expect(vm.$el.querySelector('div > h2').textContent).to.contain('TODO');
  });

  it('should render HomeMobileJoin by default on phones', async () => {
    store.commit('setMobile', true);
    await Vue.nextTick();
    expect(vm.$el.querySelector('div > input')).to.exist;
  });
});
