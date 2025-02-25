import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css';
import Aura from '@primeuix/themes/aura';
import { createPinia } from 'pinia';
import Card from 'primevue/card';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';

const app = createApp(App)

app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});
const pinia = createPinia()
app.component('Card', Card);
app.component('Button', Button);

app.use(pinia)
app.mount('#app')
