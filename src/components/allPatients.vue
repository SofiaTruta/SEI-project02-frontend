<template>
       <navBar class="nav-bar" />
  
       <v-main class="rounded-lg ma-4">
        <v-row>
            <v-col cols="12">
                <div class="main-content">
                    <h1 class="header">Patient Bookr</h1>

                    <div class="main-info-display">
                        <h3 class="text-center">My Patients</h3>
                        <p class="text-center">(click on each patient for more details)</p>

                        <div v-if="patientList.length > 0">
                            <v-list lines="two" class="rounded-lg">
                                <v-list-item v-for="patient in patientList" :key="patient._id" class="custom-list-item" :to="'/my-patients/'+ patient._id">
                                    <h3>{{ patient.name }}</h3>
                                    <p>Date of birth: {{ $moment(patient.dateOfBirth).format('DD-MM-YYYY') }}</p>
                                </v-list-item>
                            </v-list>
                        </div>
                    </div>
                </div>
            </v-col>
        </v-row>
    </v-main>
</template>

<script>
import navBar from './navBar.vue'

const PROFESSIONALS_API = 'http://localhost:4000/professionals'

export default {
    name: 'allPatients',
    data() {
        return {
            patientList: []
        }
    },
    components: {
        navBar
    },
    mounted() {
        this.fetchPatients()
    },
    methods: {
        async fetchPatients() {

            //identify this professionalId
            const professionalCookies = this.$cookies.get('professional_data');
            const professionalEmail = professionalCookies.email

            //we are unable to get the professional details from the patient schema
            //get the same as in main page
            let allProfessionals = null
            let allAppointments = null
            let professionalId = null

            try {
                const response = await fetch(PROFESSIONALS_API)
                const result = await response.json()
                allProfessionals = result.allProfessionals;
                allAppointments = result.allAppointments

                //identifying the current professional in the professional's array
                const professional = allProfessionals.find(
                    (professional) => professional.email === professionalEmail
                );
                professionalId = professional._id;

                //go through all appointments and find the ones for this professional
                const appointmentsForProfessional = allAppointments.filter((appointment) => appointment.professionalDetails === professionalId)

                //for each appointment, if patientId not in patientList array, push it
                appointmentsForProfessional.forEach((appointment) => {
                    const patientId = appointment.patientDetails._id

                    if (!this.patientList.some((patient) => patient._id === patientId)) {
                        this.patientList.push(appointment.patientDetails)
                    }
                })
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    }
}

</script>