<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from '@/components/Header.vue'



</script>

<template>
 <div class="container">
  <Header/>
 

 <RouterView/>
 </div>
</template>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
  background-color: black;
}
:global(#app){
  background-color: black;
}
</style>
