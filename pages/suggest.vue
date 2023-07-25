<template>
    <div class="flex flex-col justify-center max-w-4xl 2xl:max-w-6xl shadow mx-auto">
        <div class="w-full rounded-t-box rounded-b-none bg-base-300 flex flex-wrap">
            <div class="w-auto px-5 py-3 bg-primary text-primary-content rounded-tl-box flex items-center">
                <h1 class="text-2xl md:text-4xl font-bold small-caps">Suggest a clip for:</h1>
            </div>
            <div class="flex-grow flex rounded-tr-box">
                <div class="w-[72px] h-[72px] flex-shrink-0 relative">
                    <span v-show="loading == 'gameBanner'"
                        class="loading loading-spinner loading-lg absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"></span>
                    <nuxt-img v-if="selectedGame && selectedGame.cover" :src="selectedGame?.cover" alt="" />
                    <SVGQuestion v-else class="w-full h-full bg-slate-950 text-white" />
                </div>
                <div class="flex-grow flex flex-col items-start justify-between py-2 px-4 bg-geometry rounded-tr-box">
                    <p class="text-lg text-black dark:text-white font-light line-clamp-2 leading-snug"
                        :title="selectedGame?.name || 'None'">
                        {{ selectedGame?.name || 'None' }}</p>
                    <div class="flex-grow flex text-sm items-end w-full">
                        <p class="line-clamp-2 leading-snug">{{ selectedGame?.companies?.join(", ") || "Unknown" }}</p>
                        <p class="ms-auto">{{ selectedGame?.release_date || '?' }}</p>
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
                    <label v-if="selectedGameError" class="label">
                        <span class="label-text text-red-700 dark:text-red-600 anim-shake-x">Game is required</span>
                    </label>
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
                    <input @input="(e) => { onUrlInput(e.target?.value) }" type="text"
                        placeholder="e.g. https://youtu.be/XXQgcNZSPgY" class="input input-bordered input-lg w-full"
                        required />
                    <div class="text-sm opacity-75 mt-1">
                        <SVGInfo class="inline w-5 h-5 me-1" />Paste YT video or clip URL, short or full version, or even
                        just the id.
                    </div>
                </div>
                <div class="flex justify-center text-gray">
                    <iframe v-show="clipId != ''" id="videoPlayerEl"
                        class="w-[320px] h-[180px] sm:w-[426px] sm:h-[240px] 2xl:w-[640px] 2xl:h-[360px]"
                        :src="`https://www.youtube-nocookie.com/embed/${clipId}?modestbranding=1&enablejsapi=1&loop=1`"
                        title="YouTube video player" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen></iframe>
                    <div v-show="clipId == ''"
                        class="w-[320px] h-[180px] sm:w-[426px] sm:h-[240px] 2xl:w-[640px] 2xl:h-[360px] transition-colors flex justify-center items-center border text-gray-400"
                        :class="{ 'bg-red-950 border-red-900 anim-shake-x': clipUrlError, 'bg-sky-950 border-sky-900': !clipUrlError }">
                        <span v-show="typingTimeout !== null" class="loading loading-spinner"></span>
                        <p>Video from URL not found.</p>
                    </div>
                </div>
                <div class="flex w-full justify-around gap-5">
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Start Time (optional)</span>
                        </label>
                        <input v-model="form.startTime" type="text" placeholder="0:00"
                            class="input input-bordered w-full" />
                    </div>
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">End Time (optional)</span>
                        </label>
                        <input v-model="form.endTime" type="text" placeholder="" class="input input-bordered w-full" />
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
            <dialog ref="confirmModal" class="modal">
                <div class="modal-box bg-base-200 text-base-content">
                    <form method="dialog">
                        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        <h2 class="font-bold text-xl mb-5">Confirm Suggestion</h2>
                        <p>Are you sure you want suggest this clip?</p>
                        <div class="mt-6 mb-2 flex gap-8 justify-center items-end">
                            <button class="btn btn-error btn-sm">No</button>
                            <button @click="confirmSuggest" class="btn btn-success">Yes</button>
                        </div>
                    </form>

                </div>
            </dialog>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: ["auth", "save-url"]
})

const user = await useUser()
const route = useRoute()
const router = useRouter()

const loading = ref("")

const selectedGame = ref(null)
const selectedGameError = ref(false)

const form = shallowReactive({
    title: "",
    description: "",
    modNotes: "",
    startTime: "",
    endTime: "",
    makeFeatured: false,
    autoApprove: false,
})

const clipId = ref("")
const clipUrlError = ref(false)

const ytPlayer = ref(null)
const clipDuration = ref(0)

onMounted(() => {
    if (route.query.featured) {
        form.makeFeatured = route.query.featured == "1"
    }
    if (route.query.game) {
        selectGame(route.query.game.toString())
    }

    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = function () {
        console.log("YT API ready")

        ytPlayer.value = new YT.Player("videoPlayerEl", {
            events: {
                'onReady': () => {
                    console.log("player ready")
                    clipDuration.value = ytPlayer.value.getDuration()
                },
                'onStateChange': (event) => {
                    console.log("player state change")
                }
            }
        });
    }
})

const selectGame = async (gameId) => {
    loading.value = "gameBanner"
    selectedGame.value = await getShortGame(gameId)
    loading.value = ""

    if (selectedGame.value) {
        router.push({
            path: route.path,
            query: {
                game: gameId
            }
        })
    }
}

const isValidYtVideo = async (id) => {
    const img = new Image();
    img.src = `http://img.youtube.com/vi/${id}/mqdefault.jpg`;
    await img.decode()

    // hack - a mq thumbnail has a width of 320, if the video does not exist, a default thumbnail of 120 width is returned
    return img.width && img.width !== 120
}

const validateUrl = async (url) => {
    const youtubeRegex = /([A-Za-z0-9_-]{11})/;
    const match = url.trim().match(youtubeRegex);

    if (!match) return

    const videoId = match[1];

    if (videoId && (await isValidYtVideo(videoId))) {
        clipId.value = videoId
        ytPlayer.value.loadVideoById(videoId);
    } else {
        clipId.value = ""
    }
}

const typingTimeout = ref(null)
const onUrlInput = (inp) => {
    if (!inp || inp.length < 11) return

    clearTimeout(typingTimeout.value)

    typingTimeout.value = setTimeout(async () => {
        await validateUrl(inp)
        typingTimeout.value = null
    }, 300);
}

const confirmModal = ref(null)
let startTimeSecs
let endTimeSecs

const suggest = () => {
    selectedGameError.value = false
    clipUrlError.value = false

    if (!selectedGame.value) {
        selectedGameError.value = true
        return
    }

    if (!clipId.value) {
        clipUrlError.value = true
        return
    }

    startTimeSecs = timeSecondsOrNull(form.startTime)
    endTimeSecs = timeSecondsOrNull(form.endTime)
    if (endTimeSecs && (endTimeSecs >= clipDuration.value || endTimeSecs < 1)) {
        endTimeSecs = null
    }
    if (startTimeSecs < 0 || (endTimeSecs !== null && (endTimeSecs - startTimeSecs) < 1) || startTimeSecs >= clipDuration.value) {
        startTimeSecs = 0
    }

    if (startTimeSecs) {
        form.startTime = secToTimeString(startTimeSecs)
    } else {
        form.startTime = "0:00"
    }

    if (endTimeSecs) {
        form.endTime = secToTimeString(endTimeSecs)
    } else {
        form.endTime = ""
    }

    confirmModal.value.showModal()
}

const confirmSuggest = () => {
    submitClip({
        id: clipId.value,
        game_id: selectedGame.value.id,
        title: form.title,
        description: form.description,
        mod_notes: form.modNotes,
        start_time: startTimeSecs,
        end_time: endTimeSecs,
        featured: form.makeFeatured,
        suggested: user.value.uid,
    }, form.autoApprove)
}
</script>

<style scoped></style>