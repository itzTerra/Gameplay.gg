<template>
  <div class="w-full max-w-full p-5 md:px-20">
    <h2 class="text-4xl font-light">Popular Clips</h2>
    <div>videowall with game label</div>
    <h2 class="text-4xl font-light">New Games</h2>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ["save-url"]
})
</script>