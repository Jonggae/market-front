import {createRouter, createWebHistory} from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import LoginPage from "@/views/LoginPage.vue";
import MainPage from "@/views/MainPage.vue";
import RegisterPage from "@/views/RegisterPage.vue";
import UserProfile from "@/views/UserProfile.vue";
import ProductList from "@/views/ProductList.vue";
import AddProduct from "@/views/AddProduct.vue";
import ProductDetail from "@/views/ProductDetail.vue";
import ProductEdit from "@/views/ProductEdit.vue";
import CartPage from "@/views/CartPage.vue";
// LoginPage.vue, RegisterPage.vue, MainPage.vue 등 추가 컴포넌트를 여기에 임포트

const routes = [

    {
        path: '/',
        name: 'Home',
        component: HomePage
    },

    {
        path: '/login',
        name: 'Login',
        component: LoginPage
    },
    {
        path: '/main',
        name: 'Main',
        component: MainPage
    },
    {
        path: '/products',
        name: 'ProductList',
        component: ProductList
    }
    ,
    {
        path: '/register',
        name: 'Register',
        component: RegisterPage
    },
    {
        path: '/products/:id',
        name: 'ProductDetail',
        component: ProductDetail
    },
    {
        path: '/products/edit/:id',
        name: 'ProductEdit',
        component: ProductEdit,
        meta: { requiresAdmin: true } // 관리자 권한이 필요함을 명시
    },

    {
        path: '/user-profile', // 회원 정보 페이지 경로
        name: 'UserProfile',
        component: UserProfile,
        beforeEnter: (to, from, next) => {
            const token = localStorage.getItem('jwt');
            if (!token) {
                // 토큰이 없으면 로그인 페이지로 리다이렉션
                next('/login');
            } else {
                // 토큰이 있으면 페이지 접근 허용
                next();
            }
        }
    },
    {
        path: '/add-product', // 상품 등록 페이지 경로
        name: 'AddProduct',
        component: AddProduct,
        meta: { requiresAdmin: true } // 관리자 권한이 필요함을 명시

    },

    {
        path: '/cart',
        name: 'CartPage',
        component: CartPage,
    }

    // 추가 라우트 설정
];
const router = createRouter({
    history: createWebHistory(),
    routes
});
router.beforeEach((to, from, next) => {
    const isAdminRoute = to.matched.some(record => record.meta.requiresAdmin);

    if (isAdminRoute) {
        const token = localStorage.getItem('jwt');
        if (!token) {
            next('/login');
        } else {
            // 서버에 사용자 권한 정보를 요청
            fetch('/api/customer/my-info', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(response => {
                    if (!response.ok) throw new Error('Authentication failed');
                    return response.json();
                })
                .then(data => {
                    const isAdmin = data.data.authorityDtoSet.some(auth => auth.authorityName === 'ROLE_ADMIN');
                    if (isAdmin) {
                        next(); // 관리자인 경우, 라우트 진행
                    } else {
                        next('/'); // 관리자가 아닌 경우, 홈 페이지로 리디렉션
                    }
                })
                .catch(error => {
                    console.error('Error checking admin role:', error);
                    next('/login'); // 에러가 발생한 경우, 로그인 페이지로 이동
                });
        }
    } else {
        next(); // 관리자 권한이 필요하지 않은 라우트는 그대로 진행
    }
});


export default router;
