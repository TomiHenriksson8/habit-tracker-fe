import { createRouter, createWebHistory } from "vue-router";
import HabitPage from "../pages/HabitPage.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import AddHabit from "../components/AddHabit.vue";
import HabitDetail from "../pages/HabitDetail.vue";
import { defineAsyncComponent } from "vue";

const Profile = defineAsyncComponent(() => import("../pages/Profile.vue"));

const routes = [
  { path: "/", component: HabitPage },
  { path: "/add-habit", component: AddHabit },
  { path: "/habit/:id", component: HabitDetail },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/profile", component: Profile },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
