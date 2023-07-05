<template>
    <div class="flex items-center justify-center flex-grow">
        <div class="w-96">
            <nav class="flex justify-center mb-2">
                <a href="/" class="hover:opacity-80">&#171; Home</a>
            </nav>
            <div class="bg-base-200 py-4 px-5 rounded-xl mb-3">
                <slot></slot>
                <div class="divider">OR</div>
                <div class="flex flex-col">
                    <button @click="continueGoogle">Continue with Google</button>
                </div>
            </div>
            <AlertSuccess v-if="success">{{ success }}</AlertSuccess>
            <AlertError v-if="error">{{ error }}</AlertError>
        </div>
    </div>
</template>

<script setup lang="ts">
const { success, error } = defineProps(['success', "error"])
console.log(error)

const { loginUserGoogle } = useAuth();

const continueGoogle = () => {
    const response = loginUserGoogle()

    if (response.credentials) {
        success.value = `Successfully logged in: ${response.credentials.user.email}`
        // setTimeout(() => {
        //     msgSuccess.value = ""
        // }, 3000);
    } else{
        error.value = `Login failed:\n(${response.errorCode}) ${response.errorMessage}`
        // setTimeout(() => {
        //     msgError.value = ""
        // }, 3000);
    }
}

</script>

<style lang="scss" scoped></style>