<template>
    <div>
        <button v-if="isAdmin" class="add-product-btn" @click="redirectToProductAddPage">상품 추가</button>
        <h1>상품 목록</h1>
        <ul>
            <li v-for="product in products" :key="product.id" class="product-item">
                <p class="product-title">no.{{ product.id }} : {{ product.productName }}</p>

                <p class="product-price"> 가격 : {{ product.price }}원</p>
                <p><router-link class="info-link" :to="`/products/${product.id}`">상품 정보</router-link></p>
                <button class="add-to-cart-btn" @click="addToCart(product)">장바구니에 추가</button>
                <button class="add-to-order-btn" @click="addToOrder(product)">주문에 추가</button>

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
        addToCart(product) {
            const token = localStorage.getItem('jwt');
            if (!token) {
                alert('로그인이 필요합니다.');
                this.$router.push('/login');
                return;
            }
            const cartItem = {
                productId: product.id,
                quantity: 1
            }
            fetch(`/api/carts/my-cart/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(cartItem)
            })
                .then(response => {
                    if (!response.ok) throw new Error('장바구니에 추가하는데 실패했습니다.');
                    return response.json();
                })
                .then(() => {
                    alert('장바구니에 추가되었습니다.');
                })
                .catch(error => {
                    console.error('Error adding product to cart:', error);
                });
        },
        addToOrder(product) {
            const orderItem = {
                productId: product.id,
                quantity: 1
            };
            fetch(`/api/orders/my-order/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify(orderItem)
            })
                .then(response => {
                    if (!response.ok) throw new Error('주문 추가 실패');
                    alert('주문에 상품이 추가되었습니다.');

                })
                .catch(error => {
                    console.error('Error adding item to order:', error);
                });
        }
    }
};
</script>
<style scoped>
.product-item {
    border-bottom: 1px solid #ccc;
    padding-bottom: 10px;
    margin-bottom: 10px;
}

.product-title {
    font-size: larger;
    font-weight: bold;
}

.product-price {
    color: #555;
}

.info-link {

    text-decoration: none;
    color: #007bff;
}

.add-to-cart-btn {
    margin-left: 20px;
    margin-right: 20px;
    padding: 5px 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.add-to-cart-btn:hover {
    background-color: #45a049;
}

.add-to-order-btn {
    padding: 5px 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
.add-to-order-btn:hover{
    background-color: #45a049;
}

.add-product-btn {
    margin-bottom: 20px;
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.
.add-product-btn:hover {
    background-color: #0056b3;
}
</style>
