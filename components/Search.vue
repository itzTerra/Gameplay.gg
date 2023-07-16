<template>
    <div class="relative">
        <div class="join flex-grow min-w-0 max-w-3xl">
            <input v-model="searchValue" placeholder="Search for a game..."
                class="input h-10 input-lg input-bordered bg-accent-focus text-accent-content border-opacity-10 flex-grow w-40 tracking-wider join-item" />
            <button class="btn btn-primary btn-sm h-10 join-item">
                <SVGSearch class="w-5 h-5" />
            </button>
        </div>
        <div class="absolute top-10 left-0 bg-base-100 shadow-lg rounded-lg w-80">
            <span v-if="typingTimeout != null" class="loading loading-dots loading-lg m-4"></span>
            <ul class="rounded-lg">
                <li v-for="game in searchedGames" :key="game.slug"
                    class="bg-base-200 hover:bg-base-300 p-2 mb-2 flex rounded-lg">
                    <NuxtLink :to="'/game/' + game.slug" class="flex">
                        <img src="~/assets/img/profile1.jpg" width="50px" height="50px" alt="" />
                        <div class="flex-grow flex flex-col gap-1">
                            <div class="flex">
                                <p class="text-lg font-light flex-shrink flex-grow text-ellipsis">{{ game.name }}</p>
                                <p class="opacity-50 ms-auto">{{ game.first_release_date }}</p>
                            </div>
                            <p class="text-sm">{{ game.companies.join(", ") }}</p>
                        </div>
                    </NuxtLink>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
const searchValue = ref("")
const searchedGames = ref<any[]>([]);

const typingTimeout = ref<any>(null)

const search = async (inp: string) => {
    clearTimeout(typingTimeout.value)

    typingTimeout.value = setTimeout(async () => {
        searchedGames.value = searchedGames.value.concat(await searchGames(inp))
        console.log(searchedGames.value)
        typingTimeout.value = null
    }, 500);
}
watch(searchValue, async (val) => {
    await search(val)
})
</script>

<style scoped>
ul>li:last-of-type {
    margin-bottom: 0;
}
</style>