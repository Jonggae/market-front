<template>
    <div v-if="product">
        <h1>상품 정보 수정</h1>
        <form @submit.prevent="updateProduct">
            <div>
                <label for="productName">상품명:</label>
                <input type="text" id="productName" v-model="product.productName" required>
            </div>
            <div>
                <label for="productDescription">설명:</label>
                <textarea id="productDescription" v-model="product.productDescription" required></textarea>
            </div>
            <div>
                <label for="price">가격:</label>
                <input type="number" id="price" v-model="product.price" required>
            </div>
            <div>
                <label for="stock">재고:</label>
                <input type="number" id="stock" v-model="product.stock" required>
            </div>
            <button type="submit">저장</button>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            product: null, // 수정하기 위해 가져온 상품 정보
            productId: this.$route.params.id, // 현재 페이지의 상품 ID
        };
    },
    created() {
        this.fetchProductDetail();
    },
    methods: {
        fetchProductDetail() {
            // 상품 정보를 가져오는 API 호출
            fetch(`/api/products/${this.productId}`)
                .then(response => {
                    if (!response.ok) throw new Error('Failed to fetch product details');
                    return response.json();
                })
                .then(data => {
                    this.product = data.data; // 서버 응답에서 상품 데이터를 가져와서 할당
                })
                .catch(error => console.error(error));
        },
        updateProduct() {
            // 상품 정보를 업데이트하는 API 호출
            fetch(`/api/products/${this.productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
                },
                body: JSON.stringify(this.product),
            })
                .then(response => {
                    if (!response.ok) {
                        response.json().then(data => {
                            throw new Error(data.message || '상품 정보 업데이트 실패');
                        });
                    }
                    alert('상품 정보가 업데이트 되었습니다.');
                    this.$router.push(`/products/${this.productId}`);
                })
                .catch(error => {
                    console.error(error);
                    alert(error.message);
                });
        },
    },
};
</script>
