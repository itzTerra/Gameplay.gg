<template>
    <div id="search" class="relative">
        <div class="join flex-grow min-w-0 max-w-3xl">
            <input v-model="searchValue" @focusin="showSearchResults = true" @keyup.enter="e => manualSearch()"
                type="search" placeholder="Search for a game..."
                class="input h-10 input-lg input-bordered bg-accent-focus text-accent-content border-opacity-10 flex-grow w-40 tracking-wider join-item" />
            <button class="btn btn-primary btn-sm h-10 join-item" @click="e => manualSearch()">
                <SVGSearch class="w-5 h-5" />
            </button>
        </div>
        <div v-show="showSearchResults"
            class="absolute top-10 left-0 z-[200] bg-base-100 shadow-lg rounded-lg w-72 md:w-96 lg:w-[500px]">
            <span v-if="typingTimeout != null" class="loading loading-dots loading-lg m-4"></span>
            <span v-else-if="searchedGames.length == 0" class="text-lg font-light line-clamp-2 leading-snug p-2">No results
                found.</span>
            <ul v-else class="rounded-lg max-h-[376px] overflow-y-auto">
                <li v-for="game in searchedGames" :key="game.id">
                    <NuxtLink :to="'/game/' + game.id" @click="showSearchResults = false" class="bg-base-200 hover:bg-base-300 p-2 mb-2 rounded-lg flex gap-3">
                        <div class="w-[72px] h-[72px] flex-shrink-0">
                            <nuxt-img v-if="game.cover" :src="game.cover" alt="" class="rounded" />
                            <SVGQuestion v-else class="w-full h-full rounded bg-slate-950" />
                        </div>
                        <div class="flex-grow flex flex-col justify-between">
                            <p class="text-lg font-light line-clamp-2 leading-snug" :title="game.name">{{ game.name }}</p>
                            <div class="flex text-sm items-end">
                                <p class="line-clamp-2 leading-snug">{{ game.companies?.join(", ") || "Unknown" }}</p>
                                <p class="opacity-50 ms-auto">{{ game.release_date }}</p>
                            </div>
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
const showSearchResults = ref(false)

const typingTimeout = ref<any>(null)

const search = async (inp: string) => {
    if (!inp || inp.length < 2) return

    clearTimeout(typingTimeout.value)

    typingTimeout.value = setTimeout(async () => {
        searchedGames.value = await searchGames(inp)
        typingTimeout.value = null
    }, 500);
}
watch(searchValue, async (val) => {
    await search(val)
})

const manualSearch = async () => {
    showSearchResults.value = true
    await search(searchValue.value)
}

onMounted(() => {
    const searchEl = document.getElementById("search"); // Replace 'elementToCheck' with the ref of the element you want to check against

    document.onmousedown = (e) => {
        const targetElement = e.target;

        // @ts-ignore
        if (!(targetElement === searchEl || searchEl.contains(targetElement))) {
            showSearchResults.value = false
        }
    }
})
</script>

<style scoped>
ul>li:last-of-type {
    margin-bottom: 0;
}
</style>