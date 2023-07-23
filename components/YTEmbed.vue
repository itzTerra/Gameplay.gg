<template>
    <Transition name="embed">
        <dialog ref="dialog"
            class="fixed top-0 left-0 w-full h-full inset-0 m-0 p-0 max-h-none max-w-none bg-black bg-opacity-70 z-[999] flex justify-center items-center overscroll-contain overflow-hidden">
            <div class="p-2 md:p-4 bg-base-200 relative shadow-xl rounded-box">
                <div class="w-[320px] md:w-[480px] lg:w-[640px] xl:w-[854px]">
                    <div>
                        <iframe
                            class="w-[320px] h-[180px] md:w-[480px] md:h-[270px] lg:w-[640px] lg:h-[360px] xl:w-[854px] xl:h-[480px]"
                            :src="`https://www.youtube-nocookie.com/embed/${videoId}?modestbranding=1${clip.start ? '&start=' + clip.start : ''}${clip.end ? '&end=' + clip.end : ''}`"
                            title="YouTube video player" frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowfullscreen></iframe>
                        <h2 class="text-xl md:text-2xl lg:text-3xl font-light mt-3 w-11/12">
                            {{ clip.title || clipTitle || '&nbsp;' }}</h2>
                        <p v-if="clip.suggested" class="mt-2">by <strong
                                :class="{ 'text-green-700': clip.suggested.role == 2, 'text-blue-700': clip.suggested.role == 3, 'text-red-700': clip.suggested.role == 4 }">
                                <NuxtLink v-if="clip.suggested.username == 'IGDB'" to="https://www.igdb.com/"
                                    class="link link-hover">
                                    {{ clip.suggested.username }}</NuxtLink><span
                                    v-else>{{ clip.suggested.username }}</span>
                            </strong><span v-if="user && user.role > 2"> (approved by
                                <strong
                                    :class="{ 'text-green-700': clip.approved.role == 2, 'text-blue-700': clip.approved.role == 3, 'text-red-700': clip.approved.role == 4 }">{{ clip.approved.username }}</strong>)</span>
                        </p>
                    </div>
                </div>
                <button @click="close" class="btn btn-error btn-circle btn-sm lg:btn-md absolute -top-4 -right-4">
                    <SVGClose />
                </button>
            </div>
        </dialog>
    </Transition>
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
</script>

<style scoped>
.embed-enter-active,
.embed-leave-active {
    transition: opacity 0.25s ease-in-out;
}

.embed-enter-from,
.embed-leave-to {
    opacity: 0;
}
</style>