<script setup lang="ts">
import { ref, onMounted, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import Rating from "primevue/rating";
import Tag from "primevue/tag";
import Button from "primevue/button";
import Carousel from "primevue/carousel";

const route = useRoute();
const movie = ref<any>(null);
const newMovies = ref<any>(null);
const relatedMovies = ref<any>(null);
const typeMovie = ref<any>('hanh-dong');

const fetchMovieDetail = async () => {
    try {
        const response = await axios.get(`https://phimapi.com/phim/${route.params.slug}`);
        movie.value = response.data;
        typeMovie.value=movie.value.movie.category[0]?.slug;
        console.log(typeof(typeMovie.value));

    } catch (error) {
        console.error("Lỗi khi tải thông tin phim:", error);
    }
};

const fetchRelatedMovies = async (typeMovie:string) => {
    try {
        const res = await axios.get(`https://phimapi.com/v1/api/the-loai/${typeMovie}`)
        relatedMovies.value = res.data.data.items
        console.log(relatedMovies.value);

    }
    catch (error) {
        console.error("Lỗi khi tải thông tin phim:", error);
    }

}
const fetchNewMovies = async () => {
    try {
        const res = await axios.get(`https://phimapi.com/danh-sach/phim-moi-cap-nhat`);
        newMovies.value = res.data.items;
        console.log(newMovies.value);
        
    } catch (error) {
        console.error("Lỗi khi tải danh sách phim mới:", error);
    }
};
watchEffect(()=>{
    fetchMovieDetail();
    fetchRelatedMovies(typeMovie.value);
    fetchNewMovies();
})
onMounted(() => {
    fetchMovieDetail();
    fetchRelatedMovies(typeMovie.value);
    fetchNewMovies();
});

const activeTab = ref('info');
const router = useRouter();
const gotoMovieDetail = (slug:string) => {
  router.push(`/movie/${slug}`);
};

const responsiveOptions = ref([
    {
        breakpoint: '1400px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1
    },
    {
        breakpoint: '767px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '575px',
        numVisible: 1,
        numScroll: 1
    }
]);

</script>

<template>
    <div v-if="movie" class="container">
        <!-- PHẦN CHÍNH CHIA HAI CỘT -->
        <div class="main-content">
            <!-- CỘT BÊN TRÁI: THÔNG TIN PHIM -->
            <div class="movie-detail">
                <div class="movie-header">
                    <div class="movie-poster">
                        <img :src="movie.movie.poster_url" :alt="movie.movie.name" />
                    </div>
                    <div class="movie-info">
                        <h1>{{ movie.movie.name }}</h1>
                        <h3>{{ movie.movie.origin_name }}</h3>
                        <p class="year-country">
                            {{ movie.movie.year }} • {{ movie.movie.country[0]?.name }} (Lượt xem {{ movie.movie.view
                            }})
                        </p>

                        <div class="rating">
                            <Rating v-model="movie.movie.rating" readonly :cancel="false" />
                            <span>({{ movie.movie.rating }} đánh giá)</span>
                        </div>

                        <div class="genres">
                            <Tag v-for="genre in movie.movie.category" :key="genre.id" class="genre-tag">
                                {{ genre.name }}
                            </Tag>
                        </div>

                        <div class="buttons">
                            <Button label="Xem ngay" icon="pi pi-play" class="watch-btn" />
                            <Button label="Lưu yêu thích" icon="pi pi-heart" class="favorite-btn" />
                        </div>
                        <div v-if="movie.episodes?.length" class="episode-list">
                            <h2>Chọn tập</h2>
                            <div class="episodes">
                                <Button v-for="(ep, index) in movie.episodes[0]?.server_data" :key="index"
                                    class="episode-btn">
                                    {{ index + 1 }}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- TÓM TẮT -->
                <div class="tabs-container">
                    <div class="tabs">
                        <Button :class="{ active: activeTab === 'info' }" @click="activeTab = 'info'">Thông tin</Button>
                        <Button :class="{ active: activeTab === 'actors' }" @click="activeTab = 'actors'">Diễn
                            viên</Button>
                    </div>

                    <div v-if="activeTab === 'info'" class="tab-content">
                        <h2>Tóm tắt</h2>
                        <p>{{ movie.movie.content }}</p>
                    </div>

                    <div v-if="activeTab === 'actors'" class="actor-list">
                        <h2>Diễn viên</h2>
                        <ul>
                            <li v-for="(actor, index) in movie.movie.actor" :key="index">{{ actor }}</li>
                        </ul>
                    </div>
                </div>

                <div class="new-movies">
                    <h2>Phim mới ra mắt</h2>
                   <div class="carousel">
                    <Carousel :value="newMovies" :numVisible="3" :numScroll="1" circular :autoplayInterval="3000" :responsive-options="responsiveOptions">
                        <template #item="slotProps">
                            <div class="new-movie-item" @click="gotoMovieDetail(slotProps.data.slug)">
                                <img :src="slotProps.data.thumb_url" :alt="slotProps.data.name" class="new-movie-poster" />
                                <div class="new-movie-info">
                                    <h3>{{ slotProps.data.name }}</h3>
                                    
                                </div>
                            </div>
                        </template>
                    </Carousel>
                   </div>
                </div>

            </div>

            <!-- CỘT BÊN PHẢI: DANH SÁCH PHIM XEM NHIỀU -->
            <div class="trending-movies">
                <h2 class="trending-title">Phim cùng loại</h2>
                <ul>
                    <li v-for="movie in relatedMovies" :key="movie.id" class="trending-item" @click="gotoMovieDetail(movie.slug)">
                        <img :src="`https://phimimg.com/${movie.thumb_url}`" :alt="movie.name" class="trending-poster" />
                        <div class="trending-info">
                            <h3>{{ movie.name }}</h3>
                            <p>{{ movie.year }} • {{ movie.episode_current }}</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    padding: 20px;
    color: white;
    background: #181818;
}

.main-content {
    display: flex;
    gap: 30px;
}

/* PHẦN BÊN TRÁI */
.movie-detail {
    flex: 2;
}

.movie-header {
    display: flex;
    gap: 20px;
}

.movie-poster img {
    width: 250px;
    border-radius: 10px;
}

.movie-info {
    flex: 1;
}

.year-country {
    font-size: 14px;
    color: gray;
}

.rating {
    display: flex;
    align-items: center;
    gap: 10px;
}

.genres {
    margin-top: 10px;
}

.genre-tag {
    margin-right: 5px;
}

.buttons {
    margin-top: 15px;
}

.watch-btn {
    background: #ff9800;
    color: black;
}

.favorite-btn {
    background: gray;
}

.movie-summary {
    margin-top: 20px;
}

.episode-list {
    margin-top: 20px;
}

.episodes {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}

.episode-btn {
    background: #333;
    color: white;
}

/* PHẦN BÊN PHẢI */
.trending-movies {
    flex: 1;
    background: #222;
    padding: 15px;
    border-radius: 10px;
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

/* tab */
.tabs-container {
    padding: 20px;
    background: #181818;
    color: white;
}

.tabs {
    display: flex;
    /* gap: 10px; */
}

button {
    background: gray;
    color: white;
    /* border: none; */
    /* padding: 10px 20px; */
    cursor: pointer;
}

.active {
    background: #ff9800;
}

.tab-content {
    margin-top: 20px;
}

.cast-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

.actor {
    text-align: center;
}

.actor-img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
}

.actor-name {
    font-weight: bold;
}

.actor-role {
    color: gray;
}
.new-movies {
    margin-top: 30px;
    background: #222;
    padding: 15px;
    border-radius: 10px;
}
.carousel {
    width: 800px;
    height: 400px;
}
.movie-item{
    width: 200px;
}
.movie-item:hover {
    transform: scale(1.05);
}
.new-movie-poster {
    width: 200px;
    height: 200px;
    border-radius: 10px;
    object-fit: cover;
} 
.new-movie-info {
    margin-top: 10px;
    color: white;
}
.new-movie-info h3 {
    font-size: 16px;
    font-weight: bold;
    margin: 5px 0;
}
.new-movie-info p {
    font-size: 14px;
    color: gray;
}
</style>
