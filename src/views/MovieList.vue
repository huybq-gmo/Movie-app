<script setup lang="ts">
import { ref, onMounted,watchEffect  } from "vue";
import axios from "axios";
import MovieCard from "@/components/MovieCard.vue";
import Paginator from "primevue/paginator";
import { useRouter, useRoute } from "vue-router";

interface Movie {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  year: number;
  poster_url: string;
  thumb_url: string;
  genre?: string;
}

const movies = ref<Movie[]>([]);
const totalMovies = ref(0);
const title = ref("Phim Lẻ");
const route = useRoute();
const type = ref(route.params.slug as string);
console.log(type);


// Gọi API lấy danh sách phim lẻ
const fetchMovies = async (page = 1) => {
  try {
    type.value = route.params.slug as string;
    const response = await axios.get(`https://phimapi.com/v1/api/danh-sach/${type.value}?page=${page}`);
    movies.value = response.data.data.items;
    totalMovies.value = response.data.data.params.pagination.totalItems;
    // console.log("Danh sách phim lẻ:", totalMovies.value);
  } catch (error) {
    console.error("Lỗi khi tải danh sách phim lẻ:", error);
  }
};


const onPageChange = (event: { page: number }) => {
  fetchMovies(event.page + 1);
};

// onMounted(() => {
//   fetchMovies();
// });
watchEffect(() => {
  console.log('Fetching movies for:', route.params.slug); // Debug
  fetchMovies(1);
});

const router = useRouter();
const gotoMovieItem = (movie: Movie) => {
  router.push({ name: "MovieItem", params: { slug: movie.slug } });
};
</script>

<template>
  <div class="movie-container">
    <!-- Danh sách phim lẻ -->
    <div class="left-column">
      <h2 class="text-2xl font-bold text-primary mb-4">{{ title }}</h2>
      <div class="list-movies">
        <MovieCard v-for="movie in movies" :key="movie._id" :movie="movie" />
      </div>

      <!-- Phân trang -->
      <Paginator :rows="10" :totalRecords="totalMovies" @page="onPageChange" :template="{
        default: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageDropdown JumpToPageInput'
      }" />
    </div>
    <div class="right-column">
      <h2 class="text-2xl font-bold text-primary mb-4">Phim Xem Nhiều</h2>
      <div class="list-movies">
        <!-- <MovieCard v-for="movie in popularMovies" :key="movie._id" :movie="movie" /> -->
      </div>
    </div>
  </div>
</template>

<style scoped>

.movie-container {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 20px;
  color: #fafafa;
}

.list-movies {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.left-column {
  width: 100%;
}

.right-column {
  width: 100%;
  background: #2c2c2c;
  padding: 1rem;
  border-radius: 8px;
}


:deep(.p-paginator-default) {
  background-color: black;
}
</style>
