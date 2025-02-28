<script setup lang="ts">
import { ref, onMounted, watch,computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import Button from "primevue/button";
import Carousel from "primevue/carousel";
import { formateUrl } from "@/utils/utils";

const route = useRoute();
const router = useRouter();

const movie = ref<any>(null);
const newMovies = ref<any>(null);
const relatedMovies = ref<any>(null);
const episodes = ref<any>(null);
const typeMovie = ref<string>("");
const selectedEpisode = ref<string>("");

const fetchMovieDetail = async () => {
    console.log("Fetching movie details...");
    try {
        const { data } = await axios.get(`https://phimapi.com/phim/${route.params.slug}`);
        movie.value = data;
        console.log("Movie fetched:", data);
        
        if (data.movie.category.length > 0) {
            typeMovie.value = data.movie.category[0].slug;
        }
        
        episodes.value = data.episodes[0]?.server_data || [];
        selectedEpisode.value = episodes.value.length ? episodes.value[0].link_embed : "";
    } catch (error) {
        console.error("Lỗi khi tải thông tin phim:", error);
    }
};


const fetchRelatedMovies = async () => {
    if (!typeMovie.value) return;
    try {
        const { data } = await axios.get(`https://phimapi.com/v1/api/the-loai/${typeMovie.value}`);
        relatedMovies.value = data.data.items;
    } catch (error) {
        console.error("Lỗi khi tải phim cùng loại:", error);
    }
};


onMounted(async () => {
    await fetchMovieDetail();
});

watch(typeMovie, fetchRelatedMovies, { immediate: true });

const activeTab = ref("info");

const gotoMovieDetail = (slug: string) => {
    router.push(`/movie/${slug}`);
};

const responsiveOptions = ref([
    { breakpoint: "1400px", numVisible: 2, numScroll: 1 },
    { breakpoint: "1199px", numVisible: 3, numScroll: 1 },
    { breakpoint: "767px", numVisible: 2, numScroll: 1 },
    { breakpoint: "575px", numVisible: 1, numScroll: 1 },
]);

const episodeUrl = computed(() => {
    if (!selectedEpisode.value) return '';
    return selectedEpisode.value;
});

const isEpisodeActive = (episodeLink: string) => {
    return selectedEpisode.value === episodeLink;
};

</script>


<template>
    <div v-if="movie" class="container">
        <div class="main-content">
            <div class="movie-detail">
                <div class="video-container">
                    <iframe 
                        v-if="episodeUrl"
                        :src="episodeUrl"
                        class="video-player"
                        frameborder="0"
                        allowfullscreen
                        :key="episodeUrl"
                    ></iframe>
                </div>


                <div v-if="movie.episodes?.length" class="episode-list">
                    <h2>Chọn tập</h2>
                    <div class="episodes">
                        <Button 
                            v-for="(ep, index) in movie.episodes[0]?.server_data" 
                            :key="index" 
                            class="episode-btn"
                            :class="{ 'active-episode': isEpisodeActive(ep.link_embed) }"
                            @click="selectedEpisode = ep.link_embed"
                        >
                            {{ index + 1 }}
                        </Button>
                    </div>
                </div>

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
                        <Carousel :value="newMovies" :numVisible="3" :numScroll="1" circular :autoplayInterval="3000"
                            :responsive-options="responsiveOptions">
                            <template #item="slotProps">
                                <div class="new-movie-item" @click="gotoMovieDetail(slotProps.data.slug)">
                                    <img :src="slotProps.data.thumb_url" :alt="slotProps.data.name"
                                        class="new-movie-poster" />
                                    <div class="new-movie-info">
                                        <h3>{{ slotProps.data.name }}</h3>
                                    </div>
                                </div>
                            </template>
                        </Carousel>
                    </div>
                </div>
            </div>

            <div class="trending-movies">
                <h2 class="trending-title">Phim cùng loại</h2>
                <ul>
                    <li v-for="movie in relatedMovies" :key="movie.id" class="trending-item"
                        @click="gotoMovieDetail(movie.slug)">
                        <img :src="formateUrl(movie.thumb_url)" :alt="movie.name"
                            class="trending-poster" />
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
.video-container {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
}

.video-player {
    width: 100%;
    height: 500px;
    /* Thêm chiều cao */
    border-radius: 10px;
}

.container {
    padding: 20px;
    color: white;
    background: #181818;
}

.episode-list {
    margin-left: 20px
}

.main-content {
    display: flex;
    gap: 30px;
}

/* PHẦN BÊN TRÁI */
.movie-detail {
    flex: 3;
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

.active-episode {
    background: #ff9800 !important;
    color: black;
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

.trending-item img {
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

.movie-item {
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
