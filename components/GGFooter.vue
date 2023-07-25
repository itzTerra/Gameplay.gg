<template>
    <footer
        class="footer py-4 px-5 lg:px-10 2xl:px-20 bg-base-300 text-base-content shadow transition ease-in-out bg-opacity-30 text-opacity-60 hover:bg-opacity-75 hover:text-opacity-100 rounded flex flex-wrap justify-center gap-2 md:gap-3">
        <div>
            <p>Copyright © 2023 - All rights reserved</p>
        </div>
        <div class="flex md:gap-3">
            <div class="divider divider-horizontal bg-base-content bg-opacity-60 w-0.5 mx-1 md:mx-3"></div>
            <p>This site is not affiliated with Youtube nor Google LLC.</p>
        </div>
        <div class="flex md:gap-3">
            <div class="divider divider-horizontal bg-base-content bg-opacity-60 w-0.5 mx-1 md:mx-3"></div>
            <NuxtLink to="https://github.com/itzTerra/Gameplay.gg" target="_blank" class="link hover:no-underline hover:text-accent-focus">About</NuxtLink>
            <NuxtLink to="/tos" class="link hover:no-underline hover:text-accent-focus">Terms of Service</NuxtLink>
            <NuxtLink to="/privacy" class="link hover:no-underline hover:text-accent-focus">Privacy Policy</NuxtLink>
        </div>
    </footer>
</template>
<style scoped>
footer {
    cursor: default;
}

footer:hover .divider {
    --tw-bg-opacity: 100
}
</style>