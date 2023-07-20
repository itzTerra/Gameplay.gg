<template>
    <div>
        <div @mouseenter="hovering = true" @mousemove="moveOverVideo" @mouseleave="onMouseLeave"
            class="bg-base-200 text-base-content rounded-lg shadow-sm relative">
            <NuxtLink class="cursor-pointer" :to="{path: $route.path, query: {id: video.id}}">
                <div class="rounded-t-lg relative" :style="{ width: width + 'px', height: height + 'px' }">
                    <Transition>
                        <nuxt-picture v-show="currSrc == 0" format="avif,webp" :src="`${rootUrl}/0.jpg`"
                            :width="width + 'px'" :height="height + 'px'" loading="lazy" class="rounded-t-lg absolute"
                            :imgAttrs="{ class: 'rounded-t-lg' }" />
                    </Transition>
                    <Transition>
                        <nuxt-picture v-show="currSrc == 1" format="avif,webp" :src="`${rootUrl}/sd1.jpg`"
                            :width="width + 'px'" :height="height + 'px'" loading="lazy" class="rounded-t-lg absolute"
                            :imgAttrs="{ class: 'rounded-t-lg' }" />
                    </Transition>
                    <Transition>
                        <nuxt-picture v-show="currSrc == 2" format="avif,webp" :src="`${rootUrl}/sd2.jpg`"
                            :width="width + 'px'" :height="height + 'px'" loading="lazy" class="rounded-t-lg absolute"
                            :imgAttrs="{ class: 'rounded-t-lg' }" />
                    </Transition>
                    <Transition>
                        <nuxt-picture v-show="currSrc == 3" format="avif,webp" :src="`${rootUrl}/sd3.jpg`"
                            :width="width + 'px'" :height="height + 'px'" loading="lazy" class="rounded-t-lg absolute"
                            :imgAttrs="{ class: 'rounded-t-lg' }" />
                    </Transition>
                </div>
                <div class="p-2">
                    <span class="font-semibold">{{ video.title }}</span>
                </div>
            </NuxtLink>
            <NuxtLink v-show="hovering" :to="`https://youtu.be/${video.id}`" target="_blank"
                class="absolute top-0 right-0 px-6 py-2 bg-black text-gray-400 bg-opacity-60 rounded-bl hover:bg-opacity-75 hover:text-gray-300 transition">
                <p>Youtube<sup>
                        <SVGExternalLink class="inline w-4 h-4" />
                    </sup></p>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
const props = defineProps(["video", "width", "height"])
const rootUrl = `https://i.ytimg.com/vi/${props.video.id}`
const currSrc = ref(0)

const hovering = ref(false)

const moveOverVideo = (e) => {
    // Get the element's position on the page
    const rect = e.currentTarget.getBoundingClientRect();

    // Calculate the mouse coordinates relative to the element
    const relX = e.pageX - rect.left;

    let frac = props.width / 3

    if (relX < frac) {
        currSrc.value = 1
    } else if (relX < 2 * frac) {
        currSrc.value = 2
    } else {
        currSrc.value = 3
    }
}

const onMouseLeave = (e) => {
    currSrc.value = 0
    hovering.value = false
}
</script>

<style scoped>
/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
    transition: opacity 0.25s ease-in;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>