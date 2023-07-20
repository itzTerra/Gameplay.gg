<template>
    <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 z-[500] flex justify-center items-center">
        <div class="p-2 md:p-4 bg-base-200 relative shadow-xl rounded-xl">
            <div class="w-[320px] md:w-[480px] lg:w-[640px] xl:w-[854px]">
                <iframe
                    class="w-[320px] h-[180px] md:w-[480px] md:h-[270px] lg:w-[640px] lg:h-[360px] xl:w-[854px] xl:h-[480px]"
                    :src="`https://www.youtube-nocookie.com/embed/${videoId}?start=${start || 0}&modestbranding=1`"
                    title="YouTube video player" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen></iframe>
                <h2 class="text-xl md:text-2xl lg:text-3xl font-light mt-3 w-11/12">
                    {{ videoMeta.name || '&nbsp;' }}</h2>
            </div>
            <button @click="$emit('close')" class="btn btn-error btn-circle btn-sm lg:btn-md absolute -top-4 -right-4">
                <SVGClose />
            </button>
        </div>
    </div>
</template>

<script setup>
const props = defineProps(["videoId", "videoMeta", "start"])
</script>

<style scoped></style>