import Home from "@/views/Home.vue";
import MovieItem from "@/views/Movie-Item.vue";
import MovieList from "@/views/MovieList.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/category/:category",
      name: "category",
      component: MovieList,
    },
    {
      path: "/type/:type",
      name: "type",
      component: MovieList,
    },
    {
      path: "/movie/:slug",
      name: "MovieItem",
      component: MovieItem,
    },
  ],
});

export default router;
