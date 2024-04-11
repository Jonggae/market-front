<template>
    <div v-if="isAdmin">
        <h1>상품 등록</h1>
        <form @submit.prevent="submitProduct">
            <div>
                <label for="productName">상품명:</label>
                <input type="text" id="productName" v-model="product.productName" required><br>
            </div>
            <div>
                <label for="productDescription">상품 설명:</label>
                <textarea id="productDescription" v-model="product.productDescription" required></textarea><br>
            </div>
            <div>
                <label for="price">가격:</label>
                <input type="number" id="price" v-model="product.price" required><br>
            </div>
            <div>
                <label for="stock">재고 수량:</label>
                <input type="number" id="stock" v-model="product.stock" required><br>
            </div>
            <button type="submit">상품 등록</button>
        </form>
    </div>
    <div v-else>
        <p>관리자만 접근할 수 있습니다.</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            product: {
                productName: '',
                productDescription: '',
                price: null,
                stock: null
            },
            isAdmin: false
        };
    },
    created() {
        this.checkAdmin();
    },
    methods: {
        checkAdmin() {
            const token = localStorage.getItem('jwt');
            if (!token) {
                this.$router.push('/login');
                return;
            }

            fetch('/api/customer/my-info', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(response => response.json())
                .then(data => {
                    const isAdmin = data.data.authorityDtoSet.map(auth => auth.authorityName).includes('ROLE_ADMIN');
                    this.isAdmin = isAdmin;
                    if (!isAdmin) {
                        alert('관리자만 접근할 수 있습니다.');
                        this.$router.push('/login');
                    }
                })
                .catch(() => {
                    this.$router.push('/login');
                });
        },
        submitProduct() {
            fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify(this.product)
            })
                .then(response => {
                    if (!response.ok) throw new Error('상품 등록 실패');
                    return response.json();
                })
                .then(() => {
                    alert('상품 등록 성공!');
                    this.$router.push('/products');
                })
                .catch(error => {
                    alert(error.message);
                });
        }
    }
};
</script>
