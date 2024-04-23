<template>
    <div>
        <h1>회원가입</h1>
        <form @submit.prevent="submitForm">
            <div>
                <label for="customerName">이름:</label>
                <input type="text" id="customerName" v-model="formData.customerName" required>
            </div>
            <div>
                <label for="password">비밀번호:</label>
                <input type="password" id="password" v-model="formData.password" required>
            </div>
            <div>
                <label for="email">이메일:</label>
                <input type="email" id="email" v-model="formData.email" required>
            </div>
            <div>
                <label for="phoneNumber">전화번호:</label>
                <input type="tel" id="phoneNumber" v-model="formData.phoneNumber" required>
            </div>
            <button type="submit">회원가입</button>
        </form>
    </div>
</template>

<script>
export default {
    name: 'RegisterPage',
    data() {
        return {
            formData: {
                customerName: '',
                email: '',
                phoneNumber: '',
                password: ''
            }
        };
    },
    methods: {
        submitForm() {
            fetch('/api/customer/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.formData)
            })
                .then(response => {
                    if (response.ok) {
                        alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
                        this.$router.push('/login');
                    } else {
                        response.json().then(data => {
                            throw new Error(data.message);
                        });
                    }
                })
                .catch(error => {
                    alert('회원가입 중 문제가 발생했습니다: ' + error.message);
                    console.error(error);
                });
        }
    }
};
</script>

<style>
/* 여기에 CSS 스타일을 추가할 수 있습니다. */
</style>
