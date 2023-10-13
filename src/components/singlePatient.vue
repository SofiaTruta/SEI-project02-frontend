<template>
    <v-container>
        <v-row>
            <v-col cols="2">
                <navBar class="nav-bar" />
            </v-col>
            <v-col cols="10">
                <div class="single-patient-container">
                    <v-sheet rounded class="pa-4">
                        <h1 class="mt-4 headline">{{ this.patientData.name }}</h1>
                        <h4 class="mb-4 subtitle-2">Date of birth: {{
                            $moment(this.patientData.dateOfBirth).format('DD/MM/YYYY') }}</h4>
                        <h3 class="mb-2 headline">Treatment Notes:</h3>
                        <p class="mb-4 body-1">{{ this.patientData.currentTreatment }}</p>
                    </v-sheet>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { useRoute } from 'vue-router';
import navBar from './navBar.vue'
const DATA_API = 'http://localhost:4000/my-patients'

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
                    console.log(this.patientData)
                })
              
        } catch (error) {
            console.log('problems frontend getting single patient', error)
        }
    },
    methods: {

    }

}
</script>
<style>
@import "../assets/css/globalStyling.css";
</style>