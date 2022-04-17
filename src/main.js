import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { install as PrimeVue } from './primevue';
import 'uno.css';
import 'primeflex/primeflex.css';

const myApp = createApp(App);
myApp.use(router);
PrimeVue(myApp);
myApp.mount('#app');
