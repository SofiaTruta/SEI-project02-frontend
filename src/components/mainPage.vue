<template>
    <navBar class="nav-bar" @update-component="updateComponent" />

    <v-main class="rounded-lg ma-4" v-if="$vuetify.display.lgAndUp">
        <v-row>
            <v-col cols="12">
                <div class="main-content">
                    <h1 class="header">Patient Bookr</h1>

                    <div class="main-info-display">
                        <h3 class="text-center">Your Upcoming Appointments</h3>
                        <p class="text-center">(click on each appointment for more details)</p>

                            <div v-if="professionalData.appointments">
                                <v-list lines="two" class="rounded-lg">
                                    <v-list-item v-for="appointment in professionalData.appointments" :key="appointment._id"
                                        :to="'/appointments/' + appointment._id" class="custom-list-item">
                                        <h4>{{ $moment(appointment.date).format('DD-MM-YYYY') }}</h4>
                                        <h4>{{ appointment.time }}</h4>
                                        <p>Patient Name: {{ appointment?.patientDetails?.name }}</p>
                                        <p>Status: {{ appointment?.status }}</p>
                                    </v-list-item>
                                </v-list>
                            </div>
                    </div>
                </div>
            </v-col>
        </v-row>
    </v-main>

    <!-- main for mobile -->
    <v-main class="rounded-lg ma-4" v-if="$vuetify.display.mobile">
        <v-row>
            <v-col cols="12">
                <div class="main-content">
                    <h1 class="mobile-header">Patient Bookr</h1>

                    <div class="main-info-display">
                        <h3 class="text-center mobile-h3">Upcoming Appointments</h3>

                            <div v-if="professionalData.appointments">
                                <v-list lines="two" class="rounded-lg">
                                    <v-list-item v-for="appointment in professionalData.appointments" :key="appointment._id"
                                        :to="'/appointments/' + appointment._id" class="custom-list-item">
                                        <h4>{{ $moment(appointment.date).format('DD-MM-YYYY') }}</h4>
                                        <h4>{{ appointment.time }}</h4>
                                        <p>Name: {{ appointment?.patientDetails?.name }}</p>
                                        <p>Status: {{ appointment?.status }}</p>
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

const PROFESSIONALS_API = `${process.env.VUE_APP_BACKEND_CONNECTION}/professionals`
const DELETE_APPT_API = `${process.env.VUE_APP_BACKEND_CONNECTION}/appointments`
const UPDATE_APPT_STATUS_API = `${process.env.VUE_APP_BACKEND_CONNECTION}/update-appointment-status`


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
            }
        }
    },
    components: {
        navBar
    },
    mounted() {
        this.fetchProfessionalData().then(() => {
            if (this.professionalData.appointments.length > 0) {
                this.updateAppointmentStatus()
            }
        })
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
                    if (appointment.professionalDetails === professionalId && appointment.status === 'upcoming') {
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
                // this.professionalData.appointments = this.professionalData.appointments.filter(appointment => appointment._id !== appointmentId)

                const index = this.professionalData.appointments.findIndex(appointment => appointment._id === appointmentId);
                if (index !== -1) {
                    this.professionalData.appointments.splice(index, 1);
                }
            } catch (error) {
                console.log('problems deleting appointment', error)
            }
        },
        cancelNewAppointment() {
            this.showNewAppointment = false
        },
        updateComponent() {
            this.$nextTick(async () => {

                let allProfessionals = null;//array
                let allAppointments = null; //array
                let professionalId = null;
                //fetch request for list of appointments again to force the component to update
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

                    const appointmentsForThisProfessional = []
                    allAppointments.forEach(appointment => {
                        if (appointment.professionalDetails === professionalId && appointment.status === 'upcoming') {
                            appointmentsForThisProfessional.push(appointment)
                        }
                    });

                    // see if this array is any different from our data array
                    const differences = []
                    appointmentsForThisProfessional.forEach((appointment) => {
                        if (!this.professionalData.appointments.some((oldAppointment) => oldAppointment._id === appointment._id)) {
                            differences.push(appointment)
                            this.professionalData.appointments.push(appointment)
                        }
                    })
                    this.updateAppointmentStatus()
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            })
        },
        updateAppointmentStatus() {
            const now = new Date()

            this.professionalData.appointments.forEach((appointment) => {
                const appointmentId = appointment._id
                const appointmentDate = new Date(appointment.date)
                if (appointmentDate < now && appointment.status === 'upcoming') {
                    appointment.status = 'missed'
                    try {
                        fetch(`${UPDATE_APPT_STATUS_API}/${appointmentId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ status: 'missed' }),
                        })
                    } catch (error) {
                        console.log('problems updating status to missed', error)
                    }
                }
            })
        }
    }
}

</script>
<style>
@import "../assets/css/globalStyling.css";
</style>