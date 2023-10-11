<template>
    <v-card>
        <v-layout>
            <v-navigation-drawer class="bg-blue-lighten-2" theme="light" permanent>
                <v-list color="transparent" class="nav-drawer-text">

                    <v-list-item prepend-icon="mdi-account" title="Professional:">{{ professionalData.name
                    }}</v-list-item>

                    <v-list-item prepend-icon="mdi-home-circle" class="nav-drawer-text-item"
                        @click="goToHome">Home</v-list-item>

                    <v-list-item @click="openDialog" prepend-icon="mdi-plus-circle" class="nav-drawer-text-item">New
                        Appointment</v-list-item>

                </v-list>
                <v-dialog v-model="showNewAppointment" @close-appointment="closeDialog"
                    title="Create New Appointment">
                    <v-card class="custom-dialog-card">
                        <h2>New Appointment</h2>
                        <newAppointment :professionalDetails="professionalData" :showDialog="showNewAppointment" @close-appointment="closeDialog"/>
                    </v-card>
                </v-dialog>



                <template v-slot:append>
                    <div class="pa-2">
                        <v-btn block>
                            <logOutButton />
                        </v-btn>
                    </div>
                </template>
            </v-navigation-drawer>
        </v-layout>
    </v-card>
</template>

<script>
import logOutButton from './logOutButton.vue'
import newAppointment from './newAppointment.vue'

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
        showNewAppointment: false
    }),
    components: {
        logOutButton,
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
        openDialog() {
            this.showNewAppointment = true
        },

        closeDialog() {
            console.log('trying to close!')
            this.showNewAppointment = false
        },
        cancelNewAppointment() {
            console.log('received emit!')
            this.showNewAppointment = false
        },
        goToHome() {
            this.$router.push('/home');
        }
    }
}
</script>
<style>
@import "../assets/css/navBar.css";
</style>