<template>
    <div class="text-white font-extrabold rounded-full border-2 tooltip tooltip-left cursor-default" data-tip="Score" :class="{
        'bg-purple-700 border-purple-900': rating >= 95,
        'bg-blue-700 border-blue-900': rating >= 85 && rating < 95,
        'bg-green-700 border-green-900': rating >= 70 && rating < 85,
        'bg-yellow-400 border-yellow-600': rating >= 50 && rating < 70,
        'bg-orange-700 border-orange-900': rating >= 25 && rating < 50,
        'bg-red-700 border-red-900': rating < 25
    }">
        {{ Math.round(rating) }}
    </div>
</template>

<script setup>
defineProps(["rating"])
</script>

<style scoped></style>