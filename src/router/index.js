import {createRouter, createWebHistory} from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import LoginPage from "@/views/LoginPage.vue";
import MainPage from "@/views/MainPage.vue";
import RegisterPage from "@/views/RegisterPage.vue";
import UserProfile from "@/components/UserProfile.vue";
import ProductList from "@/views/ProductList.vue";
import AddProduct from "@/components/AddProduct.vue";
import ProductDetail from "@/views/ProductDetail.vue";
import ProductEdit from "@/views/ProductEdit.vue";
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
    }
    ,
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
        path:'/products/edit/:id',
        name: 'ProductEdit',
        component: ProductEdit
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
        beforeEnter: (to, from, next) => {
            fetch('/api/customer/my-info', {
                headers: {'Authorization': `Bearer ${localStorage.getItem('jwt')}`}
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('인증 실패');
                    }
                })
                .then(data => {
                    const isAdmin = data.data.authorityDtoSet.map(auth => auth.authorityName).includes('ROLE_ADMIN');
                    if (isAdmin) {
                        next(); // 관리자면 페이지 접근 허용
                    } else {
                        alert('관리자만 접근할 수 있습니다.');
                        next('/login'); // 관리자가 아니면 로그인 페이지로 리다이렉션
                    }
                })
                .catch(error => {
                    console.error(error);
                    next('/login'); // 인증 실패 시 로그인 페이지로 리다이렉션
                });
        }
    },

    // 추가 라우트 설정
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
