<template>
    <navBar class="nav-bar" />

    <v-main class="rounded-lg ma-4">
        <v-row>
            <v-col cols="12">
                    <div class="main-content">
                        <h1 class="header">Patient Bookr</h1>

                        <div class="main-info-display">
                            <h3 class="text-center">Your Missed Appointments</h3>
                            <p class="text-center">(click on each appointment for more details)</p>

                            <div v-if="missedAppointments">
                                <v-list lines="two" class="rounded-lg">
                                    <v-list-item v-for="appointment in missedAppointments" :key="appointment._id"
                                        :to="'/appointments/' + appointment._id">
                                        <v-row align="center">
                                            <v-col cols="8">
                                                <h4>{{ $moment(appointment.date).format('DD/MM/YYYY') }}</h4>
                                                <h4>{{ appointment.time }}</h4>
                                                <p>Patient Name: {{ appointment?.patientDetails?.name }}</p>
                                            </v-col>
                                        </v-row>
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

import navBar from './navBar.vue';

const PROFESSIONALS_API = 'http://localhost:4000/professionals'

export default {
    name: 'missedAppointments',
    data() {
        return {
            missedAppointments: []
            //keys for each appointment = date, patientDetails, professionalDetails, status, time, _id
        }
    },
    components: {
        navBar
    },
    mounted() {
        this.fetchMissedAppointments()
    },
    methods: {
        async fetchMissedAppointments() {
            //get data from cookie
            const professionalCookies = this.$cookies.get('professional_data');

            if (!professionalCookies) {
                this.$router.push({ name: 'Login' });
                return
            }

            const professionalEmail = professionalCookies.email

            let allProfessionals = null;//array
            let allAppointments = null; //array
            let professionalId = null;

            try {
                const response = await fetch(PROFESSIONALS_API);
                const result = await response.json();
                allProfessionals = result.allProfessionals;
                allAppointments = result.allAppointments

                //identifying the current professional in the professional's array
                const professional = allProfessionals.find(
                    (professional) => professional.email === professionalEmail
                );
                professionalId = professional._id;

                const appointmentsForThisProfessional = []

                allAppointments.forEach(appointment => {
                    if (appointment.professionalDetails === professionalId) {
                        appointmentsForThisProfessional.push(appointment)
                    }
                });

                //filter based on status and push into pastAppointments array
                appointmentsForThisProfessional.forEach(appointment => {
                    if (appointment.status === 'missed') {
                        this.missedAppointments.push(appointment)
                    }
                })
            } catch (error) {
                console.log('problems in frontend missed appts', error)
            }
        }
    }
}
</script>