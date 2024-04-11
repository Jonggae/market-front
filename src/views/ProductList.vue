<template>
    <div>
        <button @click="redirectToProductAddPage">상품 추가</button>
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
            products: []
        };
    },
    created() {
        this.fetchProducts();
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
        }
    }
};
</script>
