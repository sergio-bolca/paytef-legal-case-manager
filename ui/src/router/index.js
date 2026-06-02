import { createRouter, createWebHistory }   from 'vue-router';
import { useAuthStore }                     from '../stores/auth';

import LoginView        from '../views/LoginView.vue';
import DashboardView    from '../views/DashboardView.vue';

const routes = [
    {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: { guest: true }
    },
    {
        path: '/',
        name: 'dashboard',
        component: DashboardView,
        meta: { requiresAuth: true }
    },
    { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach((to) => {
    const auth = useAuthStore();
    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        return { name: 'login' };
    }
    if (to.meta.guest && auth.isAuthenticated) {
        return { name: 'dashboard' };
    }
});

export default router;