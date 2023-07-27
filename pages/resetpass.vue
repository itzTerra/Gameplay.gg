<template>
    <Auth :success="msgSuccess" :error="msgError" :change="change" back-text="Login" back-link="/login/">
        <Transition name="slide" mode="out-in">
            <div v-if="!mailSent">
                <h3 class="mb-5 text-center text-3xl font-semibold">Reset Password</h3>
                <p class="font-semibold mb-3">Please enter the email connected to your account to set a new password.</p>
                <form @submit.prevent="sendEmail">
                    <input type="email" v-model="email" placeholder="Email address"
                        class="input input-lg input-bordered w-full" required>
                    <button class="w-full btn btn-primary my-5" type="submit">
                        <span v-show="loading == 'send'" class="loading loading-spinner"></span>
                        Send
                    </button>
                </form>
            </div>
            <div v-else>
                <h3 class="mb-5 text-center text-3xl font-semibold">Reset Password</h3>
                <p class="font-semibold mt-2">Password reset email sent. If you don't receive it in a minute, try to 
                    <button @click="sendEmail" class="link link-hover link-secondary">resend</button>.</p>
            </div>
        </Transition>
    </Auth>
</template>

<script setup>
useHead({title: "Reset password"})
const { sendPassResetEmail } = await useAuth()

const msgSuccess = ref("")
const msgError = ref("")
const change = ref(false)

const loading = ref("")

const email = ref("")
const mailSent = ref(false)

const sendEmail = async () => {
    loading.value = "send"

    if (await sendPassResetEmail(email.value.trim())) {
        msgSuccess.value = "Email sent successfully"
        msgError.value = ""

        mailSent.value = true
    } else {
        msgError.value = "Invalid email"
        msgSuccess.value = ""
        email.value = ""
    }
    change.value = !change.value
    loading.value = ""
}
</script>

<style scoped></style>