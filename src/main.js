import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { install as PrimeVue } from './primevue';
import { install as Pinia } from './store';
import 'primeflex/primeflex.css';

const myApp = createApp(App);
myApp.use(router);
PrimeVue(myApp);
Pinia(myApp);
myApp.mount('#app');
