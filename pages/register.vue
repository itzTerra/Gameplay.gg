<template>
    <Auth :success="msgSuccess" :error="msgError" :change="change">
        <h3 class="mb-5 text-center text-3xl font-semibold">Create an account</h3>
        <form @submit.prevent="register">
            <div class="join join-vertical w-full">
                <input type="text" v-model="form.email" placeholder="Email address"
                    class="input input-bordered input-lg join-item" required>
                <input type="password" v-model="form.password1" placeholder="Password (8 characters min.)"
                    class="input input-bordered overflow-ellipsis input-lg join-item" required>
                <input type="password" v-model="form.password2" placeholder="Re-enter password"
                    class="input input-bordered overflow-ellipsis input-lg join-item" required>
            </div>
            <button class="w-full btn btn-primary my-5" type="submit">Sign Up</button>
        </form>
        <p class="text-center">Already have an account? <NuxtLink to="/login/" class="link link-secondary">Log in</NuxtLink>
        </p>
        <div class="divider">OR</div>
        <div class="flex flex-col">
            <button class="btn" @click="continueGoogle" :disabled="user != null">Continue with Google</button>
        </div>
    </Auth>
</template>

<script setup lang="ts">

const user = await useUser()
const { createUser, loginUserGoogle } = useAuth()

const msgSuccess = ref("")
const msgError = ref("")
const change = ref(false)

const form = shallowReactive({
    email: "",
    password1: "",
    password2: ""
})

const register = async () => {
    const response = await createUser(form.email, form.password1)
    // console.log(JSON.stringify(response))

    form.email = ""
    form.password1 = ""
    form.password2 = ""

    if (response.credentials) {
        msgSuccess.value = `Successfully signed up: ${response.credentials.user.email}`
        msgError.value = ""
        // TODO Send verification email and notify user in message
    } else {
        msgError.value = `Sign up failed: ${response.errorMessage}`
        msgSuccess.value = ""
    }

    change.value = !change.value
}

const continueGoogle = async () => {
    const response = await loginUserGoogle()

    if (response.credentials) {
        
    } else{
        msgError.value = `Login failed: ${response.errorMessage}`
        msgSuccess.value = ""
    }

    change.value = !change.value
}
</script>