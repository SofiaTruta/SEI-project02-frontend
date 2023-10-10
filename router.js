import { createWebHistory, createRouter } from "vue-router";

import landingPage from './src/components/landingPage'
import mainPage from './src/components/mainPage'
import singleAppointment from './src/components/singleAppointment'

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
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})



export default router