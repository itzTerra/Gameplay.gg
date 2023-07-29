<template>
    <dialog ref="dialog"
        class="fixed top-0 left-0 w-full h-full inset-0 m-0 p-0 max-h-none max-w-none bg-black bg-opacity-70 z-[999] flex justify-center items-center overscroll-contain overflow-hidden">
        <div class="p-2 md:p-4 bg-base-200 relative shadow-xl rounded-box">
            <div class="w-[320px] md:w-[480px] lg:w-[640px] xl:w-[854px]">
                <div class="flex flex-col gap-2">
                    <iframe
                        class="w-[320px] h-[180px] md:w-[480px] md:h-[270px] lg:w-[640px] lg:h-[360px] xl:w-[854px] xl:h-[480px]"
                        :src="`https://www.youtube-nocookie.com/embed/${videoId}?modestbranding=1&loop=1${clip.start_time ? '&start=' + clip.start_time : ''}${clip.end_time ? '&end=' + clip.end_time : ''}`"
                        title="YouTube video player" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen>
                    </iframe>
                    <div class="flex justify-between">
                        <div class="flex flex-col">
                            <h2 class="text-xl md:text-2xl lg:text-3xl font-light mt-3 mb-1">
                                {{ clip.title || clipTitle || '&nbsp;' }}</h2>
                            <Username :user-data="clip.suggested" /><span v-if="user && user.role > 2" class="text-base-content">
                                (approved by
                                <strong
                                    :class="{ 'text-green-700': clip.approved.role == 2, 'text-blue-700': clip.approved.role == 3, 'text-red-700': clip.approved.role == 4 }">{{ clip.approved.username }}</strong>)
                            </span>
                        </div>
                        <div class="flex gap-2 items-center">
                            <button @click="like" class="btn btn-ghost btn-sm btn-circle" :disabled="!user">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path :fill="isClipLiked ? 'currentColor' : 'none'" stroke="currentColor"
                                        stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M7 11v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3a4 4 0 0 0 4-4V6a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1-2 2h-7a3 3 0 0 1-3-3" />
                                </svg>
                            </button>
                            <span class="text-xl font-bold">{{ clip.likes }}</span>
                        </div>
                    </div>
                    <p class="text-base-content">
                        <SVGClock class="inline w-5 h-5" /> {{ clip.date }}
                    </p>
                    <h3 class="font-semibold text-lg mt-2">Description</h3>
                    <p class="p-2 bg-base-100 text-base-content rounded-lg">
                        <span v-show="!Boolean(clip.description)" class="italic">No description</span>
                        {{ clip.description }}
                    </p>
                </div>
            </div>
            <button @click="close" class="btn btn-error btn-circle btn-sm lg:btn-md absolute -top-4 -right-4">
                <SVGClose />
            </button>
        </div>
    </dialog>
</template>

<script setup>
const props = defineProps(["videoId"])
const route = useRoute()
const router = useRouter()
const user = await useUser()

const dialog = ref(null)
const clip = await useClip(props.videoId)
const clipTitle = ref("")

onMounted(async () => {
    clipTitle.value = route.query.title

    dialog.value.showModal()
})

const close = () => {
    router.replace(route.path);
}

const isClipLiked = computed(() => {
    return user.value && user.value.likedClips.includes(clip.value.id)
})

const likeAmount = ref(0)

const like = () => {
    if (likeAmount.value >= 10) return
    likeAmount.value += 1

    if (isClipLiked.value) {
        dislikeClip(user.value.uid, clip.value.id)
    } else {
        likeClip(user.value.uid, clip.value.id)
    }
}
</script>