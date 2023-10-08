import { createWebHistory, createRouter } from "vue-router";

import landingPage from './src/components/landingPage'
import mainPage from './src/components/mainPage'

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
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})



export default router