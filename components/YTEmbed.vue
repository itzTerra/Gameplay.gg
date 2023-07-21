<template>
    <dialog ref="dialog" class="fixed top-0 left-0 w-full h-full inset-0 m-0 p-0 max-h-none max-w-none bg-black bg-opacity-70 z-[999] flex justify-center items-center overscroll-contain overflow-hidden">
        <div class="p-2 md:p-4 bg-base-200 relative shadow-xl rounded-box">
            <div class="w-[320px] md:w-[480px] lg:w-[640px] xl:w-[854px]">
                <iframe
                    class="w-[320px] h-[180px] md:w-[480px] md:h-[270px] lg:w-[640px] lg:h-[360px] xl:w-[854px] xl:h-[480px]"
                    :src="`https://www.youtube-nocookie.com/embed/${videoId}?modestbranding=1${clip.start ? '&start=' + clip.start : ''}${clip.end ? '&end=' + clip.end : ''}`"
                    title="YouTube video player" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen></iframe>
                <h2 class="text-xl md:text-2xl lg:text-3xl font-light mt-3 w-11/12">
                    {{ clip.title || videoTitle || '&nbsp;' }}</h2>
                <p class="mt-2">by <strong>
                        <NuxtLink v-if="clip.suggested == 'IGDB'" to="https://www.igdb.com/" class="link link-hover">
                            {{ clip.suggested }}</NuxtLink><span v-else>{{ clip.suggested }}</span>
                    </strong><span v-if="user && user.role > 2">, approved
                        <strong>{{ clip.approved }}</strong></span></p>
            </div>
            <button @click="$emit('close')" class="btn btn-error btn-circle btn-sm lg:btn-md absolute -top-4 -right-4">
                <SVGClose />
            </button>
        </div>
    </dialog>
</template>

<script setup>
const props = defineProps(["videoId", "videoTitle"])

const clip = await useClip(props.videoId)
const user = await useUser()

const dialog = ref(null)

onMounted(() => {
    dialog.value.showModal()
})
</script>

<style scoped></style>