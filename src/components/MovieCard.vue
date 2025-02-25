<template>
    <Card class="movie-card" @click="gotoMovieDetail">
        <template #header>
            <img :alt="movie.name" :src="movie.thumb_url" class="movie-thumb" />
        </template>
        <template #title>
            <span class="movie-title">{{ movie.name }}</span>
        </template>
        <template #subtitle>
            <span class="movie-subtitle">{{ movie.origin_name }} ({{ movie.year }})</span>
        </template>
        <template #content>
            <p class="movie-genre">
                Thể loại: {{ movie.genre || "Chưa cập nhật" }}
            </p>

        </template>

    </Card>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { useRouter } from "vue-router";
const props = defineProps<{
    movie: {
        _id: string;
        name: string;
        slug: string;
        origin_name: string;
        poster_url: string;
        thumb_url: string;
        year: number;
        genre?: string;

    };
}>();

const router = useRouter();

const gotoMovieDetail = () => {
  router.push(`/movie/${props.movie.slug}`);
};


</script>

<style scoped>
.movie-card {
    width: 12rem;
    height: 22rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    margin-bottom: 1rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    background-color: #2c2c2c;
    color: aliceblue;
}

.movie-card:hover {
    transform: scale(1.05);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
    cursor: pointer;
}




/* Ảnh bìa phim */
.movie-thumb {
    width: 100%;
    height: 230px;
    object-fit: cover;
}

/* Định dạng tiêu đề phim */
.movie-title {
    font-size: 1rem;
    width: 20%;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}


/* Định dạng phụ đề */
.movie-subtitle {
    font-size: 0.875rem;
    color: gray;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Giữ phần nội dung luôn cùng độ cao */
.p-card-content {
    flex-grow: 1;
    min-height: 3rem;
}

/* Định dạng thể loại phim */
.movie-genre {
    font-size: 0.875rem;
    color: #666;
    white-space: nowrap;
    overflow: ;
    text-overflow: ellipsis;
}
</style>
