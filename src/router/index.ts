import Home from "@/views/Home.vue";
import MovieItem from "@/views/Movie-Item.vue";
import MovieList from "@/views/MovieList.vue";
import MoviePlay from "@/views/MoviePlay.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    // {
    //   path: "/category/:category",
    //   name: "category",
    //   component: MovieList,
    // },
    // {
    //   path: "/type/:slug",
    //   name: "type",
    //   component: MovieList,
    // },
    {
      path: "/:filterType(the-loai|loai-phim|quoc-gia)/:slug",
      name: "filtered-movies",
      component: MovieList,
    },
    {
      path: "/movie/:slug",
      name: "MovieItem",
      component: MovieItem,
    },
    
    {
      path: "/movie/:slug/:episode",
      name: "MoviePlay",
      component: MoviePlay,
    },
    
  ],
});

export default router;
