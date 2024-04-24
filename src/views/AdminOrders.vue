<template>
    <div class="order-management">
        <h1>주문 관리</h1>
        <ul>
            <li v-for="order in orders" :key="order.orderId" class="order-item">
                <h2>주문 ID: {{ order.orderId }}</h2>
                <h3>주문 회원: {{ order.customerName }}</h3>
                <div style="font-weight: bold">
                    <label>현재 주문 상태:</label>
                    {{ getStatusText(order.status) }}
                </div>
                <div>
                    <label style="font-weight: bold">상태 변경 : </label>
                    <select v-model="order.newStatus">
                        <option disabled value="">주문 상태 선택</option>
                        <option v-for="(name, code) in statusOptions" :key="code" :value="code">
                            {{ name }}
                        </option>
                    </select>
                </div>
                <button @click="updateOrderStatus(order)" style="margin-top: 5px">주문 상태 변경</button>
                <p>
                    <button @click="deleteOrder(order)">주문 삭제</button>
                    <br>삭제는 주문 취소 상태인 주문만 삭제하세요.
                </p>

                <p>주문 날짜: {{ new Date(order.orderDateTime).toLocaleString() }}</p>
                <ul>
                    <li v-for="item in order.orderItems" :key="item.itemId">
                        <div>{{ item.productName }} - 수량: {{ item.quantity }} - 가격: {{ item.price }}원</div>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            orders: [],
            statusOptions: { // 주문 상태 매핑
                'PENDING_PAYMENT': '결제 대기',
                'PENDING_ORDER': '주문 대기',
                'PAID': '결제 완료',
                'PREPARING_FOR_SHIPMENT': '배송 준비 중',
                'SHIPPED': '배송 중',
                'DELIVERED': '배송 완료',
                'CANCELLED': '주문 취소'// 주문 목록을 저장할 배열
            }
        };
    },
    created() {
        this.fetchOrders(); // 컴포넌트가 생성될 때 주문 목록을 가져옴
    },
    methods: {
        getStatusText(status) {
            return this.statusOptions[status] || '상태 정보 없음';

        },
        fetchOrders() {
            fetch('/api/orders/admin/orders', { // 관리자 전용 주문 목록 API
                method: 'GET',
                headers: {'Authorization': `Bearer ${localStorage.getItem('jwt')}`}
            })
                .then(response => {
                    if (!response.ok) throw new Error('Failed to fetch orders');
                    return response.json();
                })
                .then(data => {
                    this.orders = data.data; // 데이터를 orders 배열에 저장
                })
                .catch(error => {
                    console.error('Error fetching orders:', error);
                });
        },
        updateOrderStatus(order) {
            console.log("Updating status for order:", order.orderId, "New status:", order.status);

            fetch(`/api/orders/${order.orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify({status: order.newStatus})
            })
                .then(response => {
                    if (!response.ok) throw new Error('주문 상태 업데이트 실패');
                    alert('주문 상태가 업데이트 되었습니다.');
                    this.fetchOrders(); // 주문 목록 다시 불러오기
                })
                .catch(error => console.error('Error updating order status:', error));
        },
        deleteOrder(order) {
            fetch(`/api/orders/delete/${order.customerId}/${order.orderId}`, {
                method: 'DELETE',
                headers: {'Authorization': `Bearer ${localStorage.getItem('jwt')}`}
            })
                .then(response => {
                    if (!response.ok) throw new Error('주문 삭제 실패');
                    alert('주문이 삭제되었습니다.');
                    this.fetchOrders(); // 주문 목록 다시 불러오기
                })
                .catch(error => {
                    console.error('Error deleting order:', error);
                    alert('주문 삭제 중 오류가 발생했습니다: ' + error.message);
                });

        }
    }
}
;
</script>

<style>
.order-management {
    padding: 20px;
    background-color: #f3f3f3;
}

.order-item {
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    list-style: none;
}

.order-item h2 {
    margin: 0 0 10px 0;
}
</style>
