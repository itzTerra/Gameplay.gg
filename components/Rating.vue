<template>
    <div class="text-white font-extrabold" :class="{
        'bg-purple-700': rating >= 95,
        'bg-blue-700': rating >= 85 && rating < 95,
        'bg-green-700': rating >= 70 && rating < 85,
        'bg-yellow-400': rating >= 50 && rating < 70,
        'bg-orange-700': rating >= 25 && rating < 50,
        'bg-red-700': rating < 25
    }">
        {{ Math.round(rating) }}
    </div>
</template>

<script setup>
defineProps(["rating"])
</script>

<style scoped></style>