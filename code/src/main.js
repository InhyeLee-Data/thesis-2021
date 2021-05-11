import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
// import VueScrollTo from 'vue-scrollto';


const app = createApp(App);
app.use(router);
app.use(ElementPlus);
// app.use(VueScrollTo);


app.mount('#app');