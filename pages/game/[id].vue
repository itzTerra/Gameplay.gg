<template>
    <div>
        <div class="flex justify-between">
            <div class="flex gap-2">
                <div v-for="platform in gameInfo.platforms" class="tooltip" :data-tip="platform.name">
                    <button class="btn btn-ghost w-6 h-6">
                        <nuxt-img :src="platform.logo" />
                    </button>
                </div>
            </div>
            <div class="flex gap-2">
                <div v-for="rating in gameInfo.age_ratings" class="tooltip" :data-tip="rating.name">
                    <button class="btn btn-ghost w-6 h-6">
                        <nuxt-img :src="rating.url" />
                    </button>
                </div>
            </div>
        </div>
        <h1 class="text-6xl font-bold">{{ gameInfo.name }}</h1>
        <div>
            <p>{{ gameInfo.companies }}</p>
            <p>{{ gameInfo.release_date }}</p>
        </div>
        <p>{{ gameInfo.summary }}</p>
        <div class="flex gap-3">
            <div v-for="genre in gameInfo.genres" class="badge badge-accent">{{ genre }}</div>
        </div>
        <Rating :rating="gameInfo.total_rating" class="badge badge-lg py-4"/>
        <div class="flex gap-2">
            <div v-for="engine in gameInfo.game_engines" class="tooltip" :data-tip="engine.name">
                <button class="btn btn-ghost w-6 h-6">
                    <nuxt-img :src="engine.logo" />
                </button>
            </div>
        </div>
        <div>Videos TBD</div>
        <div class="flex gap-2">
            <NuxtLink v-for="website in gameInfo.websites" :to="website.url">{{ website.category }}</NuxtLink>
        </div>

    </div>
</template>

<script setup>
const route = useRoute()
const gameInfo = ref(await getGame(route.params.id))
</script>

<style scoped></style>