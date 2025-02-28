<script setup lang="ts">
import { ref, onMounted, watchEffect, watch, computed } from "vue";
import axios from "axios";
import MovieCard from "@/components/MovieCard.vue";
import Paginator from "primevue/paginator";
import { useRouter, useRoute } from "vue-router";
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
}

const movies = ref<Movie[]>([]);
const totalMovies = ref(0);
const route = useRoute();
const filterType = ref(route.params.filterType as string);
const slug = ref(route.params.slug as string);
console.log(filterType.value);
const recentMovies = ref<Movie[]>([]);
// Gọi API lấy danh sách phim lẻ
const fetchMovies = async (page = 1) => {
  try {
   
      if (filterType.value === "loai-phim") {
      slug.value = route.params.slug as string;
      const response = await axios.get(
        `https://phimapi.com/v1/api/danh-sach/${slug.value}?page=${page}`
      );
      movies.value = response.data.data.items;
      totalMovies.value = response.data.data.params.pagination.totalItems;
    } else if (filterType.value === "quoc-gia") {
      slug.value = route.params.slug as string;
      const response = await axios.get(
        ` https://phimapi.com/v1/api/quoc-gia/${slug.value}?page=${page}`
      );
      movies.value = response.data.data.items;
      totalMovies.value = response.data.data.params.pagination.totalItems;
    } else {
      slug.value = route.params.slug as string;
      const response = await axios.get(
        ` https://phimapi.com/v1/api/the-loai/${slug.value}?page=${page}`
      );
      movies.value = response.data.data.items;
      totalMovies.value = response.data.data.params.pagination.totalItems;
    }
    
    // const response = await axios.get(
    //   `https://phimapi.com/v1/api/danh-sach/${slug.value}?page=${page}`
    // );
    // movies.value = response.data.data.items;
    // totalMovies.value = response.data.data.params.pagination.totalItems;
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
  filterType.value = route.params.filterType as string;
  slug.value = route.params.slug as string;
  console.log("Fetching movies for:", route.params.slug); // Debug
  fetchMovies(1);
});

const router = useRouter();

const getRecentMovies = () => {
  const saved = localStorage.getItem("recentMovies");
  return saved ? JSON.parse(saved) : [];
};

const saveToRecent = (movie: Movie) => {
  let recent = getRecentMovies();
  recent = recent.filter((m: Movie) => m._id !== movie._id);
  recent.unshift(movie);
  recent = recent.slice(0, 5);
  localStorage.setItem("recentMovies", JSON.stringify(recent));
  recentMovies.value = recent;
};

const gotoMovieItem = (movie: Movie) => {
  saveToRecent(movie);

  router.push({ name: "MovieItem", params: { slug: movie.slug } });
};
onMounted(() => {
  recentMovies.value = getRecentMovies();
});
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
//title
const title = computed(() => {
  if (searchQuery.value.trim()) {
    return `Kết quả tìm kiếm: "${searchQuery.value}"`;
  }
  
  if (filterType.value === "loai-phim") {
    switch (slug.value) {
      case "phim-le": return "Phim Lẻ";
      case "phim-bo": return "Phim Bộ";
      case "hoat-hinh": return "Hoạt Hình";
      default: return "Danh Sách Phim";
    }
  } else if (filterType.value === "quoc-gia") {
    switch (slug.value) {
      case "viet-nam": return "Phim Việt Nam";
      case "han-quoc": return "Phim Hàn Quốc";
      case "au-my": return "Phim Mỹ";
      case "nhat-ban": return "Phim Nhật Bản";
      default: return "Phim " + slug.value.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
  } else if (filterType.value === "the-loai") {
    switch (slug.value) {
      case "hanh-dong": return "Thể Loại: Hành Động";
      case "hai-huoc": return "Thể Loại: Hài Hước";
      case "kinh-di": return "Thể Loại: Kinh Dị";
      case "tinh-cam": return "Thể Loại: Tình Cảm";
      case "vien-tuong": return "Thể Loại: Viễn Tưởng";
      default: return "Thể Loại: " + slug.value.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
  }
  
  return "Danh Sách Phim";
});
</script>

<template>
  <div class="movie-container">
    <div class="left-column">
      <!-- Cập nhật tiêu đề khi đang tìm kiếm -->
      <h2 class="text-2xl font-bold text-primary mb-4">
        {{ searchQuery ? `Kết quả tìm kiếm: "${searchQuery}"` : title }}
      </h2>
      
      <!-- Hiển thị thông báo khi không có kết quả -->
      <p v-if="searchQuery && movies.length === 0" class="text-gray-400">
        Không tìm thấy kết quả nào cho "{{ searchQuery }}"
      </p>

      <div class="list-movies">
        <MovieCard
          v-for="movie in movies"
          :key="movie._id"
          :movie="movie"
          @click="gotoMovieItem(movie)"
        />
      </div>

      <!-- Chỉ hiện phân trang khi không đang tìm kiếm -->
      <Paginator
        v-if="!searchQuery"
        :rows="10"
        :totalRecords="totalMovies"
        @page="onPageChange"
        :template="{
          default:
            'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageDropdown JumpToPageInput',
        }"
      />
    </div>
    <div class="right-column">
      <div class="trending-movies">
        <h2 class="trending-title">Phim đã xem gần đây</h2>
        <ul v-if="recentMovies.values" class="recent-movie">
          <li
            v-for="movie in recentMovies"
            :key="movie.id"
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
:deep(.p-paginator-default) {
  background-color: black;
}
</style>
