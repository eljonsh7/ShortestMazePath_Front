import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
import router from "./router";

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App);

app.use(Toast, {
    transition: "Vue-Toastification__bounce",
    maxToasts: 3,
    newestOnTop: true,
});

app.use(router).mount("#app");
