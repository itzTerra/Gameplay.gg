<template>
    <Auth :success="msgSuccess" :error="msgError" :change="change">
        <!-- <button class="btn btn-success" @click="registered = !registered">TOGGLE</button> -->
        <Transition name="slide" mode="out-in">
            <div v-if="!registered">
                <h3 class="mb-5 text-center text-3xl font-semibold">Create an account</h3>
                <form @submit.prevent="register">
                    <div class="join join-vertical w-full">
                        <input type="text" v-model="registerForm.email" placeholder="Email address"
                            class="input input-bordered input-lg join-item" required>
                        <input type="password" v-model="registerForm.password1" placeholder="Password (8 characters min.)"
                            class="input input-bordered overflow-ellipsis input-lg join-item" required>
                        <input type="password" v-model="registerForm.password2" placeholder="Confirm password"
                            class="input input-bordered overflow-ellipsis input-lg join-item" required>
                    </div>
                    <div class="mt-2 text-sm opacity-75">
                        <SVGInfo class="inline w-5 h-5 me-1" />By signing in, you agree to this site's <NuxtLink
                            class="link hover:no-underline hover:text-accent-focus transition-colors">Terms of Service</NuxtLink> and <NuxtLink class="link hover:no-underline hover:text-accent-focus transition-colors">
                            Privacy Policy</NuxtLink>
                    </div>
                    <button class="w-full btn btn-primary my-5" type="submit">
                        <span v-show="loading == 'register'" class="loading loading-spinner"></span>
                        Sign Up
                    </button>
                </form>
                <p class="text-center">Already have an account? <NuxtLink to="/login/" class="link link-secondary">Log in
                    </NuxtLink>
                </p>
                <div class="divider">OR</div>
                <div class="flex flex-col">
                    <button class="btn" @click="continueGoogle" :disabled="user != null">Continue with Google</button>
                </div>
            </div>
            <div v-else>
                <div class="flex flex-col items-center mb-5">
                    <h3 class="mb-2 text-3xl font-semibold">Choose your username</h3>
                    <div class="w-11/12 text-sm opacity-75">
                        <SVGInfo class="inline w-5 h-5 me-1" />Unique identifier to be displayed under your comments or
                        submitted clips.
                    </div>
                </div>
                <form @submit.prevent="setUsername">
                    <div class="form-control w-full">
                        <label class="label">
                            <span class="label-text">I would like to be called...</span>
                        </label>
                        <input type="text" v-model="newUsername" placeholder="New username"
                            class="input input-bordered w-full" required />
                        <label class="label">
                            <span class="label-text">Current: <strong>{{ generatedUsername }}</strong></span>
                        </label>
                    </div>
                    <div class="mt-6 flex gap-5 justify-end items-end">
                        <button class="btn btn-secondary btn-sm" @click="navigateTo('/')">Keep current</button>
                        <button class="btn btn-primary" type="submit">
                            <span v-show="loading == 'applyUsername'" class="loading loading-spinner"></span>
                            Apply
                        </button>
                    </div>
                </form>
            </div>
        </Transition>
    </Auth>
</template>

<script setup lang="ts">

const user = await useUser()
const { createUser, loginUserGoogle, updateUsername } = await useAuth()
const clientSession = useClientSession()

const msgSuccess = ref("")
const msgError = ref("")
const change = ref(false)

const loading = ref("")

const registered = ref(false)
const generatedUsername = ref("")
const newUsername = ref("")

const registerForm = shallowReactive({
    email: "",
    password1: "",
    password2: ""
})

const register = async () => {
    const passwordCheck = isValidPassword(registerForm.password1, registerForm.password2)
    if (!passwordCheck.valid){
        registerForm.password1 = ""
        registerForm.password2 = ""
        msgError.value = `Sign up failed: ${passwordCheck.msg}`
        msgSuccess.value = ""
        change.value = !change.value
        return
    } 

    loading.value = "register"
    clientSession.value.rememberMe = true
    const regResponse = await createUser(registerForm.email, registerForm.password1)

    if (regResponse.credentials) {
        msgSuccess.value = `Successfully signed up and logged in: ${regResponse.credentials.user.email}`
        msgError.value = ""

        registered.value = true
        generatedUsername.value = regResponse.username!

        // TODO Send verification email and notify user in message
    } else {
        if (regResponse.errorCode == "auth/email-already-exists" || regResponse.errorCode == "auth/invalid-email") {
            registerForm.email = ""
        }
        if (regResponse.errorCode == "auth/invalid-password") {
            registerForm.password1 = ""
            registerForm.password2 = ""
        }

        msgError.value = `Sign up failed: ${regResponse.errorCode}`
        msgSuccess.value = ""
    }

    change.value = !change.value
    loading.value = ""
}

const setUsername = async () => {
    loading.value = "applyUsername"
    try {
        await updateUsername(user.value.uid, newUsername.value)

        msgSuccess.value = `Successfully changed username to: ${newUsername.value}`
        msgError.value = ""

        setTimeout(() => {
            navigateTo("/")
        }, 2000)
    } catch {
        msgError.value = `Error in changing username, try a different one`
        msgSuccess.value = ""
    }

    change.value = !change.value
    loading.value = ""
}


const continueGoogle = async () => {
    const response = await loginUserGoogle()

    if (response.credentials) {
        navigateTo("/")
    } else {
        msgError.value = `Login failed: ${response.errorCode}`
        msgSuccess.value = ""
    }

    change.value = !change.value
}
</script>
<style scoped>

</style>