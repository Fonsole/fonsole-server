import Router from 'vue-router';
import Vue from 'vue';

// Routes
import Root from './Root.vue';
import NotFound from './NotFound.vue';
import Game from './Game.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', component: Root },
    { path: '/game/:game', component: Game },
    { path: '*', component: NotFound },
  ],
});
