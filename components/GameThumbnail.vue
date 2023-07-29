<template>
    <div class="hover:bg-gray-950 hover:bg-opacity-20 hover:shadow transition-colors rounded-lg show-bar" :class="`w-[${width}px]`">
        <NuxtLink :to="'/game/' + game.id">
            <div class="relative rounded-t-lg" :class="`w-[${width}px] h-[${height}px]`">
                <nuxt-img v-if="game.artworks" :src="imgUrl" class="rounded-lg" />
                <span v-else class="loading loading-spinner loading-lg"></span>
                <div class="absolute bottom-0 left-0">
                    <div class="flex gap-4 p-2 bg-black bg-opacity-50 rounded-tr-lg rounded-bl-lg">
                        <Platform v-for="platform in game.platforms" :platform="platform" width="1rem" height="1rem" />
                    </div>
                </div>
                <Rating v-if="game.total_rating" :rating="game.total_rating" :use-tooltip="false"
                    class="absolute bottom-2 right-2 w-12 h-12 text-2xl opacity-80" />
                <div class="absolute top-0 w-full bg-secondary h-1 rounded-t-3xl transition-opacity opacity-0 bar"></div>
            </div>
            <div class="m-2 mt-1 rounded-b-lg">
                <h2 class="tracking-wide"><span class="text-xl font-semibold dark:text-gray-200">{{ game.name }}</span>
                    &nbsp; <span class="font-light">{{ game.release_date }}</span></h2>
                <div class="flex flex-wrap gap-1 mt-2 mb-3">
                    <div v-for="genre in game.genres" class="badge badge-neutral whitespace-nowrap">
                        {{ genre }}</div>
                </div>
            </div>
        </NuxtLink>
    </div>
</template>

<script setup>
const props = defineProps(["game", "width", "height"])

const imgUrl = computed(() => {
    const size = "screenshot_med"
    const hash = props.game.artworks[0].image_id
    return `https://images.igdb.com/igdb/image/upload/t_${size}/${hash}.jpg`
})

</script>
<style scoped>
.show-bar:hover .bar{
    opacity: 0.8;
}
</style>