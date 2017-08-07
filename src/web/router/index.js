import Router from 'vue-router';
import Vue from 'vue';

// Routes
import Home from '@/components/Home/Home';
import NotFound from '@/components/NotFound/NotFound';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', component: Home },
    { path: '/:room', component: Home },
    { path: '*', component: NotFound },
  ],
});
