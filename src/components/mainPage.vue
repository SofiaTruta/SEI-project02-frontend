<template>
    <div class="main-page-container">
        <h1>MAIN PAGE</h1>
        <button @click="createNewAppointment">create new appointment</button>

        <div v-if="showNewAppointment" class="new-appointment-container">
            <newAppointment :professionalDetails="professionalData" @new-appointment-created="refreshPatientList" />
        </div>

        <h3>Your Appointments</h3>
        <div v-if="professionalData">
            <div v-if="professionalData.appointments">
                <router-link class="appointment-list" v-for="appointment in professionalData.appointments" :to="'/appointment/' + appointment._id"
                    :key="appointment.id">
                    <h4>{{ formatDate(appointment.date) }}</h4>
                    <h5> {{ appointment.time }}</h5>
                    <p>Patient Name: {{ appointment?.patientDetails?.name }}</p>
                    <div v-if="!showNewAppointment">
                        <button @click="deleteAppointment(appointment._id)">delete</button>
                        <editAppointment :professionalData="professionalData" :appointmentData="appointment"
                            v-if="appointment._id === editingAppointmentId" />
                        <button @click="setEditAppointmentId(appointment._id)">edit</button>
                    </div>
                </router-link>
            </div>
           
        </div>
    </div>

    <navBar />
</template>

<script>
import navBar from './navBar.vue'
import newAppointment from './newAppointment.vue'
import editAppointment from './editAppointment.vue'


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
            // showEditAppointment: false
        }
    },
    components: {
        navBar,
        newAppointment,
        editAppointment
    },
    mounted() {
        this.fetchProfessionalData()
    },
    methods: {
        async fetchProfessionalData() {
            //get data from cookie
            const professionalCookies = this.$cookies.get('professional_data');
            // console.log('raw cookie:', professionalCookies);

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
                console.log(this.professionalData.appointments)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        createNewAppointment() {
            this.showNewAppointment = true
        },
        formatDate(date) {
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }
            return new Date(date).toLocaleDateString(undefined, options)
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
        async refreshPatientList() {
            this.$router.push('/home')
        }
    }
}

</script>