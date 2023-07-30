<template>
    <div @mouseenter="hovering = true" @mousemove="moveOverVideo" @mouseleave="onMouseLeave"
        class="bg-base-200 transition-colors hover:bg-base-300 text-base-content rounded-lg shadow-sm hover:shadow relative" :class="`w-[${width}px]`">
        <NuxtLink class="cursor-pointer" :to="{ path: $route.path, query: { id: clip.id, title: clip.title } }">
            <div v-if="includeGame" class="flex rounded-t-lg">
                <div class="w-[40px] h-[40px] flex-shrink-0 border border-gray-600 rounded-tl-lg">
                    <span v-if="!game" class="loading loading-ring w-full"></span>
                    <nuxt-img v-else-if="game?.cover" :src="game?.cover" alt="" class="rounded-tl-lg" />
                    <MissingImg v-else class="rounded-tl-lg" />
                </div>
                <div class="flex-grow flex items-center py-1 px-2 rounded-tr-lg">
                    <p :title="game?.name" class="text-base dark:text-gray-200 leading-snug truncate w-[220px]" :class="!game ? 'bg-base-100 animate-pulse rounded-lg' : ''">
                        {{ game?.name || "&nbsp;"}}</p>
                    <p class="text-sm ms-auto">{{ game?.release_date }}</p>
                </div>
            </div>
            <div class="relative" :class="{ 'rounded-t-lg': !includeGame }"
                :style="{ width: width + 'px', height: height + 'px' }">
                <Transition name="fade">
                    <nuxt-picture v-show="currSrc == 0" format="avif,webp" :src="`${rootUrl}/0.jpg`" :width="width + 'px'"
                        :height="height + 'px'" loading="lazy" class="rounded-t-lg absolute"
                        :imgAttrs="{ class: !includeGame ? 'rounded-t-lg' : '' }" />
                </Transition>
                <Transition name="fade">
                    <nuxt-picture v-show="currSrc == 1" format="avif,webp" :src="`${rootUrl}/sd1.jpg`" :width="width + 'px'"
                        :height="height + 'px'" loading="lazy" class="rounded-t-lg absolute"
                        :imgAttrs="{ class: !includeGame ? 'rounded-t-lg' : '' }" />
                </Transition>
                <Transition name="fade">
                    <nuxt-picture v-show="currSrc == 2" format="avif,webp" :src="`${rootUrl}/sd2.jpg`" :width="width + 'px'"
                        :height="height + 'px'" loading="lazy" class="rounded-t-lg absolute"
                        :imgAttrs="{ class: !includeGame ? 'rounded-t-lg' : '' }" />
                </Transition>
                <Transition name="fade">
                    <nuxt-picture v-show="currSrc == 3" format="avif,webp" :src="`${rootUrl}/sd3.jpg`" :width="width + 'px'"
                        :height="height + 'px'" loading="lazy" class="rounded-t-lg absolute"
                        :imgAttrs="{ class: !includeGame ? 'rounded-t-lg' : '' }" />
                </Transition>

                <NuxtLink v-show="hovering" :to="`https://youtu.be/${clip.id}`" target="_blank" @click.stop
                    class="absolute top-0 right-0 px-6 py-2 bg-black text-gray-400 bg-opacity-60 rounded-bl hover:bg-opacity-75 hover:text-gray-300 transition">
                    <p>Youtube<sup>
                            <SVGExternalLink class="inline w-4 h-4" />
                        </sup></p>
                </NuxtLink>
            </div>
            <div class="p-2 flex justify-between items-baseline gap-2">
                <div class="flex flex-col flex-grow">
                    <span class="font-semibold text-lg dark:text-gray-200 mb-1">{{ clip.title }}</span>
                    <div v-if="!clip.suggestedLoaded" class="w-10 animate-pulse bg-base-100 text-sm rounded">&nbsp;</div>
                    <Username v-else :user-data="clip.suggested" class="text-sm" />
                </div>
                <span class="text-sm flex-shrink text-end">{{ clip.date }}</span>
            </div>
        </NuxtLink>
    </div>
</template>

<script setup>
const props = defineProps(["clip", "width", "height", "includeGame", "game"])

const rootUrl = ref("")
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

onMounted(() => {
    rootUrl.value = `https://i.ytimg.com/vi/${props.clip.id}`
})
</script>