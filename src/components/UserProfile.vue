<template>
    <div v-if="user">
        <h1>회원 정보 페이지</h1>
        <p>환영합니다, {{ user.customerName }}!</p>
        <p>당신의 권한: {{ user.authorities.join(', ') }}</p>
        <p>이메일: {{ user.email }}</p>
        <p>전화번호: {{ user.phoneNumber }}</p>
        <button @click="logout">로그아웃</button>
    </div>
    <div v-else>
        <p>권한이 없습니다.</p>
    </div>
</template>

<script>
export default {
    name: 'UserProfile',
    data() {
        return {
            user: null
        };
    },
    created() {
        this.fetchUserData();
    },
    methods: {
        fetchUserData() {
            const token = localStorage.getItem('jwt');
            if (!token) {
                this.$router.replace('/login');
                return;
            }

            fetch('/api/customer/my-info', {
                headers: {'Authorization': `Bearer ${token}`}
            })
                .then(response => {
                    if (!response.ok) throw new Error('권한이 없습니다.');
                    return response.json();
                })
                .then(data => {
                    this.user = {
                        customerName: data.data.customerName,
                        email: data.data.email,
                        phoneNumber: data.data.phoneNumber,
                        authorities: data.data.authorityDtoSet.map(auth => auth.authorityName)
                    };
                })
                .catch(error => {
                    alert(error.message);
                    this.$router.replace('/login');
                });
        },
        logout() {
            localStorage.removeItem('jwt');
            this.$router.push('/login');
        }
    }
};
</script>
