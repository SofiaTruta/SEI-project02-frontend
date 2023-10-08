<template>
    <!-- conditional rendering: if not logged in, redirect to '/login'-->
    <div class="main-page-container">
        <h1>MAIN PAGE</h1>
        <!-- retrieve list of appointments for professional -->
        <div></div>
        <navBar />
    </div>
</template>

<script>
import navBar from './navBar.vue'


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
        }
    }
    },
    components: {
        navBar
    },
    mounted() {
        this.fetchProfessionalsData()
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
       
        //find the professional's id
        let allProfessionals = null;
        let professionalId = null;

        try {
            const response = await fetch(PROFESSIONALS_API);
            const result = await response.json();
            allProfessionals = result;

            const professional = allProfessionals.find(
                (professional) => professional.email === this.professionalData.email
            );

            professionalId = professional._id;
            this.professionalData._id = professionalId;

            this.professionalData.appointments = professional.appointments
            
            // Log professionalData after it's fully populated
            console.log('Professional Data:', this.professionalData);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, 
    async fetchAppointmentsData(){
        
    }
}
}

</script>