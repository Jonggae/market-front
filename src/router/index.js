import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
// LoginPage.vue, RegisterPage.vue, MainPage.vue 등 추가 컴포넌트를 여기에 임포트

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage
    },
    // 추가 라우트 설정
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
