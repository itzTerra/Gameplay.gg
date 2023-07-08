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
            <button class="w-full btn btn-primary my-5" type="submit">Log In</button>
        </form>
        <p class="text-center">Don't have an account? <NuxtLink to="/register/" class="link link-secondary">Sign up</NuxtLink></p>
    </Auth>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ["unauth-only"]
})

const { loginUser } = useAuth()
// const session = useSessionData()
const { session } = await useSession()

const msgSuccess = ref("")
const msgError = ref("")
const change = ref(false)

const form = shallowReactive({
    email: "",
    password: "",
})

const login = async () => {
    const response = await loginUser(form.email, form.password)
    // console.log(JSON.stringify(response))
    form.password = ""

    if (response.credentials) {
        form.email = ""
        navigateTo(session.value ? session.value.lastUrl : "/")

    } else{
        msgError.value = `Login failed: ${response.errorMessage}`
        msgSuccess.value = ""
    }

    change.value = !change.value
}
</script>