<template>
    <div class="flex items-center gap-1">
        <SVGUser viewBox="0 0 24 24" class="w-4 h-4" />
        <strong
            :class="{ 'text-green-700': userData.role == 2, 'text-blue-700': userData.role == 3, 'text-red-700': userData.role == 4 }">
            <NuxtLink v-if="userData.username == 'IGDB'" to="https://www.igdb.com/" class="link link-hover">
                {{ userData.username }}</NuxtLink><span v-else>{{ userData.username }}</span>
        </strong>
    </div>
</template>

<script setup>
const props = defineProps(["userData"])
</script>