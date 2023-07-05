<template>
    <Auth :success="msgSuccess" :error="msgError">
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
        <p class="text-center">Already have an account? <a href="/login/" class="link link-secondary">Log in</a></p>
    </Auth>
</template>

<script setup lang="ts">

const { createUser } = useAuth()

const msgSuccess = ref("")
const msgError = ref("")

const form = shallowReactive({
    email: "",
    password1: "",
    password2: ""
})

const register = async () => {
    const response = await createUser(form.email, form.password1)
    form.email = ""
    form.password1 = ""
    form.password2 = ""

    if (response.credentials) {
        msgSuccess.value = `Successfully signed up: ${response.credentials.user.email}`
        // setTimeout(() => {
        //     msgSuccess.value = ""
        // }, 3000);
    } else{
        msgError.value = `Sign up failed:\n(${response.errorCode}) ${response.errorMessage}`
        // setTimeout(() => {
        //     msgError.value = ""
        // }, 3000);
    }
}

</script>

<style lang="scss" scoped></style>