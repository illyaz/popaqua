import {createApp} from 'vue'
import App from './App.vue'
import './main.css'
import {VueReCaptcha} from "vue-recaptcha-v3";

createApp(App)
    .use(VueReCaptcha, {
        siteKey: import.meta.env.VITE_RECAPTCHA_PUBLIC_KEY, loaderOptions:
            {
                useRecaptchaNet: true,
                autoHideBadge: true
            }
    })
    .mount('#app')
