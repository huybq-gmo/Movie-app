<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import MovieCard from "@/components/MovieCard.vue";
import Paginator from "primevue/paginator";
import { useRouter } from "vue-router";

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
const title = ref("Phim Mới Cập Nhật");
// Danh sách phim xem nhiều
const popularMovies = ref<Movie[]>([]);


// Gọi API lấy danh sách phim mới cập nhật
const fetchMovies = async (page = 1) => {
  try {
    const response = await axios.get(`https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=${page}`);
    movies.value = response.data.items;
    totalMovies.value = response.data.pagination.totalItems;
    console.log("Danh sách phim mới cập nhật:", movies.value);

  } catch (error) {
    console.error("Lỗi khi tải danh sách phim:", error);
  }

};

const fetchPopularMovies = async () => {
  try {
    const response = await axios.get("https://phimapi.com/danh-sach/phim-xem-nhieu");
    popularMovies.value = response.data.items;
  } catch (error) {
    console.error("Lỗi khi tải danh sách phim xem nhiều:", error);
  }
};
const onPageChange = (event: { page: number }) => {
  fetchMovies(event.page + 1);
};
onMounted(() => {
  fetchMovies();
  fetchPopularMovies();
});
const router = useRouter();
const gotoMovieItem = (movie: Movie) => {
  router.push({ name: "MovieItem", params: { slug: movie.slug } });
}

</script>

<template>
  <div class="movie-container">
    <!-- Cột trái: Phim Mới Cập Nhật -->
    <div class="left-column">
      <h2 class="text-2xl font-bold text-primary mb-4">Phim Mới Cập Nhật</h2>
      <div class="list-movies">
        <MovieCard v-for="movie in movies" :key="movie._id" :movie="movie" />
      </div>

      <!-- Phân trang -->
      <Paginator :rows="10" :totalRecords="totalMovies" @page="onPageChange" :template="{
        default: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageDropdown JumpToPageInput'
      }" />
    </div>

    <!-- Cột phải: Phim Xem Nhiều -->
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

/* Đáp ứng trên màn hình nhỏ */
@media (max-width: 768px) {
  .movie-container {
    grid-template-columns: 1fr;
    /* Xếp cột dọc trên màn hình nhỏ */
  }
}
:deep(.p-paginator-default){
  background-color: black;
}
</style>
