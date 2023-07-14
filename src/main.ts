import { createApp } from "vue";
import "./styles.css";
import router from './router';
import CUI from './components/cui'
import App from "./App.vue";

createApp(App).use(router).use(CUI).mount("#app");
