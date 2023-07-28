<template>
    <div class="w-full max-w-full p-5 px-8 md:px-16 flex flex-col">
        <h2 class="text-4xl font-light mb-6">Popular Clips</h2>
        <div class="flex flex-wrap gap-x-4 gap-y-8 justify-center items-start">
            <ClipThumbnail v-for="clip in currPageClips" :key="clip.id" width="320" height="180" :clip="clip" :include-game="true" :game="games[clip.game_id]"/>
        </div>
        <div class="self-center flex flex-col items-center gap-4 mt-6">
            <button @click="loadMoreClips" class="btn btn-primary text-xl">
                <span v-show="loading == 'popularClips'" class="loading loading-spinner"></span>
                More !
            </button>
            <Pagination v-show="clipPages > 1" :pages="clipPages" :curr-page="currPageC" />
        </div>
        <div class="divider"></div>
        <h2 class="text-4xl font-light">New Games</h2>
        <div class="flex flex-wrap gap-x-4 gap-y-8 justify-center items-start">
            <GameThumbnail v-for="clip in currPageGames" :key="clip.id" width="320" height="180"/>
        </div>
        <div class="self-center flex flex-col items-center gap-4 mt-6">
            <button @click="loadMoreGames" class="btn btn-primary text-xl">
                <span v-show="loading == 'newGames'" class="loading loading-spinner"></span>
                More !
            </button>
            <Pagination v-show="gamePages > 1" :pages="gamePages" :curr-page="currPageG" />
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ["save-url"]
})

const clipsPerPage = 8
const { clips, queryClips, games } = await usePopularClips(clipsPerPage)

const gamesPerPage = 8
const minRating = 65
const { newGames, queryGames } = await useNewGames(gamesPerPage, minRating)

const loading = ref("")

const clipPages = computed(() => {
    return Math.ceil(clips.value.length / clipsPerPage);
})
const currPageC = ref(1)
const currPageClips = computed(() => {
    let from = (currPageC.value - 1) * clipsPerPage
    return clips.value.slice(from, from + clipsPerPage)
})

const loadMoreClips = async () => {
    loading.value = "popularClips"
    queryClips(clipsPerPage).then(() => {
        loading.value = ""
        currPageC.value = clipPages.value
    })
}


const gamePages = computed(() => {
    return Math.ceil(games.value.length / gamesPerPage);
})
const currPageG = ref(1)
const currPageGames = computed(() => {
    let from = (currPageG.value - 1) * gamesPerPage
    return newGames.value.slice(from, from + gamesPerPage)
})

const loadMoreGames = async () => {
    loading.value = "newGames"
    queryGames(gamesPerPage).then(() => {
        loading.value = ""
        currPageG.value = gamePages.value
    })
}
</script>
<style scoped>

</style>