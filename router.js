import { createWebHistory, createRouter } from "vue-router";

import landingPage from './src/components/landingPage'
import mainPage from './src/components/mainPage'
import singleAppointment from './src/components/singleAppointment'
import completedAppointments from './src/components/completedAppointments'
import allPatients from './src/components/allPatients'

const routes = [
    {
        name: 'Login',
        path: '/',
        component: landingPage
    },
    {
        name: 'Home',
        path: '/home',
        component: mainPage
    },
    {
        name: 'Single Appointment',
        path: '/appointments/:appointmentId',
        component: singleAppointment
    },
    {
        name: 'Completed Appointments',
        path:'/appointments/completed',
        component: completedAppointments
    },
    {
        name: 'All Patients',
        path: '/patients',
        component: allPatients
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})



export default router