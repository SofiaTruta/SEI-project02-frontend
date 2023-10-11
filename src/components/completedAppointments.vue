<template>
    <v-container>
        <v-row>
            <v-col cols="2">
                <navBar class="nav-bar" />
            </v-col>
            <v-col cols="10">
            <div class="completed-appointments-container">

                
                    <div class="main-content">
                        <div class="header">
                            <h1>Patient Bookr</h1>
                        </div>

                        <div class="appointments-list">
                            <h3>Your Completed Appointments</h3>
                            <div v-if="pastAppointments">

                                <v-list lines="two">
                                    <v-list-item v-for="appointment in pastAppointments" :key="appointment._id"
                                        :to="'/appointments/' + appointment._id">
                                        <v-row align="center">
                                            <v-col cols="8">
                                                <h4>{{ $moment(appointment.date).format('DD/MM/YYYY') }}</h4>
                                                <h4>{{ appointment.time }}</h4>
                                                <p>Patient Name: {{ appointment?.patientDetails?.name }}</p>
                                            </v-col>
                                            <!-- INSERT DELETE BUTTON HERE -->
                                            <v-col cols="4" class="text-right">
                                                <v-btn class="ma-2" @click.stop="deleteAppointment(appointment._id)">
                                                    <v-icon class="square-icon" icon="mdi-trash-can"></v-icon>
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-list-item>
                                </v-list>
                            </div>
                        </div>
                    </div>
            </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import navBar from './navBar.vue'

const ALL_APPOINTMENTS_DATA = 'http://localhost:4000/appointments'
const DELETE_APPT_API = 'http://localhost:4000/appointments'

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
            try {
                //get data from database
                let allAppointments = null
                const response = await fetch(ALL_APPOINTMENTS_DATA)
                const result = await response.json()
                allAppointments = result

                //filter based on status and push into pastAppointments array
                allAppointments.forEach(appointment => {
                    if (appointment.status === 'completed') {
                        this.pastAppointments.push(appointment)
                    }
                })

                console.log(this.pastAppointments)

            } catch (error) {
                console.log('problems in frontend completed appts', error)
            }
        },
        async deleteAppointment(appointmentId) {
            try {
                await fetch(`${DELETE_APPT_API}/${appointmentId}`, {
                    method: 'DELETE'
                })
                this.$router.push('/home');
            } catch (error) {
                console.log('problems deleting appointment', error)
            }
        }
    }
}
</script>

<style>
@import "../assets/css/completedAppointments.css";
</style>