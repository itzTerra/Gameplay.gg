<template>
    <Auth :success="msgSuccess" :error="msgError">
        <h3 class="mb-5 text-center text-3xl font-semibold">Log In</h3>
        <form @submit.prevent="login">
            <div class="join join-vertical w-full">
                <input type="text" id="username" name="username" placeholder="Email address"
                    class="input input-lg input-bordered join-item" required>
                <input type="password" id="pass" name="pass" placeholder="Enter your password"
                    class="input input-lg input-bordered overflow-ellipsis join-item" required>
            </div>
            <button class="w-full btn btn-primary my-5" type="submit">Log In</button>
        </form>
        <p class="text-center">Don't have an account? <a href="/register/" class="link link-secondary">Sign up</a></p>
    </Auth>
</template>

<script setup lang="ts">

const { loginUser } = useAuth()

const msgSuccess = ref("")
const msgError = ref("")

const form = shallowReactive({
    email: "",
    password: "",
})

const login = async () => {
    const response = await loginUser(form.email, form.password)
    nextTick().then(() => {
        console.log(response.errorCode)
    }); // Wait for the next render cycle
    console.log(response)
    
    form.email = ""
    form.password = ""

    if (response.credentials) {
        msgSuccess.value = `Successfully logged in: ${response.credentials.user.email}`
        // setTimeout(() => {
        //     msgSuccess.value = ""
        // }, 3000);
    } else{
        msgError.value = `Login failed:\n(${response.errorCode}) ${response.errorMessage}`
        console.log(response.errorCode)
        // setTimeout(() => {
        //     msgError.value = ""
        // }, 3000);
    }
}

</script>

<style lang="scss" scoped></style>