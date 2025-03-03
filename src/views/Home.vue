<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import MovieCard from "@/components/MovieCard.vue";
import Paginator from "primevue/paginator";
import { useRouter } from "vue-router";
import { formateUrl } from "@/utils/utils";
import { useSearchStore } from "@/store/searchStore";

interface Movie {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  year: number;
  poster_url: string;
  thumb_url: string;
  genre?: string;
  episode_current?:string 
}


const movies = ref<Movie[]>([]);
const totalMovies = ref(0);
const title = ref("Phim Mới Cập Nhật");


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


const onPageChange = (event: { page: number }) => {
  fetchMovies(event.page + 1);
};
onMounted(() => {
  fetchMovies();
});

const getRecentMovies = () => {
  const saved = localStorage.getItem("recentMovies");
  return saved ? JSON.parse(saved) : [];
};
const recentMovies = ref<Movie[]>(getRecentMovies());

const saveToRecent = (movie: Movie) => {
  let recent = getRecentMovies();
  recent = recent.filter((m: Movie) => m._id !== movie._id);
  recent.unshift(movie);
  recent = recent.slice(0, 5);
  localStorage.setItem("recentMovies", JSON.stringify(recent));
  recentMovies.value = recent;
};

const router = useRouter();
const gotoMovieItem = (movie: Movie) => {
  saveToRecent(movie);
  
  
  console.log(movie);
  
  router.push({ name: "MovieItem", params: { slug: movie.slug } });
}
// search 
const searchStore = useSearchStore();
const searchQuery = computed(() => searchStore.searchQuery);
watch(
  searchQuery,
  async (newQuery) => {
    if (newQuery.trim()) {
      const response = await axios.get(
        `https://phimapi.com/v1/api/tim-kiem?keyword=${encodeURIComponent(newQuery)}&page=1`
      );
      movies.value = response.data.data.items;
      totalMovies.value = response.data.data.params.pagination.totalItems;
      console.log(totalMovies.value);
      
    } else {
      fetchMovies(1);
    }
  },
  { immediate: true }
);

// Thêm computed property để lọc phim
const filteredMovies = computed(() => {
  if (!searchQuery.value) return movies.value;
  console.log('search');
  
  
  return movies.value.filter(movie => 
    movie.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    movie.origin_name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<template>
  <div class="movie-container">
    

    <!-- Cột trái: Phim Mới Cập Nhật -->
    <div class="left-column">
      <h2 class="text-2xl font-bold text-primary mb-4">
        {{ searchQuery ? `Kết quả tìm kiếm: "${searchQuery}"` : title }}
      </h2>
      
      <!-- Hiển thị thông báo khi không có kết quả -->
      <p v-if="searchQuery && filteredMovies.length === 0" class="text-gray-400">
        Không tìm thấy kết quả nào cho "{{ searchQuery }}"
      </p>

      <div class="list-movies">
        <MovieCard v-for="movie in filteredMovies" :key="movie._id" :movie="movie" @click="gotoMovieItem(movie)"/>
      </div>

      <!-- Phân trang -->
      <Paginator :rows="10" :totalRecords="totalMovies" @page="onPageChange" :template="{
        default: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageDropdown JumpToPageInput'
      }" />
    </div>

    <!-- Cột phải: Phim Xem Nhiều -->
    <div class="right-column">
      <h2 class="trending-title">Phim đã xem gần đây</h2>
        <ul v-if="recentMovies.values" class="recent-movie">
          <li
            v-for="movie in recentMovies"
            :key="movie._id"
            class="trending-item"
            @click="gotoMovieItem(movie)"
          >
            <img
              :src="formateUrl(movie.thumb_url)"
              :alt="movie.name"
              class="trending-poster"
            />
            <div class="trending-info">
              <h3>{{ movie.name }}</h3>
              <p>{{ movie.year }} • {{ movie.episode_current }}</p>
            </div>
          </li>
        </ul>
        <p v-else>Bạn chưa xem phim nào!</p>
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


.trending-movies {
    flex: 1;
    background: #222;
    padding: 15px;
    border-radius: 10px;
}
.recent-movie{
  
  padding-left: 0;
}

.trending-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
}

.trending-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 0;
    border-bottom: 1px solid #333;
}
.trending-item img{
    width: 80px;
} 

.trending-item:last-child {
    border-bottom: none;
}

.trending-poster {
    width: 60px;
    height: 80px;
    border-radius: 5px;
}

.trending-info h3 {
    font-size: 16px;
    margin: 0;
}

.trending-info p {
    font-size: 12px;
    color: gray;
}

/* Đáp ứng trên màn hình nhỏ */
@media (max-width: 768px) {
  .movie-container {
    display: flex;
    flex-direction: column;
  }

  .right-column {
    order: -1; /* Đưa danh sách phim đã xem lên trên */
    background: #1e1e1e;
    padding: 0.5rem;
  }

  .list-movies {
    justify-content: center;
  }

  .trending-item {
    flex-direction: column;
    text-align: center;
  }

  .trending-item img {
    width: 100px;
    height: auto;
  }

  .trending-info h3 {
    font-size: 14px;
  }

  .trending-info p {
    font-size: 10px;
  }
  
}

:deep(.p-paginator-default){
  background-color: black;
}
</style>
