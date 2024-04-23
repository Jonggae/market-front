<template>
    <div>
        <h1>로그인</h1>
        <form @submit.prevent="login">
            <div>
                <label for="username">사용자 이름:</label>
                <input type="text" id="username" v-model="credentials.username" required>
            </div>
            <div>
                <label for="password">비밀번호:</label>
                <input type="password" id="password" v-model="credentials.password" required>
            </div>
            <button type="submit">로그인</button>
        </form>
    </div>
</template>
<script>
export default {
    name: 'LoginPage',
    data() {
        return {
            credentials: {
                username: '',
                password: ''
            }
        };
    },
    methods: {
        login() {
            const headers = new Headers({
                'Authorization': 'Basic ' + btoa(this.credentials.username + ':' + this.credentials.password)
            });

            fetch('/api/customer/login', {
                method: 'POST',
                headers: headers
            })
                .then(response => {
                    if (response.ok) {
                        alert('로그인 완료');
                        // JWT 토큰 추출
                        return response.text();
                    } else {
                        alert('로그인 정보가 올바르지 않습니다.');
                        throw new Error('Login failed');
                    }
                })
                .then(token => {
                    localStorage.setItem('jwt', token); // JWT 토큰 저장
                    this.$router.push('/main'); // 메인 페이지로 이동
                })
                .catch(error => {
                    console.error('로그인 요청 실패:', error);
                });
        }
    }
};
</script>