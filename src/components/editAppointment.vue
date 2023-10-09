<template>
    <div v-if="editAppointmentData">
        <form class="edit-appointment-container">
            <label for="edit-appointment-date">Date</label>
            <input type="date" v-model="editAppointmentData.date" name="edit-appointment-date" id="edit-appointment-date">

            <label for="edit-appointment-time">Time</label>
            <input type="text" v-model="editAppointmentData.time" name="edit-appointment-time" id="edit-appointment-time"
                placeholder="17:00">

            <label for="edit-appointment-name">Patient Name</label>
            <input type="text" v-model="editAppointmentData.patientDetails.name" name="edit-appointment-name"
                id="edit-appointment-name" placeholder="Jane Doe">

            <label for="edit-appointment-dateOfBirth">Patient's date of birth</label>
            <input type="date" v-model="editAppointmentData.patientDetails.dateOfBirth" name="edit-appointment-dateOfBirth"
                id="edit-appointment-dateOfBirth" placeholder="patient's date of birth">

            <label for="edit-appointment-treatment">Treatment Plan</label>
            <input type="textarea" v-model="editAppointmentData.patientDetails.currentTreatment"
                name="edit-appointment-treatment" id="edit-appointment-treatment" placeholder="treatment details here">

            <button @click="saveEditAppointment(this.appointmentData._id)">save</button>
            <button>cancel</button>
        </form>
    </div>
</template>

<script>

const EDIT_APPT_API = 'http://localhost:4000/appointments/edit-appointment'

export default {
    name: 'editAppointment',
    props: {
        professionalData: {
            type: Object,
            required: true
        },
        appointmentData: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            editAppointmentData: {
                date: this.appointmentData.date,
                time: this.appointmentData.time,
                patientDetails: {
                    name: this.appointmentData.patientDetails.name,
                    dateOfBirth: this.appointmentData.patientDetails.dateOfBirth,
                    appointments: this.appointmentData.patientDetails.appointments,
                    currentTreatment: this.appointmentData.patientDetails.currentTreatment,
                    _id: this.appointmentData.patientDetails._id
                }
            }
        }
    },
    methods: {
        async saveEditAppointment(appointmentId) {
            const isoDate = new Date(this.editAppointmentData.date).toISOString().split('T')[0]
            this.editAppointmentData.date = isoDate

            const isoDateOfBirth = new Date(this.editAppointmentData.patientDetails.dateOfBirth).toISOString().split('T')[0]
            this.editAppointmentData.patientDetails.dateOfBirth = isoDateOfBirth

            console.log(isoDate)

            try {
                await fetch(`${EDIT_APPT_API}/${appointmentId}`, {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(this.editAppointmentData)
                })
                // this.appointments.push({})
            } catch (error) {
                console.log('problems editing appointment frontend', error)
            }
        }
    }
}

</script>