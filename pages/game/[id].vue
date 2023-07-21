<template>
    <div>
        <div class="p-4 lg:px-6 xl:px-8 head border-b-2 border-base-content border-opacity-10 shadow-lg">
            <div class="flex">
                <div class="flex flex-col gap-2">
                    <div class="flex items-start lg:mb-2">
                        <h1 class="text-3xl lg:text-6xl font-bold tracking-wide">{{ gameInfo.name }}&nbsp; <span
                                class="text-2xl lg:text-5xl font-light">{{ gameInfo.release_date }}</span></h1>
                    </div>
                    <div class="flex gap-4 items-center">
                        <p class="text-xl lg:text-2xl font-light">{{ gameInfo.companies?.join(", ") || "Unknown" }}</p>
                        <div class="divider divider-horizontal bg-base-content px-0 w-0.5 mx-2"></div>
                        <div class="flex gap-4">
                            <Platform v-for="platform in gameInfo.platforms" :platform="platform" class="h-5 w-5" />
                        </div>
                    </div>
                </div>
                <Rating v-if="gameInfo.total_rating" :rating="gameInfo.total_rating"
                    class="w-12 h-12 lg:w-16 lg:h-16 text-xl lg:text-3xl ms-auto lg:border-4 my-auto lg:me-5" />
            </div>
            <div class="mt-4 flex flex-col items-start gap-2">
                <div v-if="gameInfo.summary">
                    <div class="flex items-center gap-3 flex-wrap">
                        <button class="btn btn-sm btn-secondary flex items-center space-x-1"
                            :class="{ 'rounded-b-none': summaryShown }"
                            @click="summaryShown = !summaryShown"><span>Summary</span>
                            <SVGChevronDown class="w-4 h-4 transform transition-transform duration-300 origin-center"
                                :class="{ 'rotate-180': summaryShown }" />
                        </button>
                        <div v-for="genre in gameInfo.genres" class="badge badge-lg badge-accent whitespace-nowrap">
                            {{ genre }}</div>
                    </div>
                    <div class="collapse rounded-tl-none">
                        <input v-model="summaryShown" type="checkbox" class="min-h-0" />
                        <div class="collapse-content bg-base-200 !p-0 rounded-xl rounded-tl-none shadow font-serif">
                            <p class="p-2">{{ gameInfo.summary }}</p>
                        </div>
                    </div>
                </div>
                <div class="flex flex-wrap items-start gap-x-4 gap-y-2">
                    <div class="join flex-wrap">
                        <div v-if="gameInfo.websites.social.length > 0"
                            class="join-item bg-red-800 text-white font-semibold px-2 flex items-center">Social</div>
                        <NuxtLink v-for="website in gameInfo.websites.social" :to="website.url" target="_blank"
                            class="btn btn-sm btn-neutral join-item">
                            {{ website.name }}</NuxtLink>
                    </div>
                    <div class="join flex-wrap">
                        <div v-if="gameInfo.websites.stores.length > 0"
                            class="join-item bg-teal-700 text-white font-semibold px-2 flex items-center">Store</div>
                        <NuxtLink v-for="website in gameInfo.websites.stores" :to="website.url" target="_blank"
                            class="btn btn-sm btn-neutral join-item">
                            {{ website.name }}</NuxtLink>
                    </div>
                    <div class="join flex-wrap">
                        <div v-if="gameInfo.websites.other.length > 0"
                            class="join-item bg-yellow-600 text-white font-semibold px-2 flex items-center">Other</div>
                        <NuxtLink v-for="website in gameInfo.websites.other" :to="website.url" target="_blank"
                            class="btn btn-sm btn-neutral join-item">
                            {{ website.name }}</NuxtLink>
                    </div>
                </div>
            </div>
        </div>
        <div class="p-4 lg:px-6">
            <div v-if="gameInfo.featuredClips" class="flex flex-col">
                <div class="flex mb-4">
                    <button class="btn btn-ghost flex items-center space-x-1 normal-case" @click="featuredShown = !featuredShown"><span
                            class="text-3xl">Featured</span>
                        <SVGChevronDown class="w-4 h-4 transform transition-transform duration-300 origin-center"
                            :class="{ 'rotate-180': featuredShown }" />
                    </button>
                    <button v-if="user && user.role && user.role >= 2" class="btn btn-primary">Add</button>
                </div>
                <div class="collapse">
                    <input v-model="featuredShown" type="checkbox" class="min-h-0" />
                    <div class="collapse-content">
                        <div class="flex flex-wrap gap-x-4 gap-y-8 justify-center">
                            <Thumbnail v-for="video in gameInfo.featuredClips" width="320" height="180" :video="video" />
                        </div>
                        <div class="divider mt-8 mb-0"></div>
                    </div>
                </div>
            </div>
            <div class="flex mb-2">
                <button class="btn btn-ghost flex items-center space-x-1 normal-case" @click="communityShown = !communityShown"><span
                        class="text-3xl">Community</span>
                    <SVGChevronDown class="w-4 h-4 transform transition-transform duration-300 origin-center"
                        :class="{ 'rotate-180': communityShown }" />
                </button>
                <div v-if="user" class="flex gap-2">
                    <button class="btn btn-primary">Suggest</button>
                </div>
            </div>
            <div class="collapse">
                <input v-model="communityShown" type="checkbox" class="min-h-0" />
                <div class="collapse-content">
                    <p v-if="!gameInfo.approvedClips" class="text-base-content text-opacity-75">Nothing here yet...</p>
                    <div class="flex flex-wrap gap-x-4 gap-y-8 justify-center">
                        <Thumbnail v-for="video in gameInfo.approvedClips" width="320" height="180" :video="video" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const user = await useUser()

const gameInfo = ref()
const route = useRoute()
gameInfo.value = await getGame(route.params.id)

console.log(gameInfo.value)

const summaryShown = ref(false)
const featuredShown = ref(true)
const communityShown = ref(true)
</script>

<style scoped>
.tooltip,
.tooltip * {
    z-index: 100;
}

.head {
    background-image: linear-gradient(300deg, rgba(255, 255, 255, 0.05) 0%, rgba(0, 0, 0, 0.05) 100%),
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    /*url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='96' viewBox='0 0 60 96'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23aaaaaa' fill-opacity='0.05'%3E%3Cpath d='M36 10a6 6 0 0 1 12 0v12a6 6 0 0 1-6 6 6 6 0 0 0-6 6 6 6 0 0 1-12 0 6 6 0 0 0-6-6 6 6 0 0 1-6-6V10a6 6 0 1 1 12 0 6 6 0 0 0 12 0zm24 78a6 6 0 0 1-6-6 6 6 0 0 0-6-6 6 6 0 0 1-6-6V58a6 6 0 1 1 12 0 6 6 0 0 0 6 6v24zM0 88V64a6 6 0 0 0 6-6 6 6 0 0 1 12 0v12a6 6 0 0 1-6 6 6 6 0 0 0-6 6 6 6 0 0 1-6 6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    url(~/assets/img/topography.svg)
    */
}
</style>