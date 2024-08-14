import { createRouter, createWebHistory } from "vue-router";

import SinglePlayer from "./views/SinglePlayer.vue";
import MultiPlayer from "./views/MultiPlayer.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", redirect: "/home" },
        { path: "/home", component: SinglePlayer, name: "SinglePlayer" },
        { path: "/multiplayer/:mazeId", component: MultiPlayer, name: "MultiPlayer" },
    ],
});

export default router;
