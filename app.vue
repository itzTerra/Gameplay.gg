<template>
    <div>
        <client-only>
            <GGNavbar class="fixed top-0 left-0 w-100 h-16 z-[200]" :class="{ 'handheld-order': isHandheldDevice }" />
        </client-only>
        <main class="mt-16 flex flex-col content-min-height">
            <div @scroll="onScroll" ref="scrollEl" class="flex-1 overflow-y-auto flex flex-col content-max-height">
                <NuxtPage class="flex-1" />
                <client-only>
                    <GGFooter v-if="!isHandheldDevice" class="mt-auto" />
                </client-only>
            </div>
        </main>

        <NuxtLoadingIndicator />

        <Transition name="embed">
            <YTEmbed v-if="$route.query.id" :videoId="$route.query.id" />
        </Transition>

        <button v-show="bttBtnVisible" @click="scrollTop" id="back-to-top-btn"
            class="btn btn-accent btn-circle opacity-50 hover:opacity-75">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24">
                <path fill="currentColor"
                    d="m17.71 11.29l-5-5a1 1 0 0 0-.33-.21a1 1 0 0 0-.76 0a1 1 0 0 0-.33.21l-5 5a1 1 0 0 0 1.42 1.42L11 9.41V17a1 1 0 0 0 2 0V9.41l3.29 3.3a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42Z" />
            </svg>
        </button>
    </div>
</template>

<script setup>
const SITE_NAME = "Gameplay.gg";

useHead({
    titleTemplate: (titleChunk) => {
        return titleChunk ? `${titleChunk} - ${SITE_NAME}` : SITE_NAME;
    },
    htmlAttrs: { lang: "en" },
    link: [{ rel: "icon", type: "image/x-icon", href: 'data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="128" height="128" viewBox="0 0 128 128"%3E%3Cpath fill="%23464C4F" d="M19.64 35.33c.09-.26-.09-4.82 2.45-8.41s5.87-4.12 8.33-4.56c2.98-.53 10.17-1.4 11.31 1.05c1.14 2.45.26 3.77 2.1 4.47s-1.49 4.82-1.49 4.82l-22.7 2.63zm88.25-.09s.72-4.43-1.81-7.42c-3.8-4.51-9.75-5.97-15.38-5.97c-1.81 0-3.98.35-4.68 2.51c-.4 1.25-.68 2.77-1.56 2.94c-.87.18 17.73 5.93 23.43 7.94z"%2F%3E%3Cpath fill="%235E6268" d="M39.04 81.29c-2.99 2.32-6.96 18.32-13.17 22.55s-20.28 1.97-21.34-6.66c-.93-7.61.76-23.61 5-39.96s7.5-24.45 17.41-27.1c7.95-2.13 23.53-3.63 38.66-3.48c15.14.15 28.39.15 36.72 3.33c7.47 2.85 12.56 10.6 16.05 25.73c3.48 15.14 6.17 33.34 5.75 39.36c-.61 8.78-13.02 14.38-22.25 7.57c-7.35-5.42-8.78-19.22-12.56-21.19s-47.55-2.27-50.27-.15z"%2F%3E%3Cpath fill="%239E9E9E" d="M93.25 77.17c-.72.9.94 2.24 2.12 5.17c1.18 2.93 4.22 12.63 7.17 15.34c3.68 3.37 6.55 2.74 7.11 1.68s-2.62-3.8-6.36-9.91s-8.54-14.15-10.04-12.28zm-82.73-2.49c-1.11.2-4.05 14.96-1.87 21.2c1.82 5.2 8.79 5.49 11.41 4.74c5.22-1.49 6.86-6.55 5.67-7.11c-1.18-.56-5.32 3.4-9.23 1.56c-4.36-2.06-4.3-7.86-4.86-13.72c-.5-5.28-.06-6.86-1.12-6.67zm27.49-32.73c-.41 0-4.01-.02-4.01-.02l.02-4.35s.08-3.51-3.68-3.43c-3.37.07-3.3 2.88-3.3 3.43s-.02 4.32-.02 4.32s-3.82-.04-4.53-.02s-3.37.06-3.37 3.49c0 3.24 2.75 3.47 3.37 3.49s4.51.02 4.51.02s-.03 3.63-.02 4.22s.12 3.37 3.49 3.37c3.68 0 3.49-3.37 3.49-3.37l.02-4.19s3.44.03 4.04.02c.86-.02 3.39-.25 3.43-3.68c.03-3.39-3.02-3.3-3.44-3.3z"%2F%3E%3Ccircle cx="48.4" cy="62.42" r="8.54" fill="%23AFAFAF"%2F%3E%3Ccircle cx="77.75" cy="62.55" r="8.54" fill="%23AFAFAF"%2F%3E%3Ccircle cx="48.39" cy="62.21" r="5.71" fill="%23C8C8C8"%2F%3E%3Ccircle cx="77.75" cy="62.4" r="5.71" fill="%23C8C8C8"%2F%3E%3Ccircle cx="85.82" cy="45.67" r="4.6" fill="%232086FA"%2F%3E%3Ccircle cx="94.94" cy="54.48" r="4.6" fill="%2306AC48"%2F%3E%3Ccircle cx="104.12" cy="46.4" r="4.6" fill="%23F72E26"%2F%3E%3Ccircle cx="95.02" cy="37.01" r="4.6" fill="%23FDB700"%2F%3E%3C%2Fsvg%3E' }],
    meta: [
        {
            name: "ogTitle",
            content: SITE_NAME,
        },
        {
            name: "description",
            content:
                "Community-driven gameplay database. Search for a gameplay easy and fast.",
        },
        {
            name: "ogDescription",
            content:
                "Community-driven gameplay database. Search for a gameplay easy and fast.",
        },
        // {
        //   name: "ogImage",
        //   content: "https://example.com/image.png",
        // },
        {
            name: "twitterCard",
            content: "summary_large_image",
        },
    ],
});

const bttBtnVisible = ref(false)
const scrollEl = ref(null)

const onScroll = (event) => {
    const THRESHOLD = 400
    if (
        event.target.scrollTop > THRESHOLD
    ) {
        bttBtnVisible.value = true
    } else {
        bttBtnVisible.value = false
    }
}

const scrollTop = () => {
    scrollEl.value.scrollTop = 0;
}
</script>

<style scoped>
.handheld-order {
    margin-top: auto;
    order: 2;
}

#back-to-top-btn {
    /* display: none; */
    position: fixed;
    right: 30px;
    bottom: 30px;
    z-index: 200;
}

.content-min-height {
    min-height: calc(100vh - 4rem);
    flex: 1;
}

.content-max-height {
    max-height: calc(100vh - 4rem);
    height: calc(100vh - 4rem);
}
</style>

<style>
.slide-enter-active,
.slide-leave-active {
    transition: all 0.25s ease-out;
}

.slide-enter-from {
    opacity: 0;
    transform: translateX(20px);
}

.slide-leave-to {
    opacity: 0;
    transform: translateX(-20px);
}
</style>