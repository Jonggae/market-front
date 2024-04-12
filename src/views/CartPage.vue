<template>
    <div class="cart-container">
        <h1>장바구니</h1>
        <ul>
            <li v-for="item in cart" :key="item.itemId" class="cart-item">
                <div class="product-name">{{ item.productName }} - 가격: {{ item.price }}원</div>
                <div style="margin-left: 30px" class="product-quantity">
                    <button class="quantity-button" @click="updateQuantity(item, -1)">-</button>
                    <input class="quantity-input" type="number" v-model="item.quantity"
                           min="1">
                    <button class="quantity-button" @click="updateQuantity(item, 1)">+</button>
                </div>
                <div>총 가격 : {{ item.totalPrice }} 원</div>
                <div class="actions">
                    <button class="delete-button" @click="removeFromCart(item)">장바구니에서 삭제</button>
                    <span v-if="item.updating" class="update-indicator">저장 중...</span>
                    <span v-if="item.updateSuccess" class="success-indicator">저장 완료!</span>
                </div>
            </li>
        </ul>
        <p style="font-size: x-large">총 금액: {{ totalPrice }} 원</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            cart: [],
            totalPrice: 0
        };
    },
    created() {
        this.fetchCart();
    },
    methods: {
        fetchCart() {
            fetch('/api/carts/my-cart', {
                headers: {'Authorization': `Bearer ${localStorage.getItem('jwt')}`}
            })
                .then(response => response.json())
                .then(data => {
                    this.cart = data.data.cartItems;
                    this.totalPrice = data.data.totalPrice;
                })
                .catch(error => console.error('Error fetching cart:', error));
        },
        updateQuantity(item, change) {
            const newQuantity = item.quantity + change;
            if (newQuantity < 1) {
                alert('수량은 1 이상이어야 합니다.');
                return;
            }
            item.quantity = newQuantity;
            this.updateCart(item);
        },
        updateCart(item) {
            item.updating = true;
            fetch(`/api/carts/my-cart/items/${item.itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify({quantity: item.quantity})
            })
                .then(response => {
                    item.updating = false;
                    if (!response.ok) throw new Error('장바구니 업데이트 실패');
                    item.updateSuccess = true;
                    setTimeout(() => item.updateSuccess = false, 2000); // 성공 메시지 2초 후 숨김
                    this.fetchCart(); // 총 금액과 상품 정보 다시 불러오기
                })
                .catch(error => {
                    console.error('Error updating cart:', error);
                    item.updateSuccess = false;
                });
        },
        removeFromCart(item) {
            fetch(`/api/carts/my-cart/items/${item.itemId}`, {
                method: 'DELETE',
                headers: {'Authorization': `Bearer ${localStorage.getItem('jwt')}`}
            })
                .then(response => {
                    if (!response.ok) throw new Error('Failed to remove product from cart');
                    alert('상품이 장바구니에서 삭제되었습니다.');
                    this.fetchCart(); // 장바구니 목록 다시 불러오기
                })
                .catch(error => console.error('Error removing product from cart:', error));
        }
    }
};
</script>


<style>
.update-indicator {
    color: orange;
    margin-left: 10px;
}

.success-indicator {
    color: green;
    margin-left: 10px;
}

.cart-container {
    margin: 20px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
}

.cart-item {
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
    margin-bottom: 10px;
}

.product-name {
    font-size: 18px;
    font-weight: bold;
}

.product-quantity {
    display: flex;
    align-items: center;
    margin-top: 5px;
}

.quantity-button {
    padding: 5px 10px;
    color: #333;
    border: 1px solid #ccc;
    background-color: #fff;
    cursor: pointer;
}

.quantity-input {
    width: 50px;
    text-align: center;
    margin: 0 5px;
}

.actions {
    margin-top: 10px;
}

.delete-button {
    padding: 5px 10px;
    background-color: #e53e3e;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.delete-button:hover {
    background-color: #c53030;
}

.update-indicator {
    color: orange;
    margin-left: 10px;
}

.success-indicator {
    color: green;
    margin-left: 10px;
}


</style>