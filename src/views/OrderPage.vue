<template>
    <div class="order-container">
        <h1>내 주문</h1>
        <div class="orders">
            <div v-for="order in orders" :key="order.orderId" class="order-card">
                <h3>주문 번호: {{ order.orderId }}</h3>
                <p><strong>주문 날짜:</strong> {{ new Date(order.orderDateTime).toLocaleString() }}</p>
                <p><strong>주문 상태:</strong> {{ order.status }}</p>
                <div class="order-details">
                    <table>
                        <thead>
                        <tr>
                            <th>상품 이름</th>
                            <th>수량</th>
                            <th>가격</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in order.orderItems" :key="item.itemId">
                            <td>{{ item.productName }}</td>
                            <td>{{ item.quantity }}</td>
                            <td>{{ item.price }}원</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <button class="status-button" @click="updateOrderStatus(order)">상태 업데이트</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            orders: [] // 사용자의 주문 목록
        };
    },
    created() {
        this.fetchOrders();
    },
    methods: {
        fetchOrders() {
            fetch('/api/orders/my-order', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` }
            })
                .then(response => response.json())
                .then(data => {
                    this.orders = data.data;
                })
                .catch(error => console.error('Error fetching orders:', error));
        },
        updateOrderStatus(order) {
            console.log("Updating order status for:", order.orderId);
        }
    }
};
</script>

<style>
.order-container {
    padding: 20px;
    background-color: #f3f3f3;
}
.orders {
    display: flex;
    flex-wrap: wrap;
}
.order-card {
    flex: 1 1 300px;
    border: 1px solid #ccc;
    margin: 10px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.order-details table {
    width: 100%;
    margin-top: 15px;
    border-collapse: collapse;
}
.order-details th, .order-details td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
}
.status-button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
}
.status-button:hover {
    background-color: #45a049;
}
</style>
