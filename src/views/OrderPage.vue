<template>
    <div class="order-container">
        <h1>내 주문</h1>
        <div class="orders">
            <div v-for="order in orders" :key="order.orderId" class="order-card">
                <h3>주문 번호: {{ order.orderId }}</h3>
                <p><strong>주문 날짜:</strong> {{ new Date(order.orderDateTime).toLocaleString() }}</p>
                <p><strong>주문 상태:</strong> {{ getStatusText(order.status) }}</p>
                <div class="order-details">
                    <table>
                        <thead>
                        <tr>
                            <th>상품 이름</th>
                            <th>수량</th>
                            <th>가격</th>
                            <th>작업</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="item in order.orderItems" :key="item.itemId">
                            <td>{{ item.productName }}</td>
                            <td>
                                {{ item.quantity }}
                                <button v-if="order.status === 'PENDING_ORDER'" class="status-button"
                                        @click="increaseQuantity(order, item)">+
                                </button>
                                <button v-if="order.status === 'PENDING_ORDER'" class="status-button"
                                        @click="decreaseQuantity(order, item)">-
                                </button>
                            </td>
                            <td>{{ item.price }}원</td>
                            <td>
                                <button @click="removeOrderItem(order, item)">삭제</button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <button v-if="order.status === 'PENDING_ORDER'" class="status-button" @click="confirmOrder(order)">주문
                    하기
                </button>
                <button class="status-button" @click="deleteOrder(order.orderId, order.customerId)">주문 취소</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            orders: [
                {orderId: 1, status: '{PENDING_PAYMENT}'}
            ]
        };
    },
    created() {
        this.fetchOrders();
    },
    methods: {
        getStatusText(status) {
            const statusMap = {
                PENDING_PAYMENT: '결제 대기',
                PENDING_ORDER: '주문 대기', // 주문 대기
                PAID: '결제 완료',
                PREPARING_FOR_SHIPMENT: '배송 준비 중',
                SHIPPED: '배송 중',
                DELIVERED: '배송 완료',
                CANCELLED: '주문 취소'
            };
            return statusMap[status] || status;
        },
        fetchOrders() {
            fetch('/api/orders/my-order', {
                headers: {'Authorization': `Bearer ${localStorage.getItem('jwt')}`}
            })
                .then(response => response.json())
                .then(data => {
                    this.orders = data.data;
                })
                .catch(error => console.error('Error fetching orders:', error));
        },
        confirmOrder(order) {
            fetch(`/api/orders/my-order/${order.orderId}/confirm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                }
            })
                .then(response => response.json()) // 응답을 JSON 형태로 파싱
                .then(data => {
                    if (data.success) { // 성공적으로 데이터를 받았는지 확인
                        alert('주문이 확정되었습니다.');
                        console.log('Response data:', data); // 디버깅을 위해 응답 데이터 로그
                        this.fetchOrders();  // 주문 목록 다시 불러오기
                    } else {
                        alert('주문 확정에 실패했습니다: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error confirming order:', error);
                    alert('주문 확정 과정에서 오류가 발생했습니다: ' + error.message);
                });
        },
        deleteOrder(orderId, customerId) {
            if (!confirm('이 주문을 취소하시겠습니까?')) return;

            fetch(`/api/orders/${customerId}/${orderId}`, {
                method: 'DELETE',
                headers: {'Authorization': `Bearer ${localStorage.getItem('jwt')}`}
            })
                .then(response => {
                    if (!response.ok) throw new Error('주문 취소 실패');
                    alert('주문이 취소되었습니다.');
                    this.fetchOrders(); // 주문 목록 다시 불러오기
                })
                .catch(error => {
                    console.error('Error deleting order:', error);
                    alert('주문 취소 중 오류가 발생했습니다: ' + error.message);
                });
        },

        increaseQuantity(order, item) {
            item.quantity++;
            this.updateOrderItem(order, item);
        },
        decreaseQuantity(order, item) {
            if (item.quantity > 1) {
                item.quantity--;
                this.updateOrderItem(order, item);
            }
        },
        updateOrderItem(order, item) {
            item.updating = true;
            fetch(`/api/orders/my-order/items/${item.itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify({quantity: item.quantity})
            })
                .then(response => {
                    item.updating = false;
                    if (!response.ok) throw new Error('주문 항목 업데이트 실패');
                    this.fetchOrders(); // 주문 정보 다시 불러오기
                })
                .catch(error => {
                    console.error('Error updating order item:', error);
                });

        },
        removeOrderItem(order, item) {
            fetch(`/api/orders/my-order/items/${item.itemId}`, {
                method: 'DELETE',
                headers: {'Authorization': `Bearer ${localStorage.getItem('jwt')}`}
            })
                .then(response => {
                    if (!response.ok) throw new Error('Failed to remove order item');
                    this.fetchOrders(); // 주문 목록 다시 불러오기
                })
                .catch(error => console.error('Error removing order item:', error));
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
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
    margin-left: 5px;
}

.status-button:hover {
    background-color: #45a049;
}
</style>
