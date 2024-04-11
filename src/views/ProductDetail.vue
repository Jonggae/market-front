<template>
    <div v-if="product">
        <h1>상품 세부 정보</h1>
        <p><strong>상품명:</strong> {{ product.productName }}</p>
        <p><strong>설명:</strong> {{ product.productDescription }}</p>
        <p><strong>가격:</strong> {{ product.price }}</p>
        <p><strong>재고:</strong> {{ product.stock }}</p>

        <button @click="editProduct">수정</button>
        <button @click="deleteProduct">삭제</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            product: null,
            // 이 컴포넌트가 로드되었을 때의 상품 ID 값이 필요합니다. 이 값을 라우트 파라미터에서 가져올 수 있습니다.
            productId: this.$route.params.id
        };
    },
    created() {
        this.fetchProductDetail();
    },
    methods: {
        fetchProductDetail() {
            // 상품 정보를 불러오는 API 호출을 여기에 추가합니다.
            fetch(`/api/products/${this.productId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch product details');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    this.product = data.data;
                })
                .catch(error => {
                    console.error(error);
                    // 에러 처리 로직을 추가합니다. 예: 사용자에게 메시지를 보여주거나 다른 페이지로 리디렉션 할 수 있습니다.
                });
        },
        editProduct() {
            // 상품 수정 페이지로 라우팅합니다.
            this.$router.push(`/products/edit/${this.productId}`);
        },
        deleteProduct() {
            // 상품 삭제 API 호출을 여기에 추가합니다.
            if (confirm('이 상품을 삭제하시겠습니까?')) {
                const token = localStorage.getItem('jwt');
                if (!token) {
                    alert('로그인이 필요합니다.');
                    this.$route.push('/login');
                    return;
                }

                fetch(`/api/products/${this.productId}`, {
                    method: 'DELETE',
                    headers: {'Authorization': `Bearer ${token}`}

                })
                    .then(response => {
                        if (!response.ok) {
                            // 서버가 에러 메시지와 함께 응답을 보냈다면 이를 표시합니다.
                            response.json().then(data => {
                                throw new Error(data.message || '상품 삭제에 실패했습니다.');
                            });
                        }
                        alert('상품이 삭제되었습니다.');
                        this.$router.push('/products'); // 상품 목록 페이지로 리디렉션합니다.
                    })
                    .catch(error => {
                        console.error(error);
                        // 에러 처리 로직을 추가합니다.
                    });
            }
        }
    }

};
</script>
