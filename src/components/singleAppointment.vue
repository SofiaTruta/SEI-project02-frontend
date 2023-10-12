<template>
    <v-container>
        <v-row>
            <v-col cols="2">
                <navBar class="nav-bar" />
            </v-col>
            <v-col cols="10">
                <div class="single-appointment-container">
                        <v-sheet rounded class="pa-4">
                            <h1 class="mt-4 headline">Your Appointment for {{ appointmentData?.patientDetails?.name }}</h1>
                            <h2 class="mb-4 subtitle-1">{{ $moment(appointmentData?.date).format('LL') }}</h2>
                            <h2 class="mb-4 subtitle-1"> {{ appointmentData?.time }}</h2>
                            <h3 class="mb-4 subtitle-2">Status: {{ appointmentData?.status }}</h3>
                            <h4 class="mb-4 subtitle-2">Patient's date of birth: {{
                                $moment(appointmentData?.patientDetails?.dateOfBirth).format('DD/MM/YYYY') }}</h4>
                            <h3 class="mb-2 headline">Treatment Notes:</h3>
                            <p class="mb-4 body-1">{{ appointmentData?.patientDetails?.currentTreatment }}</p>

                            <v-btn class="ma-2" @click.stop="deleteAppointment(appointmentData._id)">
                                <v-icon class="square-icon" icon="mdi-trash-can"></v-icon>
                            </v-btn>

                            <v-btn class="ma-2" @click.stop="showEditing">
                                <v-icon class="square-icon" icon="mdi-pencil"></v-icon>
                            </v-btn>

                            <v-btn class="ma-2" @click="updateAppointmentStatus(appointmentData._id, 'completed', $event)"
                                prepend-icon="mdi-check" max-height="100"> mark as completed</v-btn>

                            <div v-if="showEditAppointment">
                                <editAppointment :appointmentData="appointmentData" @editSaved="updateAppointmentData"
                                    @closeEditAppointment="cancelEditing" />
                                <v-btn @click="cancelEditing">cancel</v-btn>
                            </div>
                        </v-sheet>
                    </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { useRoute } from 'vue-router';
import navBar from './navBar.vue'
import editAppointment from './editAppointment.vue'

const DATA_API = 'http://localhost:4000/appointments'
const DELETE_APPT_API = 'http://localhost:4000/appointments'
const UPDATE_APPT_API = 'http://localhost:4000/update-appointment-status'


export default {
    name: 'singleAppointment',
    data() {
        return {
            appointmentData: {},
            showEditAppointment: false
        }
    },
    components: {
        navBar,
        editAppointment
    },
    mounted() {
        const route = useRoute()
        fetch(`${DATA_API}/${route.params.appointmentId}`)
            .then(response => response.json())
            .then(result => {
                this.appointmentData = result
            })
    },
    methods: {
        showEditing() {
            this.showEditAppointment = true
        },
        cancelEditing() {
            this.showEditAppointment = false
        },
        updateAppointmentData(updatedData) {
            this.appointmentData = updatedData;
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
        },
        async updateAppointmentStatus(appointmentId, newStatus, event) {
            event.stopPropagation()
            try {
                const response = await fetch(`${UPDATE_APPT_API}/${appointmentId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status: newStatus }),
                });
                response.status(200)
            
                this.$router.push('/home')
            } catch (error) {
                console.error('Error updating appointment status:', error);
            }
        }
    }
}
</script>
<style>
@import "../assets/css/singleAppointment.css";
</style>