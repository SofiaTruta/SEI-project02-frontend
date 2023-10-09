<template>
    <div class="main-page-container">
        <h1>MAIN PAGE</h1>
        <button @click="showNewAppointment">create new appointment</button>
        <div v-if="createNewAppointment" class="new-appointment-container">
            <newAppointment />
        </div>

        <h3>Your Appointments</h3>
        <div v-if="professionalData.appointments">
            <div class="appointment-list" v-for="appointment in professionalData.appointments" :key="appointment.id">
                <h4>{{ formatDate(appointment.date) }}</h4>
                <!-- need to clean up date format -->
                <h4> {{ appointment.time }}</h4>
                <!-- need to find a way to get patient details here -->
                <div v-if="appointment.patientDetails">
                    <div v-if="appointment.patientDetails._id">
                        <p>Patient Name: {{ appointment.patientDetails.name }}</p>
                    </div>
                    <div v-else>
                        <p>could not get patient name</p>
                    </div>
                </div>
                <div v-else>
                    <p>could not get appointment.patientDetails</p>
                </div>
            </div>
        </div>
        <navBar />
    </div>
</template>

<script>
import navBar from './navBar.vue'
import newAppointment from './newAppointment.vue'


const PROFESSIONALS_API = 'http://localhost:4000/professionals'


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
            createNewAppointment: false
        }
    },
    components: {
        navBar,
        newAppointment
    },
    mounted() {
        this.fetchProfessionalData()
        // this.fetchPatientName()
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
                // console.log('professionals',allProfessionals)
                console.log('appointments', allAppointments)

                //identifying the current professional in the professional's array
                const professional = allProfessionals.find(
                    (professional) => professional.email === this.professionalData.email
                );
                professionalId = professional._id;
                this.professionalData._id = professionalId;
                // this.professionalData.appointments = professional.appointments

                //iterate through appointments array
                allAppointments.forEach(appointment => {
                    if(appointment.professionalDetails === professionalId){
                        this.professionalData.appointments.push(appointment)
                    }
                });
                console.log('appointments for this specific professional:', this.professionalData.appointments)

                // Log professionalData after it's fully populated
                // console.log('Professional Data:', this.professionalData);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        showNewAppointment() {
            this.createNewAppointment = true
        },
        // async fetchPatientName(patientId) {
        //     let patient = null
        //     try {
        //         const response = await fetch(`${PATIENTS_API}/${patientId}`)
        //         const result = await response.json()
        //         patient = result
        //         console.log(patient)

        //         // const patient = allPatients.find(patient =>
        //         // patient._id === patientId
        //         // )

        //         return patient.name

        //     } catch (error) {
        //         console.log('problems fetching patient data', error)
        //     }
        // }, 
        formatDate(date){
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }
            return new Date(date).toLocaleDateString(undefined, options)
        }
    }
}

</script>