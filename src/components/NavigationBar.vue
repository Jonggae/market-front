<template>
    <nav>
        <router-link to="/" class="nav-item">홈</router-link>
        <router-link to="/login" class="nav-item">로그인</router-link>
        <router-link to="/register" class="nav-item">회원가입</router-link>
        <router-link to="/products" class="nav-item">상품</router-link>
        <router-link to="/orders" class="nav-item">주문</router-link>
        <router-link to="/cart" class="nav-item">장바구니</router-link>
        <router-link to="/user-profile" class="nav-item">내 정보</router-link>
    </nav>
</template>

<script>
export default {
    name: 'NavigationBar'
};
</script>

<style>
/* 네비게이션 스타일링 */
nav {
    display: flex;
    justify-content: space-around;
    background-color: #f5f5f5;
    padding: 1em 0;
}

.nav-item {
    text-decoration: none;
    color: #333;
    padding: 0.5em 1em;
}

.nav-item:hover {
    color: #007bff;
}
</style>