<template>
    <div class="single-appointment-container">
        <navBar class="nav-bar" />
        <div class="main-content">
            <v-sheet :min-height="700" :min-width="700" rounded>
                <h1>Your Appointment for {{ appointmentData?.patientDetails?.name }}</h1>
                <h2>{{ $moment(appointmentData?.date).format('L') }}</h2>
                <h2> {{ appointmentData?.time }}</h2>
                <h4>Patient's date of birth: {{ $moment(appointmentData?.patientDetails?.dateOfBirth).format('L') }}</h4>
                <h3>Treatment Notes:</h3>
                <p>{{ appointmentData?.patientDetails?.currentTreatment }}</p>

                <v-btn icon @click.stop="deleteAppointment(appointmentData._id)">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>

                <v-btn icon @click.stop="showEditing">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>

                <div v-if="showEditAppointment">
                    <editAppointment :appointmentData="appointmentData" @editSaved="updateAppointmentData"
                        @closeEditAppointment="cancelEditing" />
                    <v-btn @click="cancelEditing">cancel</v-btn>
                </div>

            </v-sheet>
        </div>
    </div>
</template>

<script>
import { useRoute } from 'vue-router';
import navBar from './navBar.vue'
import editAppointment from './editAppointment.vue'

const DATA_API = 'http://localhost:4000/appointments'
const DELETE_APPT_API = 'http://localhost:4000/appointments'


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
        console.log(route.params.appointmentId)
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
        }
    }
}
</script>

<style>
@import '../assets/css/singleAppointment.css';
</style>