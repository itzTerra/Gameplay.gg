<template>
    <div class="flex flex-wrap">
        <div class="flex-grow py-4 px-6 bg-base-200 shadow flex flex-col">
            <h1 class="font-semibold text-xl text-end"><span class="font-bold"
                    :class="{ 'text-red-700': suggestedClips.length > 0, 'text-green-700': suggestedClips.length == 0 }">{{ suggestedClips.length }}</span>
                suggestion(s)</h1>
            <div class="divider before:bg-primary after:bg-primary"></div>
            <div class="font-semibold flex text-start mb-1 px-5">
                <div class="w-4/12">Title</div>
                <div class="w-3/12">User</div>
                <div class="w-3/12">Mod Notes</div>
                <div class="w-2/12 text-end">When</div>
            </div>
            <ul class="flex-grow h-96 flex flex-col gap-3 overflow-y-auto">
                <li v-for="clip in suggestedClips" :key="clip.id">
                    <button @click="() => { selectClip(clip) }"
                        class="py-3 px-5 bg-base-100 hover:bg-opacity-80 w-full flex rounded-lg items-center justify-start text-start">
                        <div class="w-4/12 text-lg truncate">{{ clip.title }}</div>
                        <div class="w-3/12 truncate">
                            <Username :user-data="clip.suggested" />
                        </div>
                        <div class="w-3/12 truncate">{{ clip.mod_notes }}</div>
                        <div class="w-2/12 truncate text-end">{{ clip.date }}</div>
                    </button>
                </li>
            </ul>
        </div>
        <div class="w-[320px] h-[180px] lg:w-[480px] lg:h-[270px] xl:w-[640px] xl:h-[360px]">
            <div v-if="openedClip" class="flex flex-col">
                <iframe class="w-[320px] h-[180px] lg:w-[480px] lg:h-[270px] xl:w-[640px] xl:h-[360px]"
                    :src="`https://www.youtube-nocookie.com/embed/${openedClip.clip_id}?modestbranding=1${openedClip.start_time ? '&start=' + openedClip.start_time : ''}${openedClip.end_time ? '&end=' + openedClip.end_time : ''}`"
                    title="YouTube video player" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen>
                </iframe>
                <div class="flex flex-col gap-2 p-4">
                    <div class="flex justify-between items-start">
                        <div class="flex flex-col">
                            <h2 class="text-xl md:text-2xl lg:text-3xl font-light mt-2">
                                {{ openedClip.title }}</h2>
                            <p>by
                                <Username :user-data="openedClip.suggested" />
                            </p>
                            <p class="mt-2"><SVGClock class="inline w-5 h-5" /> {{ openedClip.date }}</p>
                        </div>
                        <div v-if="openedClipGame" class="flex">
                            <div class="w-[72px] h-[72px] flex-shrink-0">
                                <nuxt-img v-if="openedClipGame.cover" :src="openedClipGame?.cover" alt="" />
                                <MissingImg v-else />
                            </div>
                            <div
                                class="flex flex-col items-start bg-base-200 py-2 px-4 justify-between">
                                <p class="text-lg text-black dark:text-white font-light line-clamp-2 leading-snug"
                                    :title="openedClipGame?.name || 'None'">
                                    {{ openedClipGame?.name || 'None' }}</p>
                                <div class="flex text-sm items-end w-full">
                                    <p class="line-clamp-2 leading-snug me-2">
                                        {{ openedClipGame?.companies?.join(", ") || "Unknown" }}</p>
                                    <p class="ms-auto">{{ openedClipGame?.release_date || '?' }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h3 class="font-semibold text-lg mt-2">Description</h3>
                    <p class="p-2 bg-base-200 rounded-lg">
                        {{ openedClip.description }}
                    </p>
                    <h3 class="font-semibold text-lg mt-2">Mod Notes</h3>
                    <p class="p-2 bg-base-200 rounded-lg">
                        {{ openedClip.mod_notes }}
                    </p>
                    <div class="flex gap-6 mt-8 justify-center">
                        <button @click="() => { reject(openedClip.id) }" class="btn btn-error">
                            <span v-show="loading == 'reject'" class="loading loading-spinner"></span>
                            REJECT
                        </button>
                        <button @click="() => { approve(openedClip.id) }" class="btn btn-success">
                            <span v-show="loading == 'approve'" class="loading loading-spinner"></span>
                            APPROVE
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <Alert :alertType="msgError ? 'error' : 'success'" :change="change" :interval="3000">{{ msgError || msgSuccess}}</Alert>
    </div>
</template>

<script lang="ts" setup>
useHead({title: "Manage Suggestions"})
definePageMeta({
    middleware: ["auth", "save-url"]
})

const user = await useUser()
const suggestedClips = await useSuggestedClips()

const loading = ref("")
const msgSuccess = ref("")
const msgError = ref("")
const change = ref(false)

const openedClip = ref<any>(null)
const openedClipGame = ref<any>(null)

const selectClip = async (clip: any) => {
    openedClip.value = clip
    openedClipGame.value = await getShortGames([clip.game_id])
}

const reject = async (clipId: string) => {
    loading.value = "reject"
    try {
        await rejectClip(clipId)
        suggestedClips.value = suggestedClips.value.filter((item: any) => item.id != clipId)

        openedClip.value = null

        msgSuccess.value = "Successfully rejected"
        msgError.value = ""
    } catch (err) {
        console.error(err)

        msgError.value = "Unknown error occured"
        msgSuccess.value = ""
    }
    loading.value = ""
    change.value = !change.value
}

const approve = async (clipId: string) => {
    loading.value = "approve"
    try {
        await approveClip(clipId, user.value.uid)
        suggestedClips.value = suggestedClips.value.filter((item: any) => item.id != clipId)
        
        openedClip.value = null

        msgSuccess.value = "Successfully approved"
        msgError.value = ""
    } catch (err) {
        console.error(err)

        msgError.value = "Unknown error occured"
        msgSuccess.value = ""
    }
    loading.value = ""
    change.value = !change.value
}
</script>

<style scoped></style>