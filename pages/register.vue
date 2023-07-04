<template>
    <Auth>
        <form class="bg-base-200 py-4 px-5 rounded-xl mb-3" method="post" v-on:submit="signIn('credentials')">
            <h3 class="mb-3 text-center text-3xl font-semibold">Sign Up</h3>
            <div class="flex flex-col gap-2">
                <input type="text" id="username" name="username" placeholder="Email address" class="input input-bordered"
                    required>
                <input type="password" id="pass" name="pass" placeholder="Password (8 characters min.)"
                    class="input input-bordered overflow-ellipsis" required>
                <input type="password" id="pass2" name="pass2" placeholder="Re-enter password"
                    class="input input-bordered overflow-ellipsis" required>
            </div>
            <button class="w-full btn btn-primary my-5" type="submit">Sign Up</button>
            <p class="text-center">Already have an account? <a href="/login/" class="link">Log in</a></p>
            <div class="divider">OR</div>
            <div class="flex flex-col">
                <button @click="signIn('google')">Continue with Google</button>
            </div>
        </form>
    </Auth>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: 'auth',
    auth: {
        unauthenticatedOnly: true,
        navigateAuthenticatedTo: '/profile',
    },
})

const { status, data, signIn, signOut } = useAuth()
console.log(status.value, data)
</script>

<style lang="scss" scoped></style>