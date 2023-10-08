<template>
    <div class="landing-page-container">
        <div>
            <h1>Patient Bookr</h1>
            <p>Keep track of your appointments with ease, and never forget a patient again.</p>
        </div>

        <div v-if="isLoggedIn">
            <button><router-link :to="'/home'">Continue to home page</router-link></button>
            <button @click="logOut">Log Out</button>

        </div>
        <div v-else>
            <h5>Sign In/Register as a Professional</h5>
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
        }
    },
    methods: {
        callback: async function (response) {
            this.isLoggedIn = true
            const userData = decodeCredential(response.credential);
            const jsonUserData = JSON.stringify(userData)
            this.$cookies.set('professional_data', jsonUserData)
            this.name = userData.name
            this.email = userData.email
            await fetch(DATA_URL, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: this.name,
                    email: this.email
                })
            })
            this.$nextTick(() => {
                this.$router.push({name: 'Home'})
            })
        },
        logOut: function(){
            googleLogout()
            this.$cookies.remove('professional_data')
            this.isLoggedIn = false
        }
    },

}
</script>