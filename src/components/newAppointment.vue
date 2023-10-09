<template>
    <form class="new-appointment-container">
        <label for="new-appointment-date">Date</label>
        <input type="date" v-model="newAppointmentData.date" name="new-appointment-date" id="new-appointment-date">

        <label for="new-appointment-time">Time</label>
        <input type="text" v-model="newAppointmentData.time" name="new-appointment-time" id="new-appointment-time"
            placeholder="17:00">

        <label for="new-appointment-name">Patient Name</label>
        <input type="text" v-model="newAppointmentData.patientDetails.name" name="new-appointment-name"
            id="new-appointment-name" placeholder="Jane Doe">

        <label for="new-appointment-dateOfBirth">Patient's date of birth</label>
        <input type="date" v-model="newAppointmentData.patientDetails.dateOfBirth" name="new-appointment-dateOfBirth"
            id="new-appointment-dateOfBirth" placeholder="patient's date of birth">

        <label for="new-appointment-treatment">Treatment Plan</label>
        <input type="textarea" v-model="newAppointmentData.patientDetails.currentTreatment" name="new-appointment-treatment"
            id="new-appointment-treatment" placeholder="treatment details here">

        <button @click="createNewAppointment">save</button>
        <button @click="cancel">cancel</button>
    </form>
</template>

<script>
const NEW_APPOINTMENT_API = 'http://localhost:4000/appointments/add-new-appointment'

export default {
    name: 'newAppointment',
    props: {
        professionalDetails: {
            type: Object,
            required: true
        }
    },
    emits: ["new-appointment-created"],
    data() {
        return {
            newAppointmentData: {
                date: '',
                time: '',
                patientDetails: {
                    name: '',
                    dateOfBirth: '',
                    appointments: '',
                    currentTreatment: ''
                },
                professionalDetails: {
                    ...this.professionalDetails
                }
            }
        }
    },
    methods: {
        createNewAppointment() {
            //make the dates rights
            const isoDate = new Date(this.newAppointmentData.date).toISOString().split('T')[0]
            this.newAppointmentData.date = isoDate

            const isoDateOfBirth = new Date(this.newAppointmentData.patientDetails.dateOfBirth).toISOString().split('T')[0]
            this.newAppointmentData.patientDetails.dateOfBirth = isoDateOfBirth

            try {
                fetch(NEW_APPOINTMENT_API, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(this.newAppointmentData)
                })
                    .then(response => response.json())
                    .then(data =>{
                        console.log('new appointment saved', data)
                        this.$emit('new-appointment-created')  //custom signal to parent component
                    })
            } catch (error) {
                console.log('problems in the frontend submitting new appointment', error)
            }

        },
        cancel() {
            this.showNewAppointment = false
        }
    }
}
</script>