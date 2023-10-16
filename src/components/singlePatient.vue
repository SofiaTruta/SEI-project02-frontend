<template>
    <navBar class="nav-bar" />
    <v-main class="rounded-lg ma-4" v-if="$vuetify.display.lgAndUp">
        <v-row>
            <v-col cols="12">
                <div class="main-content">
                    <h1 class="header">Patient Bookr</h1>
                    <h3 class="text-center">Patient Details</h3>

                    <v-sheet rounded class="pa-4">
                        <h2 class="mt-1 subtitle-1">Name: {{ this.patientData.name }}</h2>
                        <h3 class="mt-1 subtitle-2">Date of birth: {{
                        $moment(this.patientData.dateOfBirth).format('DD-MM-YYYY') }}</h3>
                        <h3 class="mt-3 headline">Treatment Notes:</h3>
                        <p class="mt-1 body-1">{{ this.patientData.currentTreatment }}</p>
                    </v-sheet>
                </div>
            </v-col>
        </v-row>
    </v-main>

    <!-- view for mobile -->
    <v-main class="rounded-lg ma-4" v-if="$vuetify.display.mobile">
        <v-row>
            <v-col cols="12">
                <div class="main-content">
                    <h1 class="mobile-header">Patient Bookr</h1>
                    <h3 class="text-center mobile-h3">Patient Details</h3>

                    <v-sheet rounded class="pa-4">
                        <h2 class="mt-1 subtitle-1">Name: {{ this.patientData.name }}</h2>
                        <h3 class="mt-1 subtitle-2">DOB: {{
                        $moment(this.patientData.dateOfBirth).format('DD-MM-YYYY') }}</h3>
                        <h3 class="mt-3 headline">Treatment Notes:</h3>
                        <p class="mt-1 body-1">{{ this.patientData.currentTreatment }}</p>
                    </v-sheet>
                </div>
            </v-col>
        </v-row>
    </v-main>
</template>

<script>
import { useRoute } from 'vue-router';
import navBar from './navBar.vue'
const DATA_API = `${process.env.VUE_APP_BACKEND_CONNECTION}/my-patients`

export default {
    name: 'singlePatient',
    data() {
        return {
            patientData: {}
        }
    },
    components: {
        navBar
    },
    mounted() {
        const route = useRoute()
        try {
            fetch(`${DATA_API}/${route.params.patientId}`)
                .then(response => response.json())
                .then(result => {
                    this.patientData = result
                })

        } catch (error) {
            console.log('problems frontend getting single patient', error)
        }
    },
    methods: {

    }

}
</script>
<style scoped>
.main-content > h3 {
    margin-bottom: 1%;
}
</style>