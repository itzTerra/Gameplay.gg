<template>
    <header class="navbar bg-primary text-primary-content md:px-10">
        <!-- NAVBAR HEADER -->
        <NuxtLink class="btn btn-ghost" to="/">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 128 128">
                <path fill="#464C4F"
                    d="M19.64 35.33c.09-.26-.09-4.82 2.45-8.41s5.87-4.12 8.33-4.56c2.98-.53 10.17-1.4 11.31 1.05c1.14 2.45.26 3.77 2.1 4.47s-1.49 4.82-1.49 4.82l-22.7 2.63zm88.25-.09s.72-4.43-1.81-7.42c-3.8-4.51-9.75-5.97-15.38-5.97c-1.81 0-3.98.35-4.68 2.51c-.4 1.25-.68 2.77-1.56 2.94c-.87.18 17.73 5.93 23.43 7.94z" />
                <path fill="#5E6268"
                    d="M39.04 81.29c-2.99 2.32-6.96 18.32-13.17 22.55s-20.28 1.97-21.34-6.66c-.93-7.61.76-23.61 5-39.96s7.5-24.45 17.41-27.1c7.95-2.13 23.53-3.63 38.66-3.48c15.14.15 28.39.15 36.72 3.33c7.47 2.85 12.56 10.6 16.05 25.73c3.48 15.14 6.17 33.34 5.75 39.36c-.61 8.78-13.02 14.38-22.25 7.57c-7.35-5.42-8.78-19.22-12.56-21.19s-47.55-2.27-50.27-.15z" />
                <path fill="#9E9E9E"
                    d="M93.25 77.17c-.72.9.94 2.24 2.12 5.17c1.18 2.93 4.22 12.63 7.17 15.34c3.68 3.37 6.55 2.74 7.11 1.68s-2.62-3.8-6.36-9.91s-8.54-14.15-10.04-12.28zm-82.73-2.49c-1.11.2-4.05 14.96-1.87 21.2c1.82 5.2 8.79 5.49 11.41 4.74c5.22-1.49 6.86-6.55 5.67-7.11c-1.18-.56-5.32 3.4-9.23 1.56c-4.36-2.06-4.3-7.86-4.86-13.72c-.5-5.28-.06-6.86-1.12-6.67zm27.49-32.73c-.41 0-4.01-.02-4.01-.02l.02-4.35s.08-3.51-3.68-3.43c-3.37.07-3.3 2.88-3.3 3.43s-.02 4.32-.02 4.32s-3.82-.04-4.53-.02s-3.37.06-3.37 3.49c0 3.24 2.75 3.47 3.37 3.49s4.51.02 4.51.02s-.03 3.63-.02 4.22s.12 3.37 3.49 3.37c3.68 0 3.49-3.37 3.49-3.37l.02-4.19s3.44.03 4.04.02c.86-.02 3.39-.25 3.43-3.68c.03-3.39-3.02-3.3-3.44-3.3z" />
                <circle cx="48.4" cy="62.42" r="8.54" fill="#AFAFAF" />
                <circle cx="77.75" cy="62.55" r="8.54" fill="#AFAFAF" />
                <circle cx="48.39" cy="62.21" r="5.71" fill="#C8C8C8" />
                <circle cx="77.75" cy="62.4" r="5.71" fill="#C8C8C8" />
                <circle cx="85.82" cy="45.67" r="4.6" fill="#2086FA" />
                <circle cx="94.94" cy="54.48" r="4.6" fill="#06AC48" />
                <circle cx="104.12" cy="46.4" r="4.6" fill="#F72E26" />
                <circle cx="95.02" cy="37.01" r="4.6" fill="#FDB700" />
            </svg>
            <span class="hidden xl:inline normal-case small-caps text-2xl font-extrabold">Gameplay.gg</span>
        </NuxtLink>
        <!-- SEARCH -->
        <div class="flex-grow flex items-center justify-center md:me-5">
            <Search @onGameSelect="navigateOnSearch" class="flex-grow flex min-w-0 max-w-3xl"
                inputClass="input h-10 input-lg input-bordered text-black dark:text-gray-200 dark:bg-neutral border-opacity-10 flex-grow w-40 tracking-wider"
                buttonClass="btn btn-secondary btn-sm"
                resultsClass="w-72 md:w-96 lg:w-[500px]" />
        </div>
        <!-- RIGHT SIDE -->
        <div class="ms-auto flex items-center">
            <!-- SUBMIT A CLIP BUTTON -->
            <NuxtLink v-if="user" to="/suggest/" class="btn btn-secondary btn-sm hidden lg:inline-flex mx-3">Suggest a
                Clip</NuxtLink>
            <!-- DARK AND LIGHT THEME SWAPPER -->
            <label class="btn btn-ghost btn-circle hidden xl:inline-flex items-center h-10 mx-3">
                <div class="swap swap-rotate">
                    <ThemeSwapper />
                    <SVGThemeLight class="swap-on w-7 h-7" />
                    <SVGThemeDark class="swap-off w-7 h-7" />
                </div>
            </label>
            <!-- LANGUAGE PICKER -->
            <!-- <LanguagePicker class="btn btn-ghost hidden xl:inline-flex">
                <SVGLanguage class="w-6 h-6" />
            </LanguagePicker> -->
            <!-- AUTH -->
            <div v-if="!user" class="md:flex gap-2 hidden">
                <NuxtLink to="/register/" class="btn btn-sm btn-secondary">Sign Up</NuxtLink>
                <NuxtLink to="/login/" class="btn btn-sm btn-neutral">Log In</NuxtLink>
            </div>
            <!-- USER MENU -->
            <div class="dropdown dropdown-end ms-4" :class="{ 'xl:hidden': !user, 'dropdown-top': isHandheldDevice }">
                <label tabindex="0" class="btn btn-square btn-ghost" @mousedown="blurIfFocused">
                    <div class="avatar pointer-events-none">
                        <div class="w-9 rounded-lg bg-slate-700 text-gray-200">
                            <SVGUser class="w-full h-full" />
                        </div>
                    </div>
                </label>
                <ul tabindex="0"
                    class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content rounded-box w-52 bg-base-300 text-base-content">
                    <li class="lg:hidden" @click="blurIfFocused">
                        <NuxtLink to="/suggest/">
                            <SVGSubmitClip class="w-4 h-4" />Suggest a Clip
                        </NuxtLink>
                    </li>
                    <li class="xl:hidden">
                        <label class="justify-between">
                            <span class="flex items-center gap-2">
                                <SVGThemeDark class="w-4 h-4" />Dark&nbsp;Theme
                            </span>
                            <ThemeSwapper class="toggle toggle-sm toggle-accent" checked />
                        </label>
                    </li>
                    <!-- <li class="xl:hidden">
                        <LanguagePicker>
                            <SVGLanguage class="w-4 h-4" /> Language
                        </LanguagePicker>
                    </li> -->
                    <li v-if="user" @click="blurIfFocused">
                        <NuxtLink to="/settings/">
                            <SVGSettings class="w-4 h-4" />Profile
                        </NuxtLink>
                    </li>
                    <li v-if="user && user.role >= 2" @click="blurIfFocused">
                        <NuxtLink to="/suggestions/">
                            <SVGManage class="w-4 h-4" />Manage Suggestions
                        </NuxtLink>
                    </li>
                    <div class="divider my-0"></div>
                    <li @click="blurIfFocused">
                        <button v-if="user" @click="logoutUser">
                            <SVGLogout class="w-4 h-4" />Logout
                        </button>
                        <NuxtLink v-else to="/login/">
                            <SVGLogin class="w-4 h-4" />Login
                        </NuxtLink>
                    </li>
                </ul>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
const user = await useUser()
const { logoutUser } = await useAuth()

const navigateOnSearch = (gameId: string) => {
    navigateTo(`/game/${gameId}`)
}
</script>