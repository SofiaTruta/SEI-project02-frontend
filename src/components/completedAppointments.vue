<template>
    <navBar class="nav-bar" />

    <v-main class="rounded-lg ma-4" v-if="$vuetify.display.lgAndUp">
        <v-row>
            <v-col cols="12">
                    <div class="main-content">
                        <h1 class="header">Patient Bookr</h1>

                        <div class="main-info-display">
                            <h3 class="text-center">Your Completed Appointments</h3>
                            <p class="text-center">(click on each appointment for more details)</p>

                            <div v-if="pastAppointments">
                                <v-list lines="two" class="rounded-lg">
                                    <v-list-item v-for="appointment in pastAppointments" :key="appointment._id"
                                        :to="'/appointments/' + appointment._id">
                                        <v-row align="center">
                                            <v-col cols="8">
                                                <h4>{{ $moment(appointment.date).format('DD-MM-YYYY') }}</h4>
                                                <h4>{{ appointment.time }}</h4>
                                                <p>Patient Name: {{ appointment?.patientDetails?.name }}</p>
                                            </v-col>

                                            <v-col cols="4" class="text-right">
                                                <v-btn class="ma-2" @click="deleteAppointment(appointment._id, $event)">
                                                    <v-icon class="square-icon" icon="mdi-trash-can"></v-icon>
                                                </v-btn>
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

    <!-- view for mobile -->
    <v-main class="rounded-lg ma-4" v-if="$vuetify.display.mobile">
        <v-row>
            <v-col cols="12">
                    <div class="main-content">
                        <h1 class="mobile-header">Patient Bookr</h1>

                        <div class="main-info-display">
                            <h3 class="text-center mobile-h3">Completed Appointments</h3>

                            <div v-if="pastAppointments">
                                <v-list lines="two" class="rounded-lg">
                                    <v-list-item v-for="appointment in pastAppointments" :key="appointment._id"
                                        :to="'/appointments/' + appointment._id">
                                        <v-row align="center">
                                            <v-col cols="8">
                                                <h4>{{ $moment(appointment.date).format('DD-MM-YYYY') }}</h4>
                                                <h4>{{ appointment.time }}</h4>
                                                <p>Name: {{ appointment?.patientDetails?.name }}</p>
                                            </v-col>

                                            <v-col cols="4" class="text-right">
                                                <v-btn class="ma-2" @click="deleteAppointment(appointment._id, $event)">
                                                    <v-icon class="square-icon" icon="mdi-trash-can"></v-icon>
                                                </v-btn>
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
import navBar from './navBar.vue'

const DELETE_APPT_API = `${process.env.VUE_APP_BACKEND_CONNECTION}/appointments`
const PROFESSIONALS_API = `${process.env.VUE_APP_BACKEND_CONNECTION}/professionals`

export default {
    name: 'completedAppointments',
    components: {
        navBar
    },
    data() {
        return {
            pastAppointments: []
            //keys for each appointment = date, patientDetails, professionalDetails, status, time, _id
        }
    },
    mounted() {
        this.fetchCompletedAppointments()
    },
    methods: {
        async fetchCompletedAppointments() {
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
                    if (appointment.status === 'completed') {
                        this.pastAppointments.push(appointment)
                    }
                })
            } catch (error) {
                console.log('problems in frontend completed appts', error)
            }
        },
        async deleteAppointment(appointmentId, event) {
            event.preventDefault()
            try {
                await fetch(`${DELETE_APPT_API}/${appointmentId}`, {
                    method: 'DELETE'
                })

                this.pastAppointments.map((appointment) => {
                    if (appointment._id === appointmentId) {
                        this.pastAppointments.splice(appointment, 1)
                    }
                })

            } catch (error) {
                console.log('problems deleting appointment', error)
            }
        }
    }
}
</script>

