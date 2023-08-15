<template>
    <div class="w-full max-w-full p-5 px-8 xl:px-20 flex flex-col">
        <h2 class="text-4xl font-bold">🔥 Popular Clips</h2>
        <div class="divider before:bg-primary after:bg-primary"></div>
        <div class="flex flex-wrap gap-x-4 gap-y-8 items-start justify-center relative">
            <ClipThumbnail v-for="clip in currPageClips" :key="clip.id" width="320" height="180" :clip="clip"
                :include-game="true" :game="games[clip.gameId]" />
            <Transition>
                <button v-show="clipPages > 1" @click="currPageC = currPageC != 1 ? currPageC - 1 : clipPages"
                    class="hidden xl:flex btn btn-accent items-center btn-circle absolute -left-14 top-1/2"><span
                        class="text-5xl leading-none -mt-2">&lsaquo;</span></button>
            </Transition>
            <Transition>
                <button v-show="clipPages > 1" @click="currPageC = currPageC != clipPages ? currPageC + 1 : 1"
                    class="hidden xl:flex btn btn-accent items-center btn-circle absolute -right-14 top-1/2"><span
                        class="text-5xl leading-none -mt-2">&rsaquo;</span></button>
            </Transition>
        </div>
        <div class="self-center flex flex-col items-center gap-4 mt-6">
            <button @click="loadMoreClips" class="btn btn-primary text-xl">
                <span v-show="loading == 'popularClips'" class="loading loading-spinner"></span>
                More !
            </button>
            <Pagination v-show="clipPages > 1" :pages="clipPages" :curr-page="currPageC"
                @page-change="(val: number) => { currPageC = val }" />
        </div>
        <h2 class="text-4xl font-bold">🧭 New Games</h2>
        <div class="divider before:bg-primary after:bg-primary"></div>
        <div class="flex flex-wrap gap-x-4 gap-y-8 justify-center items-start relative">
            <GameThumbnail v-for="game in currPageGames" :key="game.id" width="320" height="180" :game="game" />
            <Transition>
                <button v-show="gamePages > 1" @click="currPageG = currPageG != 1 ? currPageG - 1 : gamePages"
                    class="hidden xl:flex btn btn-accent items-center btn-circle absolute -left-14 top-1/2"><span
                        class="text-5xl leading-none -mt-2">&lsaquo;</span></button>
            </Transition>
            <Transition>
                <button v-show="gamePages > 1" @click="currPageG = currPageG != gamePages ? currPageG + 1 : 1"
                    class="hidden xl:flex btn btn-accent items-center btn-circle absolute -right-14 top-1/2"><span
                        class="text-5xl leading-none -mt-2">&rsaquo;</span></button>
            </Transition>
        </div>
        <div class="self-center flex flex-col items-center gap-4 mt-6">
            <button @click="loadMoreGames" class="btn btn-primary text-xl" :disabled="!isMoreNewGames">
                <span v-show="loading == 'newGames'" class="loading loading-spinner"></span>
                More !
            </button>
            <Pagination v-show="gamePages > 1" :pages="gamePages" :curr-page="currPageG"
                @page-change="(val: number) => { currPageG = val }" />
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ["save-url"]
})

const loading = ref("")


const clipsPerPage = 8
const { clips, queryClips, games } = await usePopularClips(clipsPerPage)

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


const gamesPerPage = 8
const minRating = 70
const { newGames, queryGames, hasMore: isMoreNewGames } = await useNewGames(gamesPerPage, minRating)

const gamePages = computed(() => {
    return Math.ceil(newGames.value.length / gamesPerPage);
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
