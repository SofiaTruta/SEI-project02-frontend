<template>
    <v-form>
        <v-container>
            <v-row>
                <v-col cols="12" md="6">
                    <v-text-field v-model="newAppointmentData.date" label="Date" type="date" required></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field v-model="newAppointmentData.time" label="Time" type="time" required></v-text-field>
                </v-col>

                <v-col cols="12">
                    <v-text-field v-model="newAppointmentData.patientDetails.name" label="Patient Name" type="text"
                        required></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                    <v-text-field v-model="newAppointmentData.patientDetails.dateOfBirth" label="Patient's Date of Birth"
                        type="date"></v-text-field>
                </v-col>

                <v-col cols="12">
                    <v-textarea v-model="newAppointmentData.patientDetails.currentTreatment" label="Treatment Plan"
                        type="text"></v-textarea>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-btn @click="createNewAppointment">Save</v-btn>
                    <v-btn @click="this.$emit('cancelAppointment')">Cancel</v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>

<script>
const NEW_APPOINTMENT_API = 'http://localhost:4000/appointments/add-new-appointment'

export default {
    name: 'newAppointment',
    emits: ["close-dialog", "cancelAppointment"],
    props: {
        professionalDetails: {
            type: Object,
            required: true
        },
        showDialog: {
            type: Boolean,
            required: true
        }
},
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
        try {
            fetch(NEW_APPOINTMENT_API, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(this.newAppointmentData)
            })
                .then(response => response.json())
                .then(data => {
                    console.log('new appointment saved', data)
                    this.$emit('close-appointment');
                })


        } catch (error) {
            console.log('problems in the frontend submitting new appointment', error)
        }
    },
    cancelAppointment() {
        this.$emit('close-appointment')
    }
}
}
</script>