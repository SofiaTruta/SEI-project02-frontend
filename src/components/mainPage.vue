<template>
    <div class="main-page-container">
        <navBar class="nav-bar" />

        <div class="main-content">

            <div class="header">
                <h1>Patient Bookr</h1>
            </div>

            <div v-if="showNewAppointment" class="new-appointment-container">
                <newAppointment :professionalDetails="professionalData" :showDialog="showNewAppointment" @cancel-appointment="cancelNewAppointment" />
            </div>

            <div class="appointments-list">
                <h3>Your Upcoming Appointments</h3>
                <div v-if="professionalData">
                    <div v-if="professionalData.appointments">

                        <v-list lines="two">
                            <v-list-item v-for="appointment in professionalData.appointments" :key="appointment._id"
                                :to="'/appointments/' + appointment._id">
                                <template v-slot:default>
                                    <h4>{{ $moment(appointment.date).format('L') }}</h4>
                                    <h4>{{ appointment.time }}</h4>
                                    <p>Patient Name: {{ appointment?.patientDetails?.name }}</p>
                                </template>

                                <template v-slot:action>
                                    <div v-if="!showNewAppointment">
                                        <v-btn icon @click.stop="deleteAppointment(appointment._id)">
                                            <v-icon>mdi-delete</v-icon>
                                        </v-btn>
                                        <v-btn icon @click.stop="setEditAppointmentId(appointment._id)">
                                            <v-icon>mdi-pencil</v-icon>
                                        </v-btn>
                                    </div>
                                </template>
                            </v-list-item>
                        </v-list>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import navBar from './navBar.vue'
import newAppointment from './newAppointment.vue'
// import editAppointment from './editAppointment.vue'


const PROFESSIONALS_API = 'http://localhost:4000/professionals'
const DELETE_APPT_API = 'http://localhost:4000/appointments'



export default {
    name: 'mainPage',
    data() {
        return {
            professionalData: {
                _id: '',
                email: '',
                name: '',
                specialty: '',
                appointments: []
            },
            showNewAppointment: false,
            editingAppointmentId: null,
        }
    },
    components: {
        navBar,
        newAppointment
    },
    mounted() {
        this.fetchProfessionalData()
    },
    updated() {

    },
    methods: {
        async fetchProfessionalData() {
            //get data from cookie
            const professionalCookies = this.$cookies.get('professional_data');

            //if no cookie, send back to login
            if (!professionalCookies) {
                this.$router.push({ name: 'Login' });
                return;
            }
            //populate what we can from the cookie
            this.professionalData.email = professionalCookies.email;
            this.professionalData.name = professionalCookies.name;

            //get all the info from the database
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
                    (professional) => professional.email === this.professionalData.email
                );
                professionalId = professional._id;
                this.professionalData._id = professionalId;

                //iterate through appointments array and find only the ones for this professional
                allAppointments.forEach(appointment => {
                    if (appointment.professionalDetails === professionalId) {
                        this.professionalData.appointments.push(appointment)
                    }
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        createNewAppointment() {
            this.showNewAppointment = true
        },
        async deleteAppointment(appointmentId) {
            try {
                await fetch(`${DELETE_APPT_API}/${appointmentId}`, {
                    method: 'DELETE'
                })
                this.professionalData.appointments = this.professionalData.appointments.filter(appointment => appointment._id !== appointmentId)
            } catch (error) {
                console.log('problems deleting appointment', error)
            }
        },
        setEditAppointmentId(appointmentId) {
            this.editingAppointmentId = appointmentId
        },
        cancelNewAppointment() {
            this.showNewAppointment = false
        }
    }
}

</script>
<style scoped>
@import "../assets/css/mainPage.css";
</style>