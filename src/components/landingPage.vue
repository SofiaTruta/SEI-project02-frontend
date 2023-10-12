<template>
    <div class="landing-page-container bg-gradient" >
        <div class="intro">
            <h1 class="display-4 text-white">Patient Bookr</h1>
            <p class="subtitle-1 text-white">Keep track of your appointments with ease, and never forget a patient again.</p>
        </div>

        <div v-if="isLoggedIn" class="buttons-after-login">
            <v-btn class="btn-primary" @click="navigateToHome">Continue to home page</v-btn>
            <v-btn class="btn-logout" @click="logOut">Log Out</v-btn>

        </div>
        <div v-else>
            <h5 class="subtitle-1 text-white">Sign In/Register as a Professional</h5>
            <GoogleLogin :callback="callback" />
        </div>
    </div>
</template>

<script>
import { decodeCredential, googleLogout } from 'vue3-google-login'

const DATA_URL = 'http://localhost:4000/professionals/login'

export default {
    name: 'landingPage',
    data: () => ({
        isLoggedIn: false,
        name: '',
        email: ''
    }),
    mounted() {
        if (this.$cookies.isKey('professional_data')) {
            this.isLoggedIn = true
            this.$router.push({name: 'Home'})
        }
    },
    methods: {
        callback:  function (response) {
            this.isLoggedIn = true
            const userData = decodeCredential(response.credential);
            const jsonUserData = JSON.stringify(userData)
            this.$cookies.set('professional_data', jsonUserData)
            this.name = userData.name
            this.email = userData.email
           
            fetch(DATA_URL, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: this.name,
                    email: this.email
                })
            })
            console.log(response.status)

            this.$router.push({ name: 'Home' })

        },
        logOut: function () {
            googleLogout()
            this.$cookies.remove('professional_data')
            this.isLoggedIn = false
        },
        navigateToHome(){
            this.$router.push({ name: 'Home' })
        }
    },

}
</script>
<style>
@import "../assets/css/landingPage.css";
</style>