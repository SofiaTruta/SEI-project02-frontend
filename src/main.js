import { createApp } from 'vue'
import App from './App.vue'
import router from '../router'
import vue3GoogleLogin from 'vue3-google-login'
import vue3Cookies from 'vue3-cookies'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

import moment from 'moment'

const app = createApp(App)

app.config.globalProperties.$moment = moment

app.use(router)
app.use(vue3GoogleLogin, {
    clientId: process.env.VUE_APP_GOOGLE_CLIENT_ID
})
app.use(vue3Cookies, {
    expireTimes: "1d", // 24 hours
    path: "/", //we want them to work everywhere in the site
    domain: "",  //we want them to work globally
    secure: true, //cookie encrypted by default
    sameSite: "None"
})
app.use(vuetify)

app.mount('#app')
