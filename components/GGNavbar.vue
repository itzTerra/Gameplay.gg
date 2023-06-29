<template>
    <div>
        <div class="navbar bg-accent text-accent-content md:px-10">
            <a class="btn btn-ghost normal-case small-caps text-xl" href="/">Gameplay.gg</a>
            <div class="flex-grow flex items-center justify-center">
                <div class="form-control hidden sm:flex mx-5 flex-grow max-w-md">
                    <input list="gamesDatalist" placeholder="Search for a game..."
                        class="input h-10 input-bordered bg-accent-focus text-accent-content border-opacity-10 w-auto tracking-wider" />
                    <datalist id="gamesDatalist">
                        <option v-for="game in GAMES" :value="game.name"></option>
                    </datalist>
                </div>
            </div>
            <button class="btn btn-ghost sm:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
            <div class="items-center ms-auto">
                <a class="btn btn-primary btn-sm hidden md:inline-flex mx-3">Submit a Clip</a>
                <ThemeSwapper class="btn btn-ghost" />
                <button class="btn btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
                    </svg>
                </button>
                <div class="dropdown dropdown-end">
                    <label tabindex="0" class="btn btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-7 h-7">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </label>
                    <ul tabindex="0"
                        class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content rounded-box w-52 bg-neutral text-neutral-content">
                        <li><a class="md:hidden">Submit a Clip</a></li>
                        <li>
                            <a class="justify-between">
                                Profile
                                <span class="badge">New</span>
                            </a>
                        </li>
                        <li><a>Settings</a></li>
                        <div class="divider my-0"></div>
                        <li><a>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    // const GAMES = useFetch()
</script>

<style lang="scss" scoped></style>