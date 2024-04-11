<template>
    <div>
        <button v-if="isAdmin" @click="redirectToProductAddPage">상품 추가</button>
        <h1>상품 목록</h1>
        <ul>
            <li v-for="product in products" :key="product.id">
                {{ product.id }} - {{ product.productName }} - {{ product.price }}원
                <router-link :to="`/products/${product.id}`">info</router-link>

            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'ProductList',
    data() {
        return {
            products: [],
            isAdmin: false,
        };
    },
    created() {
        this.fetchProducts();
        this.checkAdmin();

    },
    methods: {
        fetchProducts() {
            fetch('/api/products')
                .then(response => response.json())
                .then(data => {
                    this.products = data.data;
                })
                .catch(error => console.error('Error fetching products:', error));
        },
        redirectToProductAddPage() {
            this.$router.push('/add-Product');
        },
        checkAdmin() {
            const token = localStorage.getItem('jwt');
            if (token) {
                fetch('/api/customer/my-info', {
                    headers: {'Authorization': `Bearer ${token}`}
                })
                    .then(response => response.json())
                    .then(data => {
                        this.isAdmin = data.data.authorityDtoSet.some(auth => auth.authorityName === 'ROLE_ADMIN');
                    })
                    .catch(error => console.error('Error checking admin status:', error))
            }
        },

    }
};
</script>
