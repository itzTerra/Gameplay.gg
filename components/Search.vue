<template>
    <div ref="searchEl" class="relative">
        <div class="join w-full">
            <input v-model="searchValue" @focusin="showSearchResults = true" @keyup.enter="e => manualSearch()"
                type="search" :placeholder="$props.inputPlaceholder || 'Search for a game...'"
                class="input join-item flex-grow" :class="$props.inputClass" />
            <button v-if="$props.showButton ? $props.showButton == 'true' : true" class="btn join-item h-full" :class="$props.buttonClass" @click="e => manualSearch()">
                <SVGSearch class="w-5 h-5" />
            </button>
        </div>
        <div v-show="showSearchResults"
            class="absolute top-10 left-0 z-[200] bg-base-100 text-base-content shadow-lg rounded-lg" :class="$props.resultsClass">
            <span v-if="typingTimeout != null" class="loading loading-dots loading-lg m-4"></span>
            <span v-else-if="searchedGames.length == 0" class="text-lg font-light line-clamp-2 leading-snug p-2">No results
                found.</span>
            <ul v-else class="rounded-lg max-h-[376px] overflow-y-auto p-2 flex flex-col gap-2">
                <li v-for="game in searchedGames" :key="game.id">
                    <button @click="() => {selectGame(game.id)}" class="w-full text-start bg-base-200 hover:bg-base-300 p-2 rounded-lg flex items-stretch gap-3">
                        <div class="w-[72px] h-[72px] flex-shrink-0">
                            <nuxt-img v-if="game.cover" :src="game.cover" alt="" class="rounded" />
                            <SVGQuestion v-else class="w-full h-full rounded bg-slate-950 text-white" />
                        </div>
                        <div class="flex-grow flex flex-col justify-between">
                            <p class="text-lg text-black dark:text-white font-light line-clamp-2 leading-snug" :title="game.name">{{ game.name }}</p>
                            <div class="flex-grow flex text-sm items-end w-full">
                                <p class="line-clamp-2 leading-snug">{{ game.companies?.join(", ") || "Unknown" }}</p>
                                <p class="opacity-50 ms-auto">{{ game.release_date }}</p>
                            </div>
                        </div>
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps(["inputClass", "inputPlaceholder", "showButton", "buttonClass", "resultsClass"])
const emit = defineEmits(['onGameSelect'])

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

const selectGame = (gameId: string) => {
    showSearchResults.value = false
    emit('onGameSelect', gameId)
}

const searchEl = ref(null)

onMounted(() => {
    document.addEventListener("mousedown", (e) => {
        // @ts-ignore
        if (searchEl.value && e.target !== searchEl.value && !searchEl.value.contains(e.target)) {
            showSearchResults.value = false
        }
    })
})
onUnmounted(() => {
    document.removeEventListener("mousedown", (e) => {
        // @ts-ignore
        if (searchEl.value && e.target !== searchEl.value && !searchEl.value.contains(e.target)) {
            showSearchResults.value = false
        }
    })
})
</script>

<style scoped>
ul>li:last-of-type {
    margin-bottom: 0;
}
</style>