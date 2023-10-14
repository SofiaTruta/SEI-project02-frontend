<template>
    <v-navigation-drawer v-if="$vuetify.display.lgAndUp" image='https://i.imgur.com/NF91dzH.png' theme="light" permanent>
        <v-list color="transparent" class="nav-drawer-text">

            <v-list-item class="font-weight-bold" prepend-icon="mdi-account" title="Hello" @click="goToHome">
                <p>{{ professionalData.name
                }}</p>
            </v-list-item>

            <v-list-item prepend-icon="mdi-account-supervisor" class="nav-drawer-text-item" @click="goToAllPatients">My
                Patients</v-list-item>

            <v-list-item prepend-icon="mdi-home-circle" class="nav-drawer-text-item" @click="goToHome">Upcoming
                Appointments</v-list-item>

            <v-list-item prepend-icon="mdi-history" class="nav-drawer-text-item"
                @click="goToCompletedAppointments">Completed Appointments</v-list-item>

            <v-list-item prepend-icon="mdi-close-circle-outline" class="nav-drawer-text-item"
                @click="goToMissedAppointments">Missed Appointments</v-list-item>

            <v-list-item @click="openDialog" prepend-icon="mdi-plus-circle" class="nav-drawer-text-item">New
                Appointment</v-list-item>
        </v-list>

        <!-- dialog opens if showNewAppoint is true -->
        <v-dialog v-model="showNewAppointment" @close-appointment="closeDialog">
            <v-card class="custom-dialog-card">
                <h2>New Appointment</h2>
                <newAppointment :professionalDetails="professionalData" :showDialog="showNewAppointment"
                    @close-appointment="closeDialog" />
            </v-card>
        </v-dialog>

        <!-- logout button -->
        <template v-slot:append>
            <div class="pa-2">
                <v-btn block @click="handleLogOut">Log out</v-btn>
            </div>
        </template>
    </v-navigation-drawer>

    <!-- navbar for smaller devices -->
    <v-navigation-drawer v-if="$vuetify.display.mobile" 
    image='https://i.imgur.com/NF91dzH.png' theme="light" permanent
    expand-on-hover 
    rail>
        <v-list color="transparent" class="nav-drawer-text" density="compact" nav>

            <v-list-item class="font-weight-bold" prepend-icon="mdi-account" title="Hello" @click="goToHome">
                <p>{{ professionalData.name
                }}</p>
            </v-list-item>

            <v-list-item prepend-icon="mdi-account-supervisor" class="nav-drawer-text-item" @click="goToAllPatients">My
                Patients</v-list-item>

            <v-list-item prepend-icon="mdi-home-circle" class="nav-drawer-text-item" @click="goToHome">Upcoming
                Appointments</v-list-item>

            <v-list-item prepend-icon="mdi-history" class="nav-drawer-text-item"
                @click="goToCompletedAppointments">Completed Appointments</v-list-item>

            <v-list-item prepend-icon="mdi-close-circle-outline" class="nav-drawer-text-item"
                @click="goToMissedAppointments">Missed Appointments</v-list-item>

            <v-list-item @click="openDialog" prepend-icon="mdi-plus-circle" class="nav-drawer-text-item">New
                Appointment</v-list-item>
        </v-list>

        <!-- dialog opens if showNewAppoint is true -->
        <v-dialog v-model="showNewAppointment" @close-appointment="closeDialog">
            <v-card class="custom-dialog-card">
                <h2>New Appointment</h2>
                <newAppointment :professionalDetails="professionalData" :showDialog="showNewAppointment"
                    @close-appointment="closeDialog" />
            </v-card>
        </v-dialog>

        <!-- logout button -->
        <template v-slot:append>
            <div class="pa-2">
                <v-btn  @click="handleLogOut" icon="mdi-logout"></v-btn>
            </div>
        </template>
    </v-navigation-drawer>
</template>

<script>
// import logOutButton from './logOutButton.vue'
import newAppointment from './newAppointment.vue'
import { googleLogout } from 'vue3-google-login';

const PROFESSIONALS_API = 'http://localhost:4000/professionals'

export default {
    name: 'navBar',
    data: () => ({
        professionalData: {
            _id: '',
            email: '',
            name: '',
            specialty: '',
        },
        showNewAppointment: false,
    }),
    emits: ['update-component'],
    components: {
        // logOutButton,
        newAppointment
    },
    mounted() {
        this.fetchProfessionalData()
    },
    methods: {
        async fetchProfessionalData() {
            const professionalCookies = this.$cookies.get('professional_data');
            this.professionalData.name = professionalCookies.name;
            this.professionalData.email = professionalCookies.email;

            let allProfessionals = null
            let professionalId = null

            try {
                const response = await fetch(PROFESSIONALS_API);
                const result = await response.json();
                allProfessionals = result.allProfessionals;

                //identifying the current professional in the professional's array
                const professional = allProfessionals.find(
                    (professional) => professional.email === this.professionalData.email
                );
                professionalId = professional._id;
                this.professionalData._id = professionalId;
            } catch (error) {
                console.error('Error fetching data:', error);
            }

        },
        handleLogOut() {
            googleLogout()
            this.$cookies.remove('professional_data')
            this.$router.push('/')
        },
        openDialog() {
            this.showNewAppointment = true
        },

        closeDialog(data) {
            this.showNewAppointment = false
            this.$emit('update-component', data)
        },
        cancelNewAppointment() {
            this.showNewAppointment = false
        },
        goToHome() {
            this.$router.push('/home');
        },
        goToCompletedAppointments() {
            this.$router.push('/appointments/completed');
        },
        goToAllPatients() {
            this.$router.push('/patients')
        },
        goToMissedAppointments() {
            this.$router.push('/appointments/missed')
        }
    }
}
</script>
<style>
@import "../assets/css/navBar.css";
</style>