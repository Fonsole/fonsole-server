import Router from 'vue-router';
import Vue from 'vue';

// Routes
import Root from '@/components/index/Index';
import NotFound from '@/components/not-found/NotFound';
import Game from '@/components/game/Game';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', component: Root },
    { path: '/game/:game', component: Game },
    { path: '*', component: NotFound },
  ],
});
