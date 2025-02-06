import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import HabitPage from "../pages/HabitPage.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/habits", component: HabitPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
