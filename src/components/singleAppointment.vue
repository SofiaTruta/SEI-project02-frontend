<template>
       <navBar class="nav-bar" />
       <v-main class="rounded-lg ma-4">
        <v-row>
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
    </v-main>
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
            const now = new Date()
            const newAppointmentDate = new Date(this.appointmentData.date)

            //if appointment.Data.date > now, change the status to 'upcoming'
            if (newAppointmentDate > now) {
                this.appointmentData.status = 'upcoming'

                //I have to find out the id of the appointment
                const appointmentId = this.appointmentData.patientDetails.appointments[0]
                try {
                    fetch(`${UPDATE_APPT_API}/${appointmentId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ status: 'upcoming' }),
                    })
                } catch (error) {
                    console.log('problems updating status to upcoming', error)
                }
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
        },
        async updateAppointmentStatus(appointmentId, newStatus, event) {
            event.stopPropagation()
            try {
                await fetch(`${UPDATE_APPT_API}/${appointmentId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status: newStatus }),
                });

                this.$router.push('/home')

            } catch (error) {
                console.error('Error updating appointment status:', error);
            }
        }
    }
}
</script>
<style>

</style>