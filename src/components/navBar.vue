<template>
    <div class="navbar-container">
        <div class="navbar-prof-details">
            <p> Hello</p>
            <p> {{ professionalData.givenName }}</p>
        </div>

        <logOutButton />
    </div>
</template>

<script>
import logOutButton from './logOutButton.vue'

export default {
    name: 'navBar',
    data: () => ({
        professionalData: {
            givenName: ''
        }
    }),
    components: {
        logOutButton
    },
    mounted() {
        this.fetchProfessionalData()
    },
    methods: {
        async fetchProfessionalData() {
            const professionalCookies = this.$cookies.get('professional_data');
            this.professionalData.givenName = professionalCookies.given_name;
        }
    }
}
</script>