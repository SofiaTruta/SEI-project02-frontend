<template>
    <div class="logout-button-container">
        <button @click="handleLogOut">Log out</button>
    </div>
</template>

<script>
import { googleLogout } from 'vue3-google-login';

export default {
    name: 'logOutButton',
    methods:{
        handleLogOut(){
            googleLogout()
            this.$cookies.remove('professional_data')
            this.isLoggedIn = false
            this.$router.push('/')
        }
    }
}
</script>