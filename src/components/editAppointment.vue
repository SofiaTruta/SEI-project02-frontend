<template>
    <div v-if="editAppointmentData">
        <v-form>
            <v-container>
                <v-row>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="editAppointmentData.date" label="Date" type="date" required></v-text-field>
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-text-field v-model="editAppointmentData.time" label="Time" type="time" required></v-text-field>
                    </v-col>

                    <v-col cols="12">
                        <v-text-field v-model="editAppointmentData.patientDetails.name" label="Patient Name" type="text"
                            required></v-text-field>
                        <span class="error-message" v-if="dateOfBirthError">Date of birth must be in the past.</span>
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-text-field v-model="editAppointmentData.patientDetails.dateOfBirth"
                            label="Patient's Date of Birth" type="date"></v-text-field>
                    </v-col>

                    <v-col cols="12">
                        <v-textarea v-model="editAppointmentData.patientDetails.currentTreatment" label="Treatment Plan"
                            type="text"></v-textarea>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-btn @click="saveEditAppointment(this.appointmentData._id)">Save</v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
    </div>
</template>

<script>

const EDIT_APPT_API = `${process.env.VUE_APP_BACKEND_CONNECTION}/appointments/edit-appointment`

export default {
    name: 'editAppointment',
    props: {
        professionalData: {
            type: Object
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
            },
            dateOfBirthError: false
        }

    },
    beforeMount() {
        //format the date so vuetify likes it and displays it before we edit
        this.editAppointmentData.date = this.formatDate(this.appointmentData.date)
        this.editAppointmentData.patientDetails.dateOfBirth = this.formatDate(this.appointmentData.patientDetails.dateOfBirth)
    },
    methods: {
        async saveEditAppointment(appointmentId) {
            try {
                //check if dateOfBirth in the past
                const selectedDateOfBirth = new Date(this.editAppointmentData.patientDetails.dateOfBirth)
                const today = new Date()
                if (selectedDateOfBirth >= today) {
                    this.dateOfBirthError = true
                    return;
                }
                //if no error, proceed
                this.dateOfBirthError = false;

                await fetch(`${EDIT_APPT_API}/${appointmentId}`, {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(this.editAppointmentData)
                })
                this.$emit('editSaved', this.editAppointmentData)
                this.$emit('closeEditAppointment');

            } catch (error) {
                console.log('problems editing appointment frontend', error)
            }
        },
        formatDate(date){
            return this.$moment(date).format('YYYY-MM-DD')
        }
    }
}

</script>