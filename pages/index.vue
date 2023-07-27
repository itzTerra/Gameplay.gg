<template>
    <div class="w-full max-w-full p-5 px-8 md:px-16 flex flex-col">
        <h2 class="text-4xl font-light mb-6">Popular Clips</h2>
        <div class="flex flex-wrap gap-x-4 gap-y-8 justify-center items-start">
            <Thumbnail v-for="clip in popularClips" width="320" height="180" :clip="clip" />
        </div>
        <button @click="loadMoreClips" class="btn btn-primary text-xl self-center mt-6">
            <span v-show="loading == 'popularClips'" class="loading loading-spinner"></span>
            More !
        </button>
        <div class="divider"></div>
        <h2 class="text-4xl font-light">New Games</h2>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ["save-url"]
})

const numberOfPopularClipsPer = 8
const {clips: popularClips, queryClips} = await usePopularClips(numberOfPopularClipsPer)

const loading = ref("")

const loadMoreClips = async () => {
    loading.value = "popularClips"
    await queryClips()
    loading.value = ""
}
</script>