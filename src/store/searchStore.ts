import { defineStore } from "pinia";
import { ref } from "vue";

export const useSearchStore = defineStore("search", () => {
  const searchQuery = ref("");
  const setSearchQuery = (query: string) => {
    searchQuery.value = query;
  };
  return {
    searchQuery,
    setSearchQuery,
  };
});
