<template>
    <div>
        <div class="p-4 lg:px-6 xl:px-8 border-b-2 border-base-content border-opacity-10 shadow-lg bg-base-200 dark:bg-base-100 bg-geometry">
            <div class="flex">
                <div class="flex flex-col gap-2">
                    <h1 class="lg:mb-2"><span
                            class="text-3xl lg:text-5xl tracking-wide font-bold dark:text-gray-200">{{ gameInfo.name }}</span>
                        &nbsp; <span class="text-2xl lg:text-4xl font-light">{{ gameInfo.release_date }}</span></h1>
                    <div class="flex gap-4 items-center">
                        <p class="text-xl lg:text-2xl font-light">{{ gameInfo.companies?.join(", ") || "Unknown" }}</p>
                        <div v-show="gameInfo.platforms?.length > 0" class="divider divider-horizontal bg-base-content px-0 w-0.5 mx-2"></div>
                        <div class="flex gap-4">
                            <Platform v-for="platform in gameInfo.platforms" :platform="platform" width="1.25rem" height="1.25rem" />
                        </div>
                    </div>
                </div>
                <Rating v-if="gameInfo.total_rating" :rating="gameInfo.total_rating"
                    class="w-12 h-12 lg:w-16 lg:h-16 text-xl lg:text-3xl ms-auto lg:border-4 my-auto lg:me-5 cursor-default" />
            </div>
            <div class="mt-4 flex flex-col items-start gap-2">
                <div v-if="gameInfo.summary">
                    <div class="flex items-center gap-3 flex-wrap">
                        <button class="btn btn-sm btn-primary flex items-center space-x-1"
                            :class="{ 'rounded-b-none': summaryShown }"
                            @click="summaryShown = !summaryShown"><span>Summary</span>
                            <SVGChevronDown class="w-4 h-4 transform transition-transform duration-300 origin-center"
                                :class="{ 'rotate-180': summaryShown }" />
                        </button>
                        <div v-for="genre in gameInfo.genres" class="badge badge-lg badge-secondary whitespace-nowrap">
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
            <div v-if="gameInfo.clips.featured || gameInfo.videos" class="flex flex-col">
                <div class="flex justify-between mb-4">
                    <button class="btn btn-ghost flex items-center space-x-1 normal-case"
                        @click="featuredShown = !featuredShown"><span class="text-3xl">
                            <span v-show="!gameInfo.clips.featuredLoaded" class="loading loading-spinner"></span>
                            Featured</span>
                        <SVGChevronDown class="w-4 h-4 transform transition-transform duration-300 origin-center"
                            :class="{ 'rotate-180': featuredShown }" />
                    </button>
                    <NuxtLink v-if="user && user.role && user.role >= 2"
                        :to="{ path: '/suggest/', query: { game: $route.params.id, featured: 1 } }" class="btn btn-primary">
                        Add
                    </NuxtLink>
                </div>
                <div class="collapse">
                    <input v-model="featuredShown" type="checkbox" class="min-h-0" />
                    <div class="collapse-content">
                        <div class="flex flex-wrap gap-x-4 gap-y-8 justify-center items-start">
                            <ClipThumbnail v-if="gameInfo.clips.featured" v-for="clip in gameInfo.clips.featured" width="320"
                                height="180" :clip="clip" />
                            <ClipThumbnail v-else v-for="clip in gameInfo.videos" width="320" height="180" :clip="clip" />
                        </div>
                        <div class="divider mt-8 mb-0"></div>
                    </div>
                </div>
            </div>
            <div class="flex justify-between mb-4">
                <button class="btn btn-ghost flex items-center space-x-1 normal-case"
                    @click="communityShown = !communityShown"><span class="text-3xl">
                        <span v-show="!gameInfo.clips.approvedLoaded" class="loading loading-spinner"></span>
                        Community
                    </span>
                    <SVGChevronDown class="w-4 h-4 transform transition-transform duration-300 origin-center"
                        :class="{ 'rotate-180': communityShown }" />
                </button>
                <div v-if="user" class="flex gap-2">
                    <NuxtLink :to="{ path: '/suggest/', query: { game: $route.params.id } }" class="btn btn-primary">Suggest
                    </NuxtLink>
                </div>
            </div>
            <div class="collapse">
                <input v-model="communityShown" type="checkbox" class="min-h-0" />
                <div class="collapse-content">
                    <p v-if="!gameInfo.clips.approved" class="text-base-content text-opacity-75">Nothing here yet...</p>
                    <div class="flex flex-wrap gap-x-4 gap-y-8 justify-center items-start">
                        <ClipThumbnail v-for="clip in gameInfo.clips.approved" :key="clip.id" width="320" height="180" :clip="clip" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: ["save-url"]
})
const user = await useUser()
const route = useRoute()
const gameInfo = await useFullGame(route.params.id)
useHead({ title: gameInfo.value.name })

const summaryShown = ref(false)
const featuredShown = ref(true)
const communityShown = ref(true)
</script>

<style scoped>
.tooltip,
.tooltip * {
    z-index: 100;
}

</style>