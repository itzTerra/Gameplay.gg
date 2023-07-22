<template>
    <Auth :success="msgSuccess" :error="msgError" :change="change" back-text="Login" back-link="/login/">
        <Transition name="slide" mode="out-in">
            <div v-if="!passReset">
                <h3 class="mb-5 text-center text-3xl font-semibold">Set new password</h3>
                <p class="font-semibold mb-3">Please enter your new password.</p>
                <form @submit.prevent="confirmReset">
                    <div class="join join-vertical w-full mt-3">
                        <input type="password" v-model="pass1" placeholder="New password (8 characters min.)"
                            class="input input-bordered overflow-ellipsis input-lg join-item" required>
                        <input type="password" v-model="pass2" placeholder="Confirm password"
                            class="input input-bordered overflow-ellipsis input-lg join-item" required>
                    </div>
                    <button class="w-full btn btn-primary my-5" type="submit">
                        <span v-show="loading == 'submit'" class="loading loading-spinner"></span>
                        Submit
                    </button>
                </form>
            </div>
            <div v-else>
                <h3 class="mb-5 text-center text-3xl font-semibold">Set new password</h3>
                <p class="font-semibold mt-2">Password reset successful. You can now close this page...</p>
            </div>
        </Transition>
    </Auth>
</template>

<script setup>
const { confirmPassReset } = await useAuth()

const route = useRoute()
const router = useRouter()

onMounted(() => {
    if (!route.query.oobCode){
        navigateTo("/")
    }

    oobCode.value = route.query.oobCode
})

const msgSuccess = ref("")
const msgError = ref("")
const change = ref(false)

const loading = ref("")

const oobCode = ref("")
const pass1 = ref("")
const pass2 = ref("")
const passReset = ref(false)


const confirmReset = async () => {
    const passwordCheck = isValidPassword(pass1.value, pass2.value)
    if (!passwordCheck.valid){
        pass1.value = ""
        pass2.value = ""
        msgError.value = passwordCheck.msg
        msgSuccess.value = ""
        change.value = !change.value
        return
    }

    loading.value = "submit"
    try {
        await confirmPassReset(oobCode.value, pass1.value)
        msgSuccess.value = "Password successfully changed."
        msgError.value = ""

        passReset.value = true
        router.replace(route.fullPath)
    } catch (error){
        msgError.value = "Reset failed: "+error
        msgSuccess.value = ""
    }
    change.value = !change.value
    loading.value = ""
}
</script>

<style scoped></style>