<template>
    <Auth :success="msgSuccess" :error="msgError" :change="change">
        <h3 class="mb-5 text-center text-3xl font-semibold">Log In</h3>
        <form @submit.prevent="login">
            <div class="join join-vertical w-full">
                <input type="email" v-model="form.email" placeholder="Email address"
                    class="input input-lg input-bordered join-item" required>
                <input type="password" v-model="form.password" placeholder="Enter your password"
                    class="input input-lg input-bordered overflow-ellipsis join-item" required>
            </div>
            <div class="flex justify-around flex-wrap gap-y-3 mt-3">
                <label class="flex items-center gap-2">
                    <input v-model="form.remember" type="checkbox" class="checkbox checkbox-sm">
                    Remember me
                </label>
                <NuxtLink to="/resetpass/" class="link link-secondary link-hover">Forgot your password?</NuxtLink>
            </div>
            <button class="w-full btn btn-primary my-5" type="submit">
                <span v-show="loading == 'login'" class="loading loading-spinner"></span>
                Log In
            </button>
        </form>
        <p class="text-center">Don't have an account? <NuxtLink to="/register/" class="link link-secondary">Sign up
            </NuxtLink>
        </p>
        <div class="divider">OR</div>
        <div class="flex flex-col">
            <button class="btn" @click="continueGoogle" :disabled="user != null">Continue with Google</button>
        </div>
    </Auth>
</template>

<script setup lang="ts">
useHead({title: "Login"})
// definePageMeta({
//     middleware: ["unauth"]
// })

const user = await useUser()
const { loginUser, loginUserGoogle } = await useAuth()
const clientSession = useClientSession()
const route = useRoute()

const msgSuccess = ref("")
const msgError = ref("")
const change = ref(false)

const loading = ref("")

const form = shallowReactive({
    email: "",
    password: "",
    remember: true
})

watch(user, (newVal, oldVal) => {
    if (newVal) {
        const where = route.query.redirect || clientSession.value.lastUrl || "/";
        console.log("Unauthenticated users only, redirecting to", where);
        return navigateTo(where);
    }
})

// onMounted(() => {
//     if (user.value) {
//         const where = route.query.redirect || clientSession.value.lastUrl || "/";
//         console.log("Unauthenticated users only, redirecting to", where);
//         return navigateTo(where);
//     }
// })

const login = async () => {
    loading.value = "login"
    clientSession.value.rememberMe = form.remember
    const response = await loginUser(form.email, form.password)

    form.password = ""

    if (response.credentials) {
        form.email = ""

        navigateTo(route.query.redirect && typeof route.query.redirect === 'string'
            ? route.query.redirect
            : '/')
    } else {
        msgError.value = `Login failed: ${response.errorCode}`
        msgSuccess.value = ""
    }

    change.value = !change.value
    loading.value = ""
}

const continueGoogle = async () => {
    const response = await loginUserGoogle()

    if (response.credentials) {
        navigateTo(route.query.redirect && typeof route.query.redirect === 'string'
            ? route.query.redirect
            : '/')
    } else {
        msgError.value = `Login failed: ${response.errorCode}`
        msgSuccess.value = ""
    }

    change.value = !change.value
}
</script>