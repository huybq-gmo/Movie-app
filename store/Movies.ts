import { defineStore } from 'pinia'


export const useMoviesStore = defineStore('movies', {
    state:()=>({
        movies:[] ,

    }),
    actions:{
        async fetchMovies() {
            try {
              const response = await fetch('https://ophim1.com/danh-sach/phim-moi-cap-nhat'); 
              this.movies = await response.json();
            } catch (error) {
              console.error('Lỗi khi tải danh sách phim:', error);
            }
          },
          seachMovie(search:string){
            this.movies = this.movies.filter((movie:any) => movie.name.toLowerCase().includes(search.toLowerCase()));
          },
          filterMoviesByGenre(genre:string){
            this.movies = this.movies.filter((movie:any) => movie.genres.includes(genre));
          },
          filterMoviesByYear(year:number){
            this.movies = this.movies.filter((movie:any) => movie.year === year);
          }
    }
})