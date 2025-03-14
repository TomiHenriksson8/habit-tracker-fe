import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import HabitPage from "../pages/HabitPage.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/habits", component: HabitPage },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
