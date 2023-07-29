<template>
    <div class="rounded-full border-2 flex items-center justify-center" data-tip="Score" :class="{
        'bg-purple-700 border-purple-900': rating >= 95,
        'bg-blue-700 border-blue-900': rating >= 85 && rating < 95,
        'bg-green-700 border-green-900': rating >= 70 && rating < 85,
        'bg-yellow-600 border-yellow-800': rating >= 50 && rating < 70,
        'bg-orange-700 border-orange-900': rating >= 25 && rating < 50,
        'bg-red-700 border-red-900': rating < 25,
        'tooltip tooltip-left': useTooltip == undefined || useTooltip
    }">
        <span class="text-gray-200 font-extrabold font-mono">{{ Math.round(rating) }}</span>
    </div>
</template>

<script setup>
defineProps(["rating", "useTooltip"])
</script>