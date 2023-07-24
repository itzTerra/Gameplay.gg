<template>
    <div class="flex flex-col justify-center max-w-4xl 2xl:max-w-6xl shadow mx-auto">
        <div class="w-full rounded-t-box rounded-b-none bg-base-300 flex flex-wrap">
            <div class="w-auto px-5 py-3 bg-primary text-primary-content rounded-tl-box flex items-center">
                <h1 class="text-2xl md:text-4xl font-bold small-caps">Suggest a clip for:</h1>
            </div>
            <div class="flex-grow flex rounded-tr-box">
                <div class="w-[72px] h-[72px] flex-shrink-0">
                    <nuxt-img v-if="form.selectedGame && form.selectedGame.cover" :src="form.selectedGame.cover" alt="" />
                    <SVGQuestion v-else class="w-full h-full bg-slate-950 text-white" />
                </div>
                <div class="flex-grow flex flex-col justify-between py-2 px-4 bg-geometry rounded-tr-box">
                    <p class="text-lg text-black dark:text-white font-light line-clamp-2 leading-snug"
                        :title="form.selectedGame?.name || 'None'">
                        {{ form.selectedGame || 'None' }}</p>
                    <div class="flex-grow flex text-sm items-end w-full">
                        <p class="line-clamp-2 leading-snug">{{ form.selectedGame?.companies?.join(", ") || "Unknown" }}</p>
                        <p class="ms-auto">{{ form.selectedGame?.release_date || '?' }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="px-8 py-4 rounded-b-box  flex flex-col md:flex-row flex-wrap bg-base-200">
            <div class="flex-grow flex flex-col gap-6 items-center">
                <div class="form-control w-full max-w-xs">
                    <label class="label">
                        <span class="label-text">Select a game</span>
                    </label>
                    <Search @onGameSelect="selectGame" class="flex-grow flex min-w-0 max-w-3xl"
                        inputClass="input input-bordered w-40 h-10" inputPlaceholder="🔎 Search" showButton="false"
                        resultsClass="w-72" />
                </div>

                <div class="form-control w-full max-w-xs">
                    <label class="label">
                        <span class="label-text">Title</span>
                    </label>
                    <input v-model="form.title" type="text" placeholder="an engaging title"
                        class="input input-bordered input-lg w-full" required />
                </div>
                <div class="form-control w-full max-w-xs">
                    <label class="label">
                        <span class="label-text">Description (optional)</span>
                    </label>
                    <textarea v-model="form.description" class="textarea textarea-bordered w-full"
                        placeholder="description..."></textarea>
                </div>
                <div class="form-control w-full max-w-xs">
                    <label class="label">
                        <span class="label-text">Notes for mods (optional)</span>
                    </label>
                    <textarea v-model="form.modNotes" class="textarea textarea-bordered w-full"
                        placeholder="..."></textarea>
                </div>
            </div>
            <div class="divider w-full md:divider-horizontal"></div>
            <div class="w-auto flex flex-col gap-6 items-center">
                <div class="form-control w-full">
                    <label class="label">
                        <span class="label-text">URL</span>
                    </label>
                    <input v-model="form.url" type="text" placeholder="e.g. https://youtu.be/XXQgcNZSPgY"
                        class="input input-bordered input-lg w-full" required />
                    <div class="text-sm opacity-75 mt-1">
                        <SVGInfo class="inline w-5 h-5 me-1" />Paste YT video or clip URL, short or full version, or even
                        just the id.
                    </div>
                </div>
                <div class="flex justify-center">
                    <iframe class="w-[320px] h-[180px] sm:w-[426px] sm:h-[240px] 2xl:w-[640px] 2xl:h-[360px]"
                        src="https://www.youtube.com/embed/XXQgcNZSPgY?start=6535&end=6555" title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen></iframe>
                </div>
                <div class="flex w-full justify-around gap-5">
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Start Time</span>
                        </label>
                        <input v-model="form.startTime" type="number" placeholder="0:00"
                            class="input input-bordered w-full" />
                    </div>
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">End Time</span>
                        </label>
                        <input v-model="form.endTime" type="number" placeholder="" class="input input-bordered w-full" />
                    </div>
                </div>
            </div>
            <div class="divider w-full"></div>
            <div class="w-full mb-4 flex justify-center items-center gap-4">
                <div class="flex flex-col gap-3">
                    <label v-if="user && user.role >= 2" class="flex gap-3 cursor-pointer">
                        <input type="checkbox" v-model="form.makeFeatured" class="checkbox checkbox-success" />
                        <span class="">Featured</span>
                    </label>
                    <label v-if="user && user.role >= 3" class="flex gap-3 cursor-pointer">
                        <input type="checkbox" v-model="form.autoApprove" class="checkbox checkbox-success" />
                        <span class="">Auto-approve</span>
                    </label>
                </div>
                <button @click="suggest" class="btn btn-primary btn-lg w-40">Submit</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
definePageMeta({
    middleware: ["auth", "save-url"]
})

const user = await useUser()
const route = useRoute()

const form = shallowReactive({
    selectedGame: null,
    title: "",
    description: "",
    modNotes: "",
    url: "",
    startTime: null,
    endTime: null,
    makeFeatured: false,
    autoApprove: false,
})

onMounted(() => {
    if (route.query.featured) {
        form.makeFeatured = route.query.featured == "1"
    }
    if (route.query.game) {
        form.selectedGame = route.query.game.toString()
    }
})

const selectGame = (gameId: string | number) => {

}

const suggest = () => {
    console.log("suggest!")
}

</script>

<style scoped></style>